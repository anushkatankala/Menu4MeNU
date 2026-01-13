package FoodApplication.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class RecipesExcelService {

    private final JdbcTemplate jdbcTemplate;

    public RecipesExcelService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // This imports recipes.xlsx into a Postgres table named "foods"
    public void importExcelToPostgres() {
        String excelFileName = "recipes.xlsx";
        String tableName = "foods";

        try (InputStream is = new ClassPathResource(excelFileName).getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                throw new IllegalArgumentException("Excel header row (row 0) is missing.");
            }

            // Read headers from Excel (row 0)
            List<String> columns = readHeaderColumns(headerRow);
            if (columns.isEmpty()) {
                throw new IllegalArgumentException("No headers found in the Excel file.");
            }

            // 1) Create table if not exists (all TEXT columns for simplicity)
            createTableIfNotExists(tableName, columns);

            // 2) Insert rows
            insertRows(sheet, tableName, columns);

        } catch (Exception e) {
            throw new RuntimeException("Failed to import Excel into PostgreSQL: " + e.getMessage(), e);
        }
    }

    private List<String> readHeaderColumns(Row headerRow) {
        List<String> cols = new ArrayList<>();
        short last = headerRow.getLastCellNum();

        for (int i = 0; i < last; i++) {
            Cell cell = headerRow.getCell(i);
            String raw = (cell == null) ? "" : cell.toString().trim();
            if (!raw.isEmpty()) {
                cols.add(toSafeSqlIdentifier(raw));
            }
        }
        return cols;
    }

    private void createTableIfNotExists(String tableName, List<String> columns) {
        StringBuilder sql = new StringBuilder();
        sql.append("CREATE TABLE IF NOT EXISTS ").append(tableName).append(" (");
        sql.append("id SERIAL PRIMARY KEY");

        for (String col : columns) {
            sql.append(", ").append(col).append(" TEXT");
        }

        sql.append(");");
        jdbcTemplate.execute(sql.toString());
    }

    private void insertRows(Sheet sheet, String tableName, List<String> columns) {
        String colList = String.join(", ", columns);
        String placeholders = String.join(", ", columns.stream().map(c -> "?").toList());
        String insertSql = "INSERT INTO " + tableName + " (" + colList + ") VALUES (" + placeholders + ")";

        DataFormatter formatter = new DataFormatter();

        for (int r = 1; r <= sheet.getLastRowNum(); r++) { // start after header
            Row row = sheet.getRow(r);
            if (row == null) continue;

            Object[] values = new Object[columns.size()];
            boolean allBlank = true;

            for (int c = 0; c < columns.size(); c++) {
                Cell cell = row.getCell(c);
                String value = (cell == null) ? "" : formatter.formatCellValue(cell).trim();
                values[c] = value;
                if (!value.isEmpty()) allBlank = false;
            }

            if (!allBlank) {
                jdbcTemplate.update(insertSql, values);
            }
        }
    }

    // Makes a safe SQL column name from Excel header text
    private String toSafeSqlIdentifier(String input) {
        String s = input.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "_")
                .replaceAll("^_+|_+$", "");

        if (s.isEmpty()) s = "col";
        if (Character.isDigit(s.charAt(0))) s = "col_" + s;

        return s;
    }
}

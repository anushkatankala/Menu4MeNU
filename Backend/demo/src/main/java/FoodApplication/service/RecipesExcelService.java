package FoodApplication.service;

import FoodApplication.model.Food;
import FoodApplication.repo.FoodRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class RecipesExcelService {

    private static final Logger logger = LoggerFactory.getLogger(RecipesExcelService.class);

    private final FoodRepository foodRepository;

    public RecipesExcelService(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    /**
     * Imports recipes.xlsx into PostgreSQL using JPA
     * Expected columns: Name, Main Nutrition, Ingredients, Recipes, Recommendations, Tags
     */
    @Transactional
    public void importExcelToPostgres() {
        String excelFileName = "recipes.xlsx";

        try (InputStream is = new ClassPathResource(excelFileName).getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);

            // Assume first row is header, so start from row 1
            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) continue;

                // Skip if row is completely empty
                if (isRowEmpty(row)) continue;

                String name = getCellStringValue(row.getCell(0));
                
                // Skip if no name
                if (name == null || name.trim().isEmpty()) continue;

                String mainNutrition = getCellStringValue(row.getCell(1));
                List<String> ingredients = parseCsvToList(getCellStringValue(row.getCell(2)));
                List<String> recipes = parseCsvToList(getCellStringValue(row.getCell(3)));
                List<String> recommendations = parseCsvToList(getCellStringValue(row.getCell(4)));
                List<String> tags = parseCsvToList(getCellStringValue(row.getCell(5)));

                // Create Food object
                Food food = new Food(
                        name,
                        mainNutrition,
                        ingredients,
                        recipes,
                        recommendations,
                        tags
                );

                // Save to database (will skip if duplicate name exists due to unique constraint)
                try {
                    if (!foodRepository.existsByNameIgnoreCase(name)) {
                        foodRepository.save(food);
                        logger.info("Imported: {}", name);
                    } else {
                        logger.warn("Skipped duplicate: {}", name);
                    }
                } catch (Exception e) {
                    logger.error("Failed to import row {}: {}", rowIndex, e.getMessage(), e);
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to import Excel into PostgreSQL: " + e.getMessage(), e);
        }
    }

    /**
     * Check if entire row is empty
     */
    private boolean isRowEmpty(Row row) {
        for (int i = 0; i < row.getLastCellNum(); i++) {
            Cell cell = row.getCell(i);
            if (cell != null && cell.getCellType() != CellType.BLANK) {
                String value = getCellStringValue(cell);
                if (value != null && !value.trim().isEmpty()) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Safely get a String from a cell (handles nulls and different cell types)
     */
    private String getCellStringValue(Cell cell) {
        if (cell == null) return "";

        CellType type = cell.getCellType();

        if (type == CellType.STRING) {
            return cell.getStringCellValue().trim();
        } else if (type == CellType.NUMERIC) {
            if (DateUtil.isCellDateFormatted(cell)) {
                return cell.getDateCellValue().toString();
            }
            // Format numeric value
            double numValue = cell.getNumericCellValue();
            if (numValue == (long) numValue) {
                return String.valueOf((long) numValue);
            }
            return String.valueOf(numValue);
        } else if (type == CellType.BOOLEAN) {
            return String.valueOf(cell.getBooleanCellValue());
        } else if (type == CellType.FORMULA) {
            try {
                return cell.getStringCellValue().trim();
            } catch (IllegalStateException e) {
                logger.warn("Failed to get string value from formula cell: {}", e.getMessage());
                try {
                    double numValue = cell.getNumericCellValue();
                    if (numValue == (long) numValue) {
                        return String.valueOf((long) numValue);
                    }
                    return String.valueOf(numValue);
                } catch (IllegalStateException ex) {
                    return "";
                }
            }
        }

        return "";
    }

    /**
     * Parse a comma-separated string into a List<String>
     */
    private List<String> parseCsvToList(String csv) {
        if (csv == null || csv.trim().isEmpty()) {
            return new ArrayList<>();
        }

        String[] parts = csv.split(",");
        List<String> list = new ArrayList<>();
        Arrays.stream(parts)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .forEach(list::add);

        return list;
    }
}
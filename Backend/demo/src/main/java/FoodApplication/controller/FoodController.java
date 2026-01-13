package FoodApplication.controller;

import FoodApplication.model.Food;
import FoodApplication.service.RecipesExcelService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/foods")
public class FoodController {

    private final RecipesExcelService recipesExcelService;

    public FoodController(RecipesExcelService recipesExcelService) {
        this.recipesExcelService = recipesExcelService;
    }

    /**
     * GET /api/foods
     * Reads recipes.xlsx from the resources folder and returns all rows as a list of Food objects.
     */
    @GetMapping
    public ResponseEntity<List<Food>> getAllFoods() {
        List<Food> foods = new ArrayList<>();
        String excelFileName = "recipes.xlsx";

        try (InputStream is = new ClassPathResource(excelFileName).getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);

            // Assume first row is header, so start from row 1
            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) continue;

                String name = getCellStringValue(row.getCell(0));
                String mainNutrition = getCellStringValue(row.getCell(1));
                List<String> ingredients = parseCsvToList(getCellStringValue(row.getCell(2)));
                List<String> recipes = parseCsvToList(getCellStringValue(row.getCell(3)));
                List<String> recommendations = parseCsvToList(getCellStringValue(row.getCell(4)));
                List<String> tags = parseCsvToList(getCellStringValue(row.getCell(5)));

                Food food = new Food(
                        name,
                        mainNutrition,
                        ingredients,
                        recipes,
                        recommendations,
                        tags
                );

                foods.add(food);
            }

            return ResponseEntity.ok(foods);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * POST /api/foods/import
     * Imports recipes.xlsx into PostgreSQL (creates table + inserts rows).
     */
    @GetMapping("/import")
    public ResponseEntity<String> importExcelToPostgres() {
        recipesExcelService.importExcelToPostgres();
        return ResponseEntity.ok("Imported recipes.xlsx into PostgreSQL");
    }

    /**
     * Safely get a String from a cell (handles nulls and different cell types).
     */
    private String getCellStringValue(Cell cell) {
        if (cell == null) return "";

        CellType type = cell.getCellType();

        if (type == CellType.STRING) {
            return cell.getStringCellValue().trim();
        } else if (type == CellType.NUMERIC) {
            // If you want integers without .0, you can adjust this later.
            return String.valueOf(cell.getNumericCellValue());
        } else if (type == CellType.BOOLEAN) {
            return String.valueOf(cell.getBooleanCellValue());
        } else if (type == CellType.FORMULA) {
            // Try to read formula result as string, otherwise numeric
            try {
                return cell.getStringCellValue().trim();
            } catch (IllegalStateException e) {
                try {
                    return String.valueOf(cell.getNumericCellValue());
                } catch (IllegalStateException ex) {
                    return "";
                }
            }
        }

        return "";
    }

    /**
     * Parse a comma-separated string into a List<String>.
     * Empty or null becomes an empty list.
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


package FoodApplication.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final JdbcTemplate jdbcTemplate;

    public UserController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Create or update user profile (called after Supabase signup)
     */
    @PostMapping("/profile")
    public ResponseEntity<Map<String, Object>> createUserProfile(@RequestBody Map<String, String> userData) {
        String userId = userData.get("id");
        String email = userData.get("email");
        String username = userData.get("username");
        String firstName = userData.get("first_name");

        try {
            // Call the helper function to create user and household
            Integer householdId = jdbcTemplate.queryForObject(
                "SELECT create_user_household(?, ?, ?, ?)",
                Integer.class,
                UUID.fromString(userId),
                email,
                username,
                firstName
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("household_id", householdId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get user's favorites
     */
    @GetMapping("/{userId}/favorites")
    public ResponseEntity<List<Long>> getUserFavorites(@PathVariable String userId) {
        try {
            String sql = "SELECT recipe_id FROM user_favorites WHERE user_id = ?";
            List<Long> favorites = jdbcTemplate.queryForList(
                sql, 
                Long.class, 
                UUID.fromString(userId)
            );
            
            return ResponseEntity.ok(favorites);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Add favorite
     */
    @PostMapping("/{userId}/favorites/{recipeId}")
    public ResponseEntity<Void> addFavorite(
        @PathVariable String userId, 
        @PathVariable Long recipeId
    ) {
        try {
            String sql = "INSERT INTO user_favorites (user_id, recipe_id) VALUES (?, ?) ON CONFLICT DO NOTHING";
            jdbcTemplate.update(sql, UUID.fromString(userId), recipeId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Remove favorite
     */
    @DeleteMapping("/{userId}/favorites/{recipeId}")
    public ResponseEntity<Void> removeFavorite(
        @PathVariable String userId, 
        @PathVariable Long recipeId
    ) {
        try {
            String sql = "DELETE FROM user_favorites WHERE user_id = ? AND recipe_id = ?";
            jdbcTemplate.update(sql, UUID.fromString(userId), recipeId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get user's household ID
     */
    @GetMapping("/{userId}/household")
    public ResponseEntity<Map<String, Object>> getUserHousehold(@PathVariable String userId) {
        try {
            String sql = "SELECT h.id, h.name FROM households h " +
                        "JOIN household_members hm ON h.id = hm.household_id " +
                        "WHERE hm.user_id = ?";
            
            Map<String, Object> household = jdbcTemplate.queryForMap(sql, UUID.fromString(userId));
            return ResponseEntity.ok(household);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get household inventory
     */
    @GetMapping("/household/{householdId}/inventory")
    public ResponseEntity<List<Map<String, Object>>> getHouseholdInventory(@PathVariable Integer householdId) {
        try {
            String sql = "SELECT * FROM household_inventory WHERE household_id = ? ORDER BY created_at DESC";
            List<Map<String, Object>> inventory = jdbcTemplate.queryForList(sql, householdId);
            return ResponseEntity.ok(inventory);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Add inventory item
     */
    @PostMapping("/household/{householdId}/inventory")
    public ResponseEntity<Void> addInventoryItem(
        @PathVariable Integer householdId,
        @RequestBody Map<String, String> item
    ) {
        try {
            String sql = "INSERT INTO household_inventory (household_id, name, quantity, category, added_by) " +
                        "VALUES (?, ?, ?, ?, ?)";
            
            jdbcTemplate.update(
                sql,
                householdId,
                item.get("name"),
                item.get("quantity"),
                item.get("category"),
                item.containsKey("added_by") ? UUID.fromString(item.get("added_by")) : null
            );
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Delete inventory item
     */
    @DeleteMapping("/household/inventory/{itemId}")
    public ResponseEntity<Void> deleteInventoryItem(@PathVariable Integer itemId) {
        try {
            String sql = "DELETE FROM household_inventory WHERE id = ?";
            jdbcTemplate.update(sql, itemId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get household needed items
     */
    @GetMapping("/household/{householdId}/needed")
    public ResponseEntity<List<Map<String, Object>>> getNeededItems(@PathVariable Integer householdId) {
        try {
            String sql = "SELECT * FROM household_needed_items WHERE household_id = ? ORDER BY created_at DESC";
            List<Map<String, Object>> needed = jdbcTemplate.queryForList(sql, householdId);
            return ResponseEntity.ok(needed);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Add needed item
     */
    @PostMapping("/household/{householdId}/needed")
    public ResponseEntity<Void> addNeededItem(
        @PathVariable Integer householdId,
        @RequestBody Map<String, String> item
    ) {
        try {
            String sql = "INSERT INTO household_needed_items (household_id, name, added_by) VALUES (?, ?, ?)";
            jdbcTemplate.update(
                sql,
                householdId,
                item.get("name"),
                item.containsKey("added_by") ? UUID.fromString(item.get("added_by")) : null
            );
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Delete needed item
     */
    @DeleteMapping("/household/needed/{itemId}")
    public ResponseEntity<Void> deleteNeededItem(@PathVariable Integer itemId) {
        try {
            String sql = "DELETE FROM household_needed_items WHERE id = ?";
            jdbcTemplate.update(sql, itemId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}

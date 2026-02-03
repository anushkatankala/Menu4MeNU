package FoodApplication.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

@RestController
@RequestMapping("/api/prices")
@CrossOrigin(origins = "http://localhost:5173")
public class PriceController {

    /**
     * Price result model
     */
    public static class PriceResult {
        public String store;
        public Double price;
        public String unit;
        public String distance;
        public String logo;
        public String productUrl;

        public PriceResult(String store, Double price, String unit, String distance, String logo, String productUrl) {
            this.store = store;
            this.price = price;
            this.unit = unit;
            this.distance = distance;
            this.logo = logo;
            this.productUrl = productUrl;
        }
    }

    /**
     * Search for product prices across multiple stores
     */
    @GetMapping("/search")
    public ResponseEntity<List<PriceResult>> searchPrices(@RequestParam String query) {
        List<PriceResult> results = new ArrayList<>();

        try {
            // Search Walmart Canada
            results.addAll(searchWalmartCanada(query));
            
            // You can add more stores here
            // results.addAll(searchLoblaws(query));
            // results.addAll(searchMetro(query));

            // Sort by price (lowest first)
            results.sort(Comparator.comparing(r -> r.price));

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            e.printStackTrace();
            // Return empty list on error
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    /**
     * Search Walmart Canada
     */
    private List<PriceResult> searchWalmartCanada(String query) {
        List<PriceResult> results = new ArrayList<>();
        
        // 1. Setup Chrome in Headless mode (runs in background)
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless"); 
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");

        WebDriver driver = new ChromeDriver(options);

        try {
            String searchUrl = "https://www.walmart.ca/search?q=" + query.replace(" ", "+");
            driver.get(searchUrl);

            // 2. Wait up to 10 seconds for the product tiles to appear
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("div[data-testid='item-stack']")));

            // 3. Find elements using Selenium (same logic, but better access)
            List<WebElement> products = driver.findElements(By.cssSelector("div[data-testid='product-stack-tile']"));

            for (int i = 0; i < Math.min(products.size(), 3); i++) {
                WebElement product = products.get(i);
                try {
                    String name = product.findElement(By.cssSelector("span[data-automation='product-title']")).getText();
                    String priceText = product.findElement(By.cssSelector("span[data-automation='item-price']")).getText();
                    String link = product.findElement(By.tagName("a")).getAttribute("href");

                    Double price = extractPrice(priceText);
                    if (price != null) {
                        results.add(new PriceResult("Walmart", price, "each", "Local", "🏪", link));
                    }
                } catch (Exception e) {
                    continue;
                }
            }
        } catch (Exception e) {
            System.err.println("Selenium Error: " + e.getMessage());
        } finally {
            driver.quit(); // Always close the browser!
        }
        return results;
    }

    /**
     * Extract price from text like "$5.99" or "5.99"
     */
    private Double extractPrice(String priceText) {
        if (priceText == null || priceText.isEmpty()) {
            return null;
        }
        
        try {
            // Remove currency symbols and whitespace
            String cleaned = priceText.replaceAll("[^0-9.]", "");
            return Double.parseDouble(cleaned);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /**
     * Mock data endpoint (fallback for testing)
     */
    @GetMapping("/mock")
    public ResponseEntity<List<PriceResult>> getMockPrices(@RequestParam String query) {
        List<PriceResult> results = new ArrayList<>();
        
        // Generate some mock results based on common items
        if (query.toLowerCase().contains("milk")) {
            results.add(new PriceResult("Walmart", 4.99, "4L", "2.5 km", "🏪", "#"));
            results.add(new PriceResult("Loblaws", 5.49, "4L", "1.8 km", "🛒", "#"));
            results.add(new PriceResult("Metro", 5.29, "4L", "3.2 km", "🏬", "#"));
        } else if (query.toLowerCase().contains("bread")) {
            results.add(new PriceResult("Walmart", 2.49, "loaf", "2.5 km", "🏪", "#"));
            results.add(new PriceResult("Loblaws", 2.99, "loaf", "1.8 km", "🛒", "#"));
        } else if (query.toLowerCase().contains("eggs")) {
            results.add(new PriceResult("Walmart", 3.99, "dozen", "2.5 km", "🏪", "#"));
            results.add(new PriceResult("Costco", 6.99, "18 pack", "5.0 km", "📦", "#"));
        } else {
            // Generic results
            results.add(new PriceResult("Walmart", 3.99, "each", "2.5 km", "🏪", "#"));
            results.add(new PriceResult("Loblaws", 4.49, "each", "1.8 km", "🛒", "#"));
        }
        
        return ResponseEntity.ok(results);
    }
}
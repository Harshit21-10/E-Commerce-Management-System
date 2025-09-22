package com.ecommerce.com.ecommerce.flash.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.ecommerce.com.ecommerce.flash.util.FileUploadUtil;
import java.util.HashMap;
import java.util.Map;

import com.ecommerce.com.ecommerce.flash.dao.ProductDao;
import com.ecommerce.com.ecommerce.flash.entity.Product;
import com.ecommerce.com.ecommerce.flash.entity.ProductOwner;
import com.ecommerce.com.ecommerce.flash.repository.ProductOwnerRepository;
import com.ecommerce.com.ecommerce.flash.repository.ProductRepository;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowCredentials = "true")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductDao productDao;

    @Autowired
    private ProductOwnerRepository productOwnerRepository;

    @Autowired
    private ProductRepository productRepository;
    
    // DTO for Product Data Transfer
    public static class ProductDTO {
        private Long id;
        private String name;
        private String description;
        private double price;
        private int stock;
        private String category;
        private boolean available;
        private List<String> productSizes;
        private List<String> productColors;
        private String productImageBase64;
        private ProductOwner productOwner;
        private boolean approved;

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
        public int getStock() { return stock; }
        public void setStock(int stock) { this.stock = stock; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public boolean isAvailable() { return available; }
        public void setAvailable(boolean available) { this.available = available; }
        public List<String> getProductSizes() { return productSizes; }
        public void setProductSizes(List<String> productSizes) { this.productSizes = productSizes; }
        public List<String> getProductColors() { return productColors; }
        public void setProductColors(List<String> productColors) { this.productColors = productColors; }
        public String getProductImageBase64() { return productImageBase64; }
        public void setProductImageBase64(String productImageBase64) { this.productImageBase64 = productImageBase64; }
        public ProductOwner getProductOwner() { return productOwner; }
        public void setProductOwner(ProductOwner productOwner) { this.productOwner = productOwner; }
        public boolean isApproved() { return approved; }
        public void setApproved(boolean approved) { this.approved = approved; }
    }
    
    // Convert Product -> ProductDTO
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        dto.setCategory(product.getCategory());
        dto.setAvailable(product.isAvailable());
        dto.setProductSizes(product.getProductSizes());
        dto.setProductColors(product.getProductColors());
        dto.setProductOwner(product.getProductOwner());
        dto.setApproved(product.isApproved());

        // Handle image
        String imageData = product.getProductImage();
        if (imageData != null) {
            System.out.println("Product " + product.getId() + " has image data");
            
            // If it's a URL (including Unsplash URLs), use it directly
            if (imageData.startsWith("http")) {
                System.out.println("Processing URL: " + imageData);
                // Add optimization parameters for Unsplash URLs if needed
                if (imageData.contains("images.unsplash.com") && !imageData.contains("?")) {
                    imageData += "?w=800&q=80&auto=format&fit=crop";
                    System.out.println("Added optimization parameters: " + imageData);
                }
                dto.setProductImageBase64(imageData);
            } else {
                // For any other string, assume it's a base64 string
                System.out.println("Processing as base64 data");
                if (!imageData.startsWith("data:")) {
                    try {
                        // Verify it's valid base64
                        Base64.getDecoder().decode(imageData);
                        dto.setProductImageBase64("data:image/jpeg;base64," + imageData);
                        System.out.println("Successfully processed base64 data");
                    } catch (IllegalArgumentException e) {
                        System.out.println("Invalid base64 data, using placeholder");
                        dto.setProductImageBase64("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23666666'%3ENo Image Available%3C/text%3E%3C/svg%3E");
                    }
                } else {
                    // Already has data URL prefix
                    dto.setProductImageBase64(imageData);
                }
            }
        } else {
            System.out.println("Product " + product.getId() + " has no image data");
            dto.setProductImageBase64("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23666666'%3ENo Image Available%3C/text%3E%3C/svg%3E");
        }
        return dto;
    }
    
    // Fetch All Products
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        System.out.println("GET /products endpoint called");
        List<Product> products = productDao.getAllProducts();
        System.out.println("Found " + products.size() + " products");
        List<ProductDTO> productDTOs = products.stream()
                                               .map(this::convertToDTO)
                                               .collect(Collectors.toList());
        System.out.println("Converted to DTOs, returning response");
        return ResponseEntity.ok(productDTOs);
    }
    
    // Fetch Product by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        Optional<Product> optionalProduct = productDao.getProductById(id);
        if (optionalProduct.isPresent()) {
            return ResponseEntity.ok(convertToDTO(optionalProduct.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
        }
    }
    
    // Fetch Approved Products
    @GetMapping("/approved")
    public ResponseEntity<List<ProductDTO>> getApprovedProducts() {
        List<Product> approvedProducts = productRepository.findByApproved(true);
        List<ProductDTO> productDTOs = approvedProducts.stream()
                                                       .map(this::convertToDTO)
                                                       .collect(Collectors.toList());
        return ResponseEntity.ok(productDTOs);
    }
    
    // Approve a Product
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveProduct(@PathVariable Long id) {
        Optional<Product> optionalProduct = productDao.getProductById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setApproved(true);
            productDao.saveProduct(product);
            return ResponseEntity.ok("Product approved successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
        }
    }
    
    // Delete a Product
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            Optional<Product> prodOpt = productDao.getProductById(id);
            if (prodOpt.isPresent()) {
                Product product = prodOpt.get();
                if (product.getProductSizes() != null) {
                    product.getProductSizes().clear();
                }
                if (product.getProductColors() != null) {
                    product.getProductColors().clear();
                }
                productDao.saveProduct(product);
                productDao.deleteProduct(id);
                return ResponseEntity.ok("Product deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting product.");
        }
    }
    
    // Add Product (multipart/form-data)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProduct(
        @RequestParam("name") String name,
        @RequestParam("description") String description,
        @RequestParam("price") double price,
        @RequestParam("stock") int stock,
        @RequestParam("category") String category,
        @RequestParam("productOwnerId") Long productOwnerId,
        @RequestParam("productSizes") String productSizes,    // Comma-separated sizes
        @RequestParam("productColors") String productColors,  // Comma-separated colors
        @RequestParam("available") boolean available,
        @RequestParam(value = "images", required = false) List<String> imageUrls,  // For direct URLs
        @RequestParam(value = "files", required = false) List<MultipartFile> files  // For file uploads
    ) {
        try {
            Product product = new Product();
            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setStock(stock);
            product.setCategory(category);
            product.setAvailable(available);
            
            if (productSizes != null && !productSizes.isEmpty()) {
                List<String> sizes = Arrays.asList(productSizes.split(","));
                product.setProductSizes(sizes);
            } else {
                product.setProductSizes(Collections.emptyList());
            }
            if (productColors != null && !productColors.isEmpty()) {
                List<String> colors = Arrays.asList(productColors.split(","));
                product.setProductColors(colors);
            } else {
                product.setProductColors(Collections.emptyList());
            }
            
            // Handle direct image URLs
            if (imageUrls != null && !imageUrls.isEmpty()) {
                String imageUrl = imageUrls.get(0);
                if (imageUrl != null && !imageUrl.isEmpty()) {
                    product.setProductImage(imageUrl);
                    System.out.println("Image URL set: " + imageUrl);
                }
            } 
            // Handle file uploads
            else if (files != null && !files.isEmpty()) {
                MultipartFile file = files.get(0);
                if (!file.isEmpty()) {
                    byte[] imageBytes = file.getBytes();
                    String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                    product.setProductImage(base64Image);
                    System.out.println("Image processed and stored as base64");
                }
            } else {
                System.out.println("No image provided");
            }
            
            Optional<ProductOwner> optOwner = productOwnerRepository.findById(productOwnerId);
            if (!optOwner.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid product owner ID");
            }
            product.setProductOwner(optOwner.get());
            
            Product savedProduct = productDao.saveProduct(product);
            return ResponseEntity.ok(convertToDTO(savedProduct));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing image file.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding product: " + e.getMessage());
        }
    }
    
    // NEW: Fetch Products by Owner ID
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<?> getProductsByOwner(@PathVariable Long ownerId) {
        List<Product> products = productDao.getProductsByOwnerId(ownerId);
        return ResponseEntity.ok(products);
    }
    
    // Upload product image
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        System.out.println("Received file upload request");
        System.out.println("File name: " + file.getOriginalFilename());
        System.out.println("Content type: " + file.getContentType());
        System.out.println("File size: " + file.getSize() + " bytes");
        
        try {
            if (file.isEmpty()) {
                System.out.println("Upload failed: File is empty");
                return ResponseEntity.badRequest().body("Please select a file to upload");
            }
            
            System.out.println("Saving file...");
            // Save the file and get the file path
            String filePath = FileUploadUtil.saveFile(file);
            System.out.println("File saved to: " + filePath);
            
            // Create a response with the file URL
            String fileUrl = "http://localhost:9090" + filePath;
            Map<String, String> response = new HashMap<>();
            response.put("fileUrl", fileUrl);
            
            System.out.println("Upload successful. File URL: " + fileUrl);
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            System.err.println("Error during file upload:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to upload file: " + e.getMessage());
        }
    }
    
    // Add this method to serve uploaded files
    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/").resolve(filename).normalize();
            byte[] imageBytes = Files.readAllBytes(filePath);
            
            // Determine content type based on file extension
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(imageBytes);
                
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}

package com.ecommerce.com.ecommerce.flash.util;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

public class FileUploadUtil {
    
    private static final String UPLOAD_DIR = "uploads/";
    
    public static String saveFile(MultipartFile file) throws IOException {
        System.out.println("Starting file upload process...");
        System.out.println("Original filename: " + file.getOriginalFilename());
        System.out.println("Content type: " + file.getContentType());
        
        // Get the absolute path for better debugging
        Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
        System.out.println("Upload directory: " + uploadPath.toString());
        
        // Create uploads directory if it doesn't exist
        if (!Files.exists(uploadPath)) {
            System.out.println("Creating upload directory: " + uploadPath);
            try {
                Files.createDirectories(uploadPath);
                System.out.println("Directory created successfully");
            } catch (Exception e) {
                System.err.println("Failed to create directory: " + e.getMessage());
                throw new IOException("Could not create upload directory: " + e.getMessage(), e);
            }
        }
        
        // Check if directory is writable
        if (!Files.isWritable(uploadPath)) {
            String error = "Upload directory is not writable: " + uploadPath;
            System.err.println(error);
            throw new IOException(error);
        }
        
        // Generate a unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        
        // Save the file
        Path filePath = uploadPath.resolve(uniqueFilename);
        System.out.println("Saving file to: " + filePath);
        
        try {
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("File saved successfully");
            
            // Verify the file was created and is readable
            if (!Files.exists(filePath) || !Files.isReadable(filePath)) {
                throw new IOException("Failed to verify the uploaded file");
            }
            
            // Return the relative file path
            String relativePath = "/" + UPLOAD_DIR + uniqueFilename;
            System.out.println("Returning relative path: " + relativePath);
            return relativePath;
            
        } catch (IOException e) {
            System.err.println("Error saving file: " + e.getMessage());
            // Clean up in case of partial upload
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException ex) {
                System.err.println("Failed to clean up file after error: " + ex.getMessage());
            }
            throw e;
        }
}}

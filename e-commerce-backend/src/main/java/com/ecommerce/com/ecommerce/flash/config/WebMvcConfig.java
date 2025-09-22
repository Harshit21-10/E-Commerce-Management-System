package com.ecommerce.com.ecommerce.flash.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadDir = Paths.get("uploads").toAbsolutePath().toString();
        System.out.println("Serving static files from: " + uploadDir);
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///" + uploadDir.replace("\\", "/") + "/")
                .setCachePeriod(0);
    }
}

package com.bisa.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:8081", 
                    "http://localhost:8082", 
                    "http://localhost:3000", 
                    "http://localhost:19006",
                    "https://your-production-domain.com", // Add your production domain
                    "https://bisa-app.vercel.app", // Example production URL
                    "https://bisa-app.netlify.app"  // Example production URL
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
} 
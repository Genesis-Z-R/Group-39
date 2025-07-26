package com.bisa.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {
    @Value("${firebase.service.account.key.path}")
    private String serviceAccountKeyPath;
    
    @PostConstruct
    public void init() throws IOException {
        try {
            // Try to load the service account file
            String filePath = serviceAccountKeyPath.replace("classpath:", "src/main/resources/");
            FileInputStream serviceAccount = new FileInputStream(filePath);
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (Exception e) {
            // If Firebase service account is not available, log warning but don't fail
            System.out.println("Warning: Firebase service account not found. Firebase features will be disabled.");
            System.out.println("Expected file: " + serviceAccountKeyPath);
        }
    }
} 
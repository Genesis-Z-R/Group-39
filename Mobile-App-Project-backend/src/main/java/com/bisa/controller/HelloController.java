package com.bisa.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/hello")
public class HelloController {
    @GetMapping
    public String hello() {
        return "Hello from Bisa backend!";
    }
    
    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "Bisa Backend");
        health.put("timestamp", System.currentTimeMillis());
        health.put("version", "1.0.0");
        return health;
    }
} 
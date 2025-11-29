package com.tunistudent.controller;

import com.tunistudent.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/generate-description")
    public ResponseEntity<Map<String, String>> generateDescription(@RequestBody Map<String, String> request) {
        String title = request.get("title");
        String category = request.get("category");
        
        String description = aiService.generateDescription(title, category);
        return ResponseEntity.ok(Map.of("description", description));
    }
}

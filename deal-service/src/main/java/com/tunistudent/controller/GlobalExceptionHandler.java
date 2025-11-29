package com.tunistudent.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception e) {
        System.err.println("GlobalExceptionHandler caught exception: " + e.getClass().getName());
        System.err.println("Message: " + e.getMessage());
        e.printStackTrace();
        
        Map<String, String> error = new HashMap<>();
        error.put("error", "Internal Server Error");
        error.put("message", e.getMessage() != null ? e.getMessage() : "An unexpected error occurred");
        error.put("type", e.getClass().getSimpleName());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        System.err.println("GlobalExceptionHandler caught RuntimeException: " + e.getMessage());
        e.printStackTrace();
        
        Map<String, String> error = new HashMap<>();
        error.put("error", "Error");
        error.put("message", e.getMessage() != null ? e.getMessage() : "An error occurred");
        error.put("type", e.getClass().getSimpleName());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}


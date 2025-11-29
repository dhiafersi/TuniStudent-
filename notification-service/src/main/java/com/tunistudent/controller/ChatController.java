package com.tunistudent.controller;

import com.tunistudent.model.ChatMessage;
import com.tunistudent.model.User;
import com.tunistudent.service.ChatService;
import com.tunistudent.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;
    
    @Autowired
    private com.tunistudent.service.SecurityUserService securityUserService;

    private User getCurrentUser() {
        return securityUserService.getCurrentUserOrThrow();
    }

    @GetMapping
    public ResponseEntity<List<ChatMessage>> getMyMessages() {
        User user = getCurrentUser();
        return ResponseEntity.ok(chatService.getMessages(user.getId()));
    }

    @PostMapping
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody Map<String, String> request) {
        User user = getCurrentUser();
        String content = request.get("content");
        // Determine if admin based on role
        boolean isAdmin = user.getRoles().contains("ROLE_ADMIN"); 
        
        return ResponseEntity.ok(chatService.sendMessage(user.getId(), null, user.getFullName(), content, isAdmin));
    }
}

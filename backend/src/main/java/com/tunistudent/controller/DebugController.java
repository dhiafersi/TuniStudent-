package com.tunistudent.controller;

import com.tunistudent.model.ChatMessage;
import com.tunistudent.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@CrossOrigin(origins = "*")
public class DebugController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    /**
     * Debug endpoint to see all chat messages in database
     */
    @GetMapping("/chat-messages")
    public ResponseEntity<Map<String, Object>> getAllChatMessages() {
        List<ChatMessage> allMessages = chatMessageRepository.findAll();
        
        Map<String, Object> response = new HashMap<>();
        response.put("totalMessages", allMessages.size());
        response.put("messages", allMessages);
        
        // Group by user
        Map<Long, Long> messagesByUser = new HashMap<>();
        for (ChatMessage msg : allMessages) {
            messagesByUser.put(msg.getSenderId(), 
                messagesByUser.getOrDefault(msg.getSenderId(), 0L) + 1);
        }
        response.put("messageCountByUser", messagesByUser);
        
        return ResponseEntity.ok(response);
    }
}

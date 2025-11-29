package com.tunistudent.controller;

import com.tunistudent.model.ChatMessage;
import com.tunistudent.model.User;
import com.tunistudent.service.ChatService;
import com.tunistudent.service.SecurityUserService;
import com.tunistudent.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/chat")
@PreAuthorize("hasRole('ADMIN')")
public class AdminChatController {

    @Autowired
    private ChatService chatService;
    
    @Autowired
    private SecurityUserService securityUserService;
    
    @Autowired
    private UserRepository userRepository;

    /**
     * Get list of all user conversations with message preview
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<Map<String, Object>>> getConversations() {
        List<Long> userIds = chatService.getActiveUserIds();
        
        List<Map<String, Object>> conversations = new ArrayList<>();
        for (Long userId : userIds) {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) continue;
            
            User user = userOpt.get();
            List<ChatMessage> messages = chatService.getAllMessagesForUser(userId);
            
            Map<String, Object> conversation = new HashMap<>();
            conversation.put("userId", userId);
            conversation.put("userName", user.getFullName());
            conversation.put("messageCount", messages.size());
            
            // Get last message
            if (!messages.isEmpty()) {
                ChatMessage lastMsg = messages.get(messages.size() - 1);
                conversation.put("lastMessage", lastMsg.getContent());
                conversation.put("lastMessageTime", lastMsg.getTimestamp());
                conversation.put("lastMessageFromAdmin", lastMsg.isAdmin());
            }
            
            conversations.add(conversation);
        }
        
        // Sort by most recent message first
        conversations.sort((a, b) -> {
            Object timeA = a.get("lastMessageTime");
            Object timeB = b.get("lastMessageTime");
            if (timeA == null) return 1;
            if (timeB == null) return -1;
            return ((Comparable) timeB).compareTo(timeA);
        });
        
        return ResponseEntity.ok(conversations);
    }

    /**
     * Get full conversation with specific user
     */
    @GetMapping("/conversation/{userId}")
    public ResponseEntity<List<ChatMessage>> getConversation(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getAllMessagesForUser(userId));
    }

    /**
     * Admin sends reply to user
     */
    @PostMapping("/reply")
    public ResponseEntity<ChatMessage> sendReply(@RequestBody Map<String, Object> request) {
        User admin = securityUserService.getCurrentUserOrThrow();
        Long userId = Long.valueOf(request.get("userId").toString());
        String content = (String) request.get("content");
        
        // Admin message is sent with admin's ID as sender, but marked as isAdmin=true
        ChatMessage message = chatService.sendMessage(admin.getId(), userId, "Support Team", content, true);
        
        return ResponseEntity.ok(message);
    }
}

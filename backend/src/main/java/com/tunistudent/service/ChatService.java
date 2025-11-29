package com.tunistudent.service;

import com.tunistudent.model.ChatMessage;
import com.tunistudent.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatService {
    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public ChatMessage sendMessage(Long senderId, Long recipientId, String senderName, String content, boolean isAdmin) {
        ChatMessage message = new ChatMessage(senderId, recipientId, senderName, content, isAdmin);
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getMessages(Long userId) {
        // For users: get all their messages (both sent by them and sent to them by admin)
        // This includes their own messages and admin replies specifically to them
        return chatMessageRepository.findAll().stream()
            .filter(msg -> msg.getSenderId().equals(userId) || (msg.isAdmin() && userId.equals(msg.getRecipientId())))
            .sorted((a, b) -> a.getTimestamp().compareTo(b.getTimestamp()))
            .toList();
    }
    
    // Admin methods
    public List<ChatMessage> getAllMessagesForUser(Long userId) {
        // Get complete conversation for a specific user
        // This includes: messages sent by this user + admin messages sent TO this user
        return chatMessageRepository.findAll().stream()
            .filter(msg -> msg.getSenderId().equals(userId) || (msg.isAdmin() && userId.equals(msg.getRecipientId())))
            .sorted((a, b) -> a.getTimestamp().compareTo(b.getTimestamp()))
            .toList();
    }
    
    public List<Long> getActiveUserIds() {
        // Get distinct user IDs who have sent messages (excluding admin messages)
        return chatMessageRepository.findAll().stream()
            .filter(msg -> !msg.isAdmin())
            .map(ChatMessage::getSenderId)
            .distinct()
            .toList();
    }
}

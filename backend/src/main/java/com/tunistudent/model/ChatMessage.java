package com.tunistudent.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long senderId; // User ID
    private Long recipientId; // Target User ID (null for messages to admin)
    private String senderName; // Cache name for display
    private String content;
    private boolean isAdmin = false; // True if sent by admin
    private LocalDateTime timestamp = LocalDateTime.now();

    public ChatMessage() {}

    public ChatMessage(Long senderId, Long recipientId, String senderName, String content, boolean isAdmin) {
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.senderName = senderName;
        this.content = content;
        this.isAdmin = isAdmin;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public Long getRecipientId() { return recipientId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public boolean isAdmin() { return isAdmin; }
    public void setAdmin(boolean admin) { isAdmin = admin; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}

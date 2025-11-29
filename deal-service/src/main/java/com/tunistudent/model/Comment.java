package com.tunistudent.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long dealId;
    private Long userId;
    private String userName; // Cache for display
    
    @Column(length = 1000)
    private String content;
    
    private LocalDateTime createdAt = LocalDateTime.now();

    public Comment() {}

    public Comment(Long dealId, Long userId, String userName, String content) {
        this.dealId = dealId;
        this.userId = userId;
        this.userName = userName;
        this.content = content;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getDealId() { return dealId; }
    public void setDealId(Long dealId) { this.dealId = dealId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

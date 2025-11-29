package com.tunistudent.repository;

import com.tunistudent.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySenderIdOrderByTimestampAsc(Long senderId);
    // For admin to see all messages, or filter by user
}

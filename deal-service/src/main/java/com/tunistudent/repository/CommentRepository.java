package com.tunistudent.repository;

import com.tunistudent.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByDealIdOrderByCreatedAtDesc(Long dealId);
    long countByUserId(Long userId);
}

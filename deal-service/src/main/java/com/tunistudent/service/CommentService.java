package com.tunistudent.service;

import com.tunistudent.model.Comment;
import com.tunistudent.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private AIService aiService;

    public Comment addComment(Long dealId, Long userId, String userName, String content) {
        if (!aiService.isContentSafe(content)) {
            throw new RuntimeException("Comment contains inappropriate language and cannot be posted.");
        }
        Comment comment = new Comment(dealId, userId, userName, content);
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsForDeal(Long dealId) {
        return commentRepository.findByDealIdOrderByCreatedAtDesc(dealId);
    }

    public Comment updateComment(Long commentId, String content, Long userId, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!isAdmin && !comment.getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to update this comment");
        }
        
        if (!aiService.isContentSafe(content)) {
            throw new RuntimeException("Comment contains inappropriate language and cannot be updated.");
        }
        
        comment.setContent(content);
        return commentRepository.save(comment);
    }

    public void deleteComment(Long commentId, Long userId, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!isAdmin && !comment.getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to delete this comment");
        }
        
        commentRepository.delete(comment);
    }

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }
}

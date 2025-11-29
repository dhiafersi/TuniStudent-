package com.tunistudent.controller;

import com.tunistudent.model.Comment;
import com.tunistudent.model.User;
import com.tunistudent.service.CommentService;
import com.tunistudent.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;
    
    @Autowired
    private com.tunistudent.service.SecurityUserService securityUserService;

    private User getCurrentUser() {
        return securityUserService.getCurrentUserOrThrow();
    }

    @GetMapping("/deal/{dealId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long dealId) {
        return ResponseEntity.ok(commentService.getCommentsForDeal(dealId));
    }

    @PostMapping("/deal/{dealId}")
    public ResponseEntity<Comment> addComment(@PathVariable Long dealId, @RequestBody Map<String, String> request) {
        User user = getCurrentUser();
        String content = request.get("content");
        return ResponseEntity.ok(commentService.addComment(dealId, user.getId(), user.getFullName(), content));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long id, @RequestBody Map<String, String> request) {
        User user = getCurrentUser();
        String content = request.get("content");
        boolean isAdmin = user.getRoles().contains("ADMIN");
        return ResponseEntity.ok(commentService.updateComment(id, content, user.getId(), isAdmin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        User user = getCurrentUser();
        boolean isAdmin = user.getRoles().contains("ADMIN");
        commentService.deleteComment(id, user.getId(), isAdmin);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<Comment>> getAllComments() {
        User user = getCurrentUser();
        if (!user.getRoles().contains("ADMIN")) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(commentService.getAllComments());
    }
}

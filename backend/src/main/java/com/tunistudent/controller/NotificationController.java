package com.tunistudent.controller;

import com.tunistudent.model.Notification;
import com.tunistudent.model.User;
import com.tunistudent.service.NotificationService;
import com.tunistudent.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private com.tunistudent.service.SecurityUserService securityUserService;

    private User getCurrentUser() {
        return securityUserService.getCurrentUserOrThrow();
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications() {
        User user = getCurrentUser();
        return ResponseEntity.ok(notificationService.getUserNotifications(user.getId()));
    }
    
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        User user = getCurrentUser();
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(user.getId())));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}

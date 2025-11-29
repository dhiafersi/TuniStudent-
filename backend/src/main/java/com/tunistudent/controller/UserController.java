package com.tunistudent.controller;

import com.tunistudent.model.User;
import com.tunistudent.repository.CommentRepository;
import com.tunistudent.repository.DealRepository;
import com.tunistudent.repository.FavoriteRepository;
import com.tunistudent.repository.ReservationRepository;
import com.tunistudent.service.SecurityUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private SecurityUserService securityUserService;

    @Autowired
    private DealRepository dealRepository;

    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private FavoriteRepository favoriteRepository;
    
    @Autowired
    private CommentRepository commentRepository;

    @GetMapping("/me/stats")
    public ResponseEntity<Map<String, Object>> getMyStats() {
        User user = securityUserService.getCurrentUserOrThrow();
        Long userId = user.getId();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("user", user);
        
        stats.put("dealsPosted", dealRepository.countBySubmittedBy(user));
        stats.put("reservationsCount", reservationRepository.findByUserIdOrderByCreatedAtDesc(userId).size());
        stats.put("favoritesCount", favoriteRepository.countByUser(user));
        stats.put("commentsCount", commentRepository.countByUserId(userId));
        
        return ResponseEntity.ok(stats);
    }
}

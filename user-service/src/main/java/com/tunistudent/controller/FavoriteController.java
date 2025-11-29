package com.tunistudent.controller;

import com.tunistudent.model.Deal;
import com.tunistudent.model.Favorite;
import com.tunistudent.model.User;
import com.tunistudent.repository.DealRepository;
import com.tunistudent.repository.FavoriteRepository;
import com.tunistudent.service.SecurityUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    private final FavoriteRepository favoriteRepository;
    private final DealRepository dealRepository;
    private final SecurityUserService securityUserService;

    public FavoriteController(FavoriteRepository favoriteRepository, DealRepository dealRepository, SecurityUserService securityUserService) {
        this.favoriteRepository = favoriteRepository;
        this.dealRepository = dealRepository;
        this.securityUserService = securityUserService;
    }

    @GetMapping
    public List<Favorite> myFavorites() {
        User user = securityUserService.getCurrentUserOrThrow();
        return favoriteRepository.findByUser(user);
    }

    @PostMapping("/{dealId}")
    @Transactional
    public ResponseEntity<Favorite> add(@PathVariable Long dealId) {
        User user = securityUserService.getCurrentUserOrThrow();
        Deal deal = dealRepository.findById(dealId)
                .orElseThrow(() -> new RuntimeException("Deal not found: " + dealId));
        
        // Check if favorite already exists
        Favorite fav = favoriteRepository.findByUserAndDeal(user, deal)
                .orElse(null);
        
        if (fav != null) {
            // Favorite already exists, just return it
            return ResponseEntity.ok(fav);
        }
        
        // Create new favorite
        fav = Favorite.builder().user(user).deal(deal).build();
        return ResponseEntity.ok(favoriteRepository.save(fav));
    }

    @DeleteMapping("/{dealId}")
    @Transactional
    public ResponseEntity<Void> remove(@PathVariable Long dealId) {
        try {
            System.out.println("DELETE /api/favorites/" + dealId + " - Checking authentication...");
            User user = securityUserService.getCurrentUserOrThrow();
            System.out.println("DELETE /api/favorites/" + dealId + " - User authenticated: " + user.getUsername());
            
            Deal deal = dealRepository.findById(dealId).orElseThrow(() -> {
                System.err.println("DELETE /api/favorites/" + dealId + " - Deal not found");
                return new RuntimeException("Deal not found");
            });
            
            System.out.println("DELETE /api/favorites/" + dealId + " - Finding favorite for user " + user.getUsername() + " and deal " + dealId);
            
            // Find the favorite first, then delete it if it exists
            favoriteRepository.findByUserAndDeal(user, deal)
                .ifPresentOrElse(
                    favorite -> {
                        System.out.println("DELETE /api/favorites/" + dealId + " - Found favorite with ID: " + favorite.getId());
                        favoriteRepository.delete(favorite);
                        System.out.println("DELETE /api/favorites/" + dealId + " - Successfully deleted");
                    },
                    () -> {
                        System.out.println("DELETE /api/favorites/" + dealId + " - Favorite not found, but that's OK");
                    }
                );
            
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            // Log authentication issues
            System.err.println("DELETE /api/favorites/" + dealId + " - Authentication error: " + e.getMessage());
            e.printStackTrace();
            // Return 403 instead of letting it bubble up
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            System.err.println("DELETE /api/favorites/" + dealId + " - Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}



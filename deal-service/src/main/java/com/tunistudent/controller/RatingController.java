package com.tunistudent.controller;

import com.tunistudent.model.Deal;
import com.tunistudent.model.Rating;
import com.tunistudent.model.User;
import com.tunistudent.repository.DealRepository;
import com.tunistudent.repository.RatingRepository;
import com.tunistudent.service.SecurityUserService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {
    private final RatingRepository ratingRepository;
    private final DealRepository dealRepository;
    private final SecurityUserService securityUserService;

    public RatingController(RatingRepository ratingRepository, DealRepository dealRepository, SecurityUserService securityUserService) {
        this.ratingRepository = ratingRepository;
        this.dealRepository = dealRepository;
        this.securityUserService = securityUserService;
    }

    public record RateRequest(@Min(1) @Max(5) int stars) {}

    @PostMapping("/{dealId}")
    public ResponseEntity<Rating> rate(@PathVariable Long dealId, @RequestBody RateRequest req) {
        User user = securityUserService.getCurrentUserOrThrow();
        Deal deal = dealRepository.findById(dealId).orElseThrow();
        Rating rating = ratingRepository.findByUserAndDeal(user, deal)
                .orElse(Rating.builder().user(user).deal(deal).stars(0).build());
        rating.setStars(req.stars());
        return ResponseEntity.ok(ratingRepository.save(rating));
    }

    @GetMapping("/summary/{dealId}")
    public ResponseEntity<Map<String, Object>> summary(@PathVariable Long dealId) {
        // Use ID-based aggregates to avoid entity comparison pitfalls
        long count = ratingRepository.countByDeal_Id(dealId);
        Double avg = ratingRepository.averageByDealId(dealId);
        Integer userStars = null;
        try {
            User user = securityUserService.getCurrentUserOrThrow();
            Optional<Rating> ur = dealRepository.findById(dealId).flatMap(deal -> ratingRepository.findByUserAndDeal(user, deal));
            userStars = ur.map(Rating::getStars).orElse(null);
        } catch (Exception ignored) {}
        // Use HashMap instead of Map.of() to allow null values
        Map<String, Object> response = new HashMap<>();
        response.put("average", avg == null ? 0.0 : avg);
        response.put("count", count);
        response.put("userStars", userStars);
        return ResponseEntity.ok(response);
    }
}



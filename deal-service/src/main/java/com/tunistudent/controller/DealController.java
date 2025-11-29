package com.tunistudent.controller;

import com.tunistudent.dto.DealStatusUpdateResponse;
import com.tunistudent.dto.DealSubmissionRequest;
import com.tunistudent.model.Category;
import com.tunistudent.model.City;
import com.tunistudent.model.Deal;
import com.tunistudent.model.User;
import com.tunistudent.repository.CategoryRepository;
import com.tunistudent.repository.CityRepository;
import com.tunistudent.repository.DealRepository;
import com.tunistudent.service.SecurityUserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/deals")
public class DealController {
    private final DealRepository dealRepository;
    private final CityRepository cityRepository;
    private final CategoryRepository categoryRepository;
    private final SecurityUserService securityUserService;

    public DealController(DealRepository dealRepository, CityRepository cityRepository, CategoryRepository categoryRepository, SecurityUserService securityUserService) {
        this.dealRepository = dealRepository;
        this.cityRepository = cityRepository;
        this.categoryRepository = categoryRepository;
        this.securityUserService = securityUserService;
    }

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN") || a.equals("ADMIN"));
    }

    private Deal.DealStatus getStatusFilter() {
        // Only admins can see non-approved deals
        return isAdmin() ? null : Deal.DealStatus.APPROVED;
    }

    @GetMapping
    public Page<Deal> list(@RequestParam Optional<Integer> page,
                           @RequestParam Optional<Integer> size,
                           @RequestParam Optional<String> city,
                           @RequestParam Optional<String> category,
                           @RequestParam Optional<String> q,
                           @RequestParam Optional<Boolean> featured) {
        Pageable pageable = PageRequest.of(page.orElse(0), size.orElse(12));
        Deal.DealStatus statusFilter = getStatusFilter();
        
        // If admin, use legacy methods (no status filter)
        // If not admin, use status-filtered methods
        if (statusFilter == null) {
            // Admin view - show all deals
            return listAllDeals(pageable, city, category, q, featured);
        } else {
            // Public view - only show approved deals
            return listApprovedDeals(pageable, city, category, q, featured, statusFilter);
        }
    }

    @GetMapping("/trending")
    public Page<Deal> getTrending(@RequestParam Optional<Integer> page,
                                  @RequestParam Optional<Integer> size) {
        Pageable pageable = PageRequest.of(page.orElse(0), size.orElse(6));
        return dealRepository.findTrending(pageable);
    }

    private Page<Deal> listAllDeals(Pageable pageable, Optional<String> city, Optional<String> category, Optional<String> q, Optional<Boolean> featured) {
        // Complex search: q + city + category
        if (q.isPresent() && city.isPresent() && category.isPresent()) {
            City c = cityRepository.findByNameIgnoreCase(city.get()).orElseThrow();
            String queryLower = q.get().toLowerCase().trim();
            String categoryLower = category.get().toLowerCase().trim();
            
            if (categoryLower.contains(queryLower) || queryLower.contains(categoryLower)) {
                return dealRepository.findByCityAndCategoryName(c, category.get(), pageable);
            }
            return dealRepository.findByCityAndCategoryAndTitleOrDescriptionContainingIgnoreCase(c, category.get(), q.get(), pageable);
        }
        
        // Search: q + city
        if (q.isPresent() && city.isPresent()) {
            City c = cityRepository.findByNameIgnoreCase(city.get()).orElseThrow();
            return dealRepository.findByCityAndTitleOrCategoryNameOrDescriptionContainingIgnoreCase(c, q.get(), pageable);
        }
        
        // Search: q + category
        if (q.isPresent() && category.isPresent()) {
            String queryLower = q.get().toLowerCase().trim();
            String categoryLower = category.get().toLowerCase().trim();
            
            if (categoryLower.contains(queryLower) || queryLower.contains(categoryLower)) {
                return dealRepository.findByCategory_NameIgnoreCase(category.get(), pageable);
            }
            return dealRepository.findByCategoryAndTitleOrDescriptionContainingIgnoreCase(category.get(), q.get(), pageable);
        }
        
        // Search: only q
        if (q.isPresent()) {
            return dealRepository.findByTitleOrCategoryNameOrDescriptionContainingIgnoreCase(q.get(), pageable);
        }
        
        // Filter: city + category
        if (city.isPresent() && category.isPresent()) {
            City c = cityRepository.findByNameIgnoreCase(city.get()).orElseThrow();
            return dealRepository.findByCityAndCategoryName(c, category.get(), pageable);
        }
        
        // Filter: only city
        if (city.isPresent()) {
            City c = cityRepository.findByNameIgnoreCase(city.get()).orElseThrow();
            return dealRepository.findByCity(c, pageable);
        }
        
        // Filter: only category
        if (category.isPresent()) {
            return dealRepository.findByCategory_NameIgnoreCase(category.get(), pageable);
        }
        
        // Featured deals
        if (featured.orElse(false)) {
            return dealRepository.findByFeaturedTrue(pageable);
        }
        
        return dealRepository.findAll(pageable);
    }

    private Page<Deal> listApprovedDeals(Pageable pageable, Optional<String> city, Optional<String> category, Optional<String> q, Optional<Boolean> featured, Deal.DealStatus status) {
        // Complex search: q + city + category
        if (q.isPresent() && city.isPresent() && category.isPresent()) {
            City c = cityRepository.findByNameIgnoreCase(city.get()).orElseThrow();
            String queryLower = q.get().toLowerCase().trim();
            String categoryLower = category.get().toLowerCase().trim();
            
            if (categoryLower.contains(queryLower) || queryLower.contains(categoryLower)) {
                return dealRepository.findByStatusAndCityAndCategoryName(status, c, category.get(), pageable);
            }
            return dealRepository.findByStatusAndCityAndCategoryAndTitleOrDescriptionContainingIgnoreCase(status, c, category.get(), q.get(), pageable);
        }
        
        // Search: q + city
        if (q.isPresent() && city.isPresent()) {
            City c = cityRepository.findByNameIgnoreCase(city.get()).orElseThrow();
            return dealRepository.findByStatusAndCityAndTitleOrCategoryNameOrDescriptionContainingIgnoreCase(status, c, q.get(), pageable);
        }
        
        // Search: q + category
        if (q.isPresent() && category.isPresent()) {
            String queryLower = q.get().toLowerCase().trim();
            String categoryLower = category.get().toLowerCase().trim();
            
            if (categoryLower.contains(queryLower) || queryLower.contains(categoryLower)) {
                return dealRepository.findByStatusAndCategory(status, category.get(), pageable);
            }
            return dealRepository.findByStatusAndCategoryAndTitleOrDescriptionContainingIgnoreCase(status, category.get(), q.get(), pageable);
        }
        
        // Search: only q
        if (q.isPresent()) {
            return dealRepository.findByStatusAndTitleOrCategoryNameOrDescriptionContainingIgnoreCase(status, q.get(), pageable);
        }
        
        // Filter: city + category
        if (city.isPresent() && category.isPresent()) {
            City c = cityRepository.findByNameIgnoreCase(city.get()).orElseThrow();
            return dealRepository.findByStatusAndCityAndCategoryName(status, c, category.get(), pageable);
        }
        
        // Filter: only city
        if (city.isPresent()) {
            City c = cityRepository.findByNameIgnoreCase(city.get()).orElseThrow();
            return dealRepository.findByStatusAndCity(status, c, pageable);
        }
        
        // Filter: only category
        if (category.isPresent()) {
            return dealRepository.findByStatusAndCategory(status, category.get(), pageable);
        }
        
        // Featured deals
        if (featured.orElse(false)) {
            return dealRepository.findByStatusAndFeaturedTrue(status, pageable);
        }
        
        return dealRepository.findByStatus(status, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Deal> get(@PathVariable Long id) {
        Optional<Deal> dealOpt = dealRepository.findById(id);
        if (dealOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Deal deal = dealOpt.get();
        // Non-admin users can only see approved deals
        if (!isAdmin() && deal.getStatus() != Deal.DealStatus.APPROVED) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(deal);
    }

    // Client submission endpoint
    @PostMapping("/submit")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ResponseEntity<Deal> submitDeal(@Valid @RequestBody DealSubmissionRequest request) {
        User user = securityUserService.getCurrentUserOrThrow();
        
        City city = cityRepository.findById(request.getCityId())
                .orElseThrow(() -> new RuntimeException("City not found"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        Deal deal = Deal.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .city(city)
                .category(category)
                .price(request.getPrice())
                .discount(request.getDiscount())
                .location(request.getLocation())
                .expirationDate(request.getExpirationDate())
                .status(Deal.DealStatus.PENDING)
                .submittedBy(user)
                .featured(false)
                .build();
        
        return ResponseEntity.ok(dealRepository.save(deal));
    }

    // Admin-only: Create deal directly (auto-approved)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<Deal> create(@Valid @RequestBody Deal deal) {
        attachRefs(deal);
        // Admin-created deals are auto-approved
        if (deal.getStatus() == null) {
            deal.setStatus(Deal.DealStatus.APPROVED);
        }
        return ResponseEntity.ok(dealRepository.save(deal));
    }

    // Admin-only: Update deal
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<Deal> update(@PathVariable Long id, @Valid @RequestBody Deal body) {
        return dealRepository.findById(id).map(existing -> {
            body.setId(existing.getId());
            attachRefs(body);
            // Preserve submittedBy if not being changed
            if (body.getSubmittedBy() == null && existing.getSubmittedBy() != null) {
                body.setSubmittedBy(existing.getSubmittedBy());
            }
            return ResponseEntity.ok(dealRepository.save(body));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Admin-only: Delete deal
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!dealRepository.existsById(id)) return ResponseEntity.notFound().build();
        dealRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Admin-only: Get pending deals
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<Deal> getPendingDeals(@RequestParam Optional<Integer> page,
                                       @RequestParam Optional<Integer> size) {
        Pageable pageable = PageRequest.of(page.orElse(0), size.orElse(20));
        return dealRepository.findByStatus(Deal.DealStatus.PENDING, pageable);
    }

    // Admin-only: Approve deal
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> approveDeal(@PathVariable Long id) {
        System.out.println("=== Approve Deal Request: " + id + " ===");
        try {
            Optional<Deal> dealOpt = dealRepository.findById(id);
            if (dealOpt.isEmpty()) {
                System.out.println("Deal not found: " + id);
                Map<String, String> error = new HashMap<>();
                error.put("error", "Deal not found");
                error.put("message", "Deal with id " + id + " does not exist");
                return ResponseEntity.status(404).body(error);
            }
            
            Deal deal = dealOpt.get();
            System.out.println("Deal found - ID: " + deal.getId() + ", Title: " + deal.getTitle() + ", Status: " + deal.getStatus());
            
            // Store values before modifying
            Long dealId = deal.getId();
            String dealTitle = deal.getTitle() != null ? deal.getTitle() : "";
            
            // Update status
            deal.setStatus(Deal.DealStatus.APPROVED);
            System.out.println("Status set to APPROVED, saving...");
            
            // Save the deal
            dealRepository.save(deal);
            System.out.println("Deal saved successfully");
            
            // Flush to ensure it's persisted
            dealRepository.flush();
            System.out.println("Transaction flushed");
            
            // Create response using stored values to avoid any entity state issues
            DealStatusUpdateResponse response = new DealStatusUpdateResponse(
                dealId,
                dealTitle,
                Deal.DealStatus.APPROVED,
                "Deal approved successfully"
            );
            System.out.println("Response created successfully: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("=== EXCEPTION in approveDeal ===");
            System.err.println("Exception type: " + e.getClass().getName());
            System.err.println("Exception message: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to approve deal");
            error.put("message", e.getMessage() != null ? e.getMessage() : "Unknown error occurred");
            error.put("type", e.getClass().getSimpleName());
            return ResponseEntity.status(500).body(error);
        }
    }

    // Admin-only: Reject deal
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> rejectDeal(@PathVariable Long id) {
        try {
            System.out.println("Attempting to reject deal: " + id);
            Optional<Deal> dealOpt = dealRepository.findById(id);
            if (dealOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Deal not found");
                error.put("message", "Deal with id " + id + " does not exist");
                return ResponseEntity.status(404).body(error);
            }
            
            Deal deal = dealOpt.get();
            System.out.println("Deal found: " + deal.getTitle() + ", current status: " + deal.getStatus());
            
            // Store values before save to avoid any potential issues
            Long dealId = deal.getId();
            String dealTitle = deal.getTitle();
            
            deal.setStatus(Deal.DealStatus.REJECTED);
            Deal savedDeal = dealRepository.save(deal);
            System.out.println("Deal saved with id: " + savedDeal.getId() + ", status: " + savedDeal.getStatus());
            
            // Use stored values or saved deal values for response
            DealStatusUpdateResponse response = new DealStatusUpdateResponse(
                savedDeal.getId() != null ? savedDeal.getId() : dealId,
                savedDeal.getTitle() != null ? savedDeal.getTitle() : (dealTitle != null ? dealTitle : ""),
                savedDeal.getStatus() != null ? savedDeal.getStatus() : Deal.DealStatus.REJECTED,
                "Deal rejected successfully"
            );
            System.out.println("Response created: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Exception rejecting deal " + id + ": " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to reject deal");
            error.put("message", e.getMessage() != null ? e.getMessage() : "Unknown error occurred");
            return ResponseEntity.status(500).body(error);
        }
    }

    private void attachRefs(Deal deal) {
        if (deal.getCity() != null && deal.getCity().getId() != null) {
            City c = cityRepository.findById(deal.getCity().getId()).orElseThrow();
            deal.setCity(c);
        }
        if (deal.getCategory() != null && deal.getCategory().getId() != null) {
            Category cat = categoryRepository.findById(deal.getCategory().getId()).orElseThrow();
            deal.setCategory(cat);
        }
    }
}

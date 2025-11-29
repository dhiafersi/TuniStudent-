package com.tunistudent.repository;

import com.tunistudent.model.City;
import com.tunistudent.model.Deal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface DealRepository extends JpaRepository<Deal, Long> {
    // Legacy methods (used by admin, no status filter)
    Page<Deal> findByCity(City city, Pageable pageable);
    Page<Deal> findByCategory_NameIgnoreCase(String categoryName, Pageable pageable);
    Page<Deal> findByTitleContainingIgnoreCase(String q, Pageable pageable);
    Optional<Deal> findByTitle(String title);
    Page<Deal> findByFeaturedTrue(Pageable pageable);
    
    // Status filtering methods
    Page<Deal> findByStatus(Deal.DealStatus status, Pageable pageable);
    
    // Search by title OR category name OR description (with status filter)
    @Query("SELECT d FROM Deal d WHERE d.status = :status AND (LOWER(d.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.category.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Deal> findByStatusAndTitleOrCategoryNameOrDescriptionContainingIgnoreCase(@Param("status") Deal.DealStatus status, @Param("query") String query, Pageable pageable);
    
    // Search by title OR category name OR description AND city (with status filter)
    @Query("SELECT d FROM Deal d WHERE d.status = :status AND d.city = :city AND (LOWER(d.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.category.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Deal> findByStatusAndCityAndTitleOrCategoryNameOrDescriptionContainingIgnoreCase(@Param("status") Deal.DealStatus status, @Param("city") City city, @Param("query") String query, Pageable pageable);
    
    // Search by title OR description AND category (exact category match, search in title/description only) (with status filter)
    @Query("SELECT d FROM Deal d WHERE d.status = :status AND LOWER(d.category.name) = LOWER(:categoryName) AND (LOWER(d.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Deal> findByStatusAndCategoryAndTitleOrDescriptionContainingIgnoreCase(@Param("status") Deal.DealStatus status, @Param("categoryName") String categoryName, @Param("query") String query, Pageable pageable);
    
    // Search by title OR description AND city AND category (exact category match, search in title/description only) (with status filter)
    @Query("SELECT d FROM Deal d WHERE d.status = :status AND d.city = :city AND LOWER(d.category.name) = LOWER(:categoryName) AND (LOWER(d.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Deal> findByStatusAndCityAndCategoryAndTitleOrDescriptionContainingIgnoreCase(@Param("status") Deal.DealStatus status, @Param("city") City city, @Param("categoryName") String categoryName, @Param("query") String query, Pageable pageable);
    
    // Filter by city AND category (no search query) (with status filter)
    @Query("SELECT d FROM Deal d WHERE d.status = :status AND d.city = :city AND LOWER(d.category.name) = LOWER(:categoryName)")
    Page<Deal> findByStatusAndCityAndCategoryName(@Param("status") Deal.DealStatus status, @Param("city") City city, @Param("categoryName") String categoryName, Pageable pageable);
    
    // Filter by city (with status filter)
    @Query("SELECT d FROM Deal d WHERE d.status = :status AND d.city = :city")
    Page<Deal> findByStatusAndCity(@Param("status") Deal.DealStatus status, @Param("city") City city, Pageable pageable);
    
    // Filter by category (with status filter)
    @Query("SELECT d FROM Deal d WHERE d.status = :status AND LOWER(d.category.name) = LOWER(:categoryName)")
    Page<Deal> findByStatusAndCategory(@Param("status") Deal.DealStatus status, @Param("categoryName") String categoryName, Pageable pageable);
    
    // Featured deals (with status filter)
    @Query("SELECT d FROM Deal d WHERE d.status = :status AND d.featured = true")
    Page<Deal> findByStatusAndFeaturedTrue(@Param("status") Deal.DealStatus status, Pageable pageable);
    
    // Legacy search methods (keep for backward compatibility, but should filter by status in controller)
    @Query("SELECT d FROM Deal d WHERE LOWER(d.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.category.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Deal> findByTitleOrCategoryNameOrDescriptionContainingIgnoreCase(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT d FROM Deal d WHERE d.city = :city AND (LOWER(d.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.category.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Deal> findByCityAndTitleOrCategoryNameOrDescriptionContainingIgnoreCase(@Param("city") City city, @Param("query") String query, Pageable pageable);
    
    @Query("SELECT d FROM Deal d WHERE LOWER(d.category.name) = LOWER(:categoryName) AND (LOWER(d.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Deal> findByCategoryAndTitleOrDescriptionContainingIgnoreCase(@Param("categoryName") String categoryName, @Param("query") String query, Pageable pageable);
    
    @Query("SELECT d FROM Deal d WHERE d.city = :city AND LOWER(d.category.name) = LOWER(:categoryName) AND (LOWER(d.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Deal> findByCityAndCategoryAndTitleOrDescriptionContainingIgnoreCase(@Param("city") City city, @Param("categoryName") String categoryName, @Param("query") String query, Pageable pageable);
    
    @Query("SELECT d FROM Deal d WHERE d.city = :city AND LOWER(d.category.name) = LOWER(:categoryName)")
    Page<Deal> findByCityAndCategoryName(@Param("city") City city, @Param("categoryName") String categoryName, Pageable pageable);

    // Trending deals (ordered by average rating)
    @Query("SELECT d FROM Deal d LEFT JOIN d.ratings r WHERE d.status = 'APPROVED' GROUP BY d ORDER BY AVG(r.stars) DESC")
    Page<Deal> findTrending(Pageable pageable);

    long countBySubmittedBy(com.tunistudent.model.User user);
}



package com.tunistudent.repository;

import com.tunistudent.model.Rating;
import com.tunistudent.model.User;
import com.tunistudent.model.Deal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserAndDeal(User user, Deal deal);

    long countByDeal_Id(Long dealId);

    @Query("select avg(r.stars) from Rating r where r.deal.id = ?1")
    Double averageByDealId(Long dealId);
}



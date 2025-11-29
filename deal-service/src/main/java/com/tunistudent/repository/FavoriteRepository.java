package com.tunistudent.repository;

import com.tunistudent.model.Favorite;
import com.tunistudent.model.User;
import com.tunistudent.model.Deal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);
    Optional<Favorite> findByUserAndDeal(User user, Deal deal);
    void deleteByUserAndDeal(User user, Deal deal);
    long countByUser(User user);
}



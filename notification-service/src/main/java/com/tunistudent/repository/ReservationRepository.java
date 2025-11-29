package com.tunistudent.repository;

import com.tunistudent.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserIdOrderByCreatedAtDesc(Long userId);
    boolean existsByUserIdAndDealId(Long userId, Long dealId);
}

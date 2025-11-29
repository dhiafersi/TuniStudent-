package com.tunistudent.service;

import com.tunistudent.model.Reservation;
import com.tunistudent.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private NotificationService notificationService;

    public Reservation createReservation(Long userId, Long dealId, String dealTitle, java.time.LocalDateTime reservationDate, Integer partySize, String specialRequests) {
        // Allow multiple reservations for different dates if it's a table reservation
        if (reservationDate == null && reservationRepository.existsByUserIdAndDealId(userId, dealId)) {
             throw new RuntimeException("You have already reserved this deal.");
        }
        
        String code = "RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Reservation reservation = new Reservation(userId, dealId, dealTitle, code, reservationDate, partySize, specialRequests);
        Reservation saved = reservationRepository.save(reservation);
        
        // Notify user
        String msg = reservationDate != null 
            ? "Table reserved at " + dealTitle + " for " + reservationDate.toString().replace("T", " ") 
            : "Reservation confirmed for " + dealTitle + ". Code: " + code;
            
        notificationService.createNotification(userId, msg, "RESERVATION");
        
        return saved;
    }

    public List<Reservation> getUserReservations(Long userId) {
        return reservationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    // Admin methods
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }
    
    public Reservation updateStatus(Long id, Reservation.ReservationStatus status) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setStatus(status);
        return reservationRepository.save(reservation);
    }
}

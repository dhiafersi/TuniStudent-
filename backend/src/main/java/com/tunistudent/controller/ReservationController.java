package com.tunistudent.controller;

import com.tunistudent.model.Reservation;
import com.tunistudent.model.User;
import com.tunistudent.service.ReservationService;
import com.tunistudent.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;
    
    @Autowired
    private com.tunistudent.service.SecurityUserService securityUserService;

    private User getCurrentUser() {
        return securityUserService.getCurrentUserOrThrow();
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getMyReservations() {
        User user = getCurrentUser();
        return ResponseEntity.ok(reservationService.getUserReservations(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody Map<String, Object> request) {
        User user = getCurrentUser();
        Long dealId = Long.valueOf(request.get("dealId").toString());
        String dealTitle = (String) request.get("dealTitle");
        
        // Optional fields
        java.time.LocalDateTime reservationDate = null;
        if (request.get("reservationDate") != null) {
            reservationDate = java.time.LocalDateTime.parse((String) request.get("reservationDate"));
        }
        
        Integer partySize = request.get("partySize") != null ? Integer.valueOf(request.get("partySize").toString()) : null;
        String specialRequests = (String) request.get("specialRequests");
        
        return ResponseEntity.ok(reservationService.createReservation(user.getId(), dealId, dealTitle, reservationDate, partySize, specialRequests));
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        User user = getCurrentUser();
        List<Reservation> reservations = reservationService.getUserReservations(user.getId());
        
        Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("total", reservations.size());
        stats.put("confirmed", reservations.stream().filter(r -> r.getStatus() == Reservation.ReservationStatus.CONFIRMED).count());
        stats.put("cancelled", reservations.stream().filter(r -> r.getStatus() == Reservation.ReservationStatus.CANCELLED).count());
        
        return ResponseEntity.ok(stats);
    }
    
    // Admin Endpoints
    @GetMapping("/all")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }
    
    @PutMapping("/{id}/status")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Reservation> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Reservation.ReservationStatus status = Reservation.ReservationStatus.valueOf(request.get("status"));
        return ResponseEntity.ok(reservationService.updateStatus(id, status));
    }
}

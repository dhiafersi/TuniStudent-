package com.tunistudent.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long dealId;
    
    private String dealTitle; // Cache for display
    private String reservationCode; // Unique code e.g., "RES-12345"
    
    private LocalDateTime reservationDate; // For table reservations
    private Integer partySize; // For table reservations
    private String specialRequests;
    
    @Enumerated(EnumType.STRING)
    private ReservationStatus status = ReservationStatus.CONFIRMED;
    
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ReservationStatus {
        CONFIRMED, CANCELLED, USED
    }

    public Reservation() {}

    public Reservation(Long userId, Long dealId, String dealTitle, String reservationCode, LocalDateTime reservationDate, Integer partySize, String specialRequests) {
        this.userId = userId;
        this.dealId = dealId;
        this.dealTitle = dealTitle;
        this.reservationCode = reservationCode;
        this.reservationDate = reservationDate;
        this.partySize = partySize;
        this.specialRequests = specialRequests;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getDealId() { return dealId; }
    public void setDealId(Long dealId) { this.dealId = dealId; }
    public String getDealTitle() { return dealTitle; }
    public void setDealTitle(String dealTitle) { this.dealTitle = dealTitle; }
    public String getReservationCode() { return reservationCode; }
    public void setReservationCode(String reservationCode) { this.reservationCode = reservationCode; }
    public LocalDateTime getReservationDate() { return reservationDate; }
    public void setReservationDate(LocalDateTime reservationDate) { this.reservationDate = reservationDate; }
    public Integer getPartySize() { return partySize; }
    public void setPartySize(Integer partySize) { this.partySize = partySize; }
    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }
    public ReservationStatus getStatus() { return status; }
    public void setStatus(ReservationStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

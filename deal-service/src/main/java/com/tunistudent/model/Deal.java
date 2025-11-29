package com.tunistudent.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "deals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Deal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    private String imageUrl;

    @ManyToOne(optional = false)
    private Category category;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 5, scale = 2)
    private BigDecimal discount;

    private String location;

    @ManyToOne(optional = false)
    private City city;

    private LocalDate expirationDate;

    @Builder.Default
    private boolean featured = false;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private DealStatus status = DealStatus.APPROVED;

    @ManyToOne
    private User submittedBy;

    @OneToMany(mappedBy = "deal", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @Builder.Default
    @JsonIgnore
    private List<Rating> ratings = new ArrayList<>();

    public enum DealStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}



package com.tunistudent.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DealSubmissionRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String imageUrl;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private BigDecimal price;

    @NotNull(message = "Discount is required")
    private BigDecimal discount;

    private String location;

    @NotNull(message = "City ID is required")
    private Long cityId;

    private LocalDate expirationDate;
}


package com.tunistudent.dto;

import com.tunistudent.model.Deal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DealStatusUpdateResponse {
    private Long id;
    private String title;
    private Deal.DealStatus status;
    private String message;
    
    public static DealStatusUpdateResponse from(Deal deal, String message) {
        if (deal == null) {
            throw new IllegalArgumentException("Deal cannot be null");
        }
        return new DealStatusUpdateResponse(
            deal.getId(), 
            deal.getTitle() != null ? deal.getTitle() : "", 
            deal.getStatus() != null ? deal.getStatus() : Deal.DealStatus.PENDING, 
            message != null ? message : ""
        );
    }
}


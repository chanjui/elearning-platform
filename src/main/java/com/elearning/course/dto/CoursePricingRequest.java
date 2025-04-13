package com.elearning.course.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CoursePricingRequest {
    private int price;
    private int discountRate;
    private boolean isPublic;
    private String viewLimit;
    private String target;

    private String startDate;
    private String endDate;
    // private String durationType;
}
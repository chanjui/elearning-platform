package com.elearning.course.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseListDTO {
    private Long id;
    private String slug;
    private String title;
    private String instructor;
    private Integer price;
    private Integer originalPrice;
    private Integer discount;
    private Double rating;
    private Integer ratingCount;
    private Integer students;
    private String image;
    private boolean isNew;
    private boolean isUpdated;
    private String target;
} 
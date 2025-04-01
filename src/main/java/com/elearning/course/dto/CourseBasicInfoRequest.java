package com.elearning.course.dto;

import lombok.Data;

@Data
public class CourseBasicInfoRequest {
    private String title;
    private String description;
    private Long categoryId;
}
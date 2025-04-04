package com.elearning.course.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseFaqRequest {
    private Long courseId;
    private String content;
    private String answer;
    private boolean isVisible;
}
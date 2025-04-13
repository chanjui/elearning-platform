package com.elearning.course.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CourseCurriculumRequest {
    private Long courseId;
    private List<CourseSectionRequest> sections;
}
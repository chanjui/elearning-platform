package com.elearning.course.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CourseSectionRequest {
    private String subject;
    private int orderNum;
    private List<LectureVideoRequest> lectures;
}
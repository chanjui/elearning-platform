package com.elearning.course.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LectureVideoRequest {
    private String title;
    private String videoUrl;
    private int duration;
    private String previewUrl;
    private int seq;
    private boolean isFree;
}
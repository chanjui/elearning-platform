package com.elearning.course.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDto {
    private Long id;
    private String title;
    private String instructor;
    private Integer progress;
    private String lastAccessed;
    private String imageUrl;
    private String slug;
    private Integer totalLectures;
    private Integer completedLectures;
    private String nextLecture;
    private String estimatedTimeLeft;
    private String category;
    private String lastStudyDate;
    private Boolean completed;
    private String completedDate;
    private Boolean certificateAvailable;
    private String courseStatus;
    private String courseProgress;
    private Double rating;
    private Integer students;
    private String level;
    private String relatedTo;
} 
package com.elearning.course.dto;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseRatingDto {
  private Long id;
  private Long userId;
  private Long courseId;
  private Integer rating;
  private String content;
}

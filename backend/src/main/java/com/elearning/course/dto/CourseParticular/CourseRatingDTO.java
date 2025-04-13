package com.elearning.course.dto.CourseParticular;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class CourseRatingDTO {
  private Long id;
  private Long userId;
  private String user;
  private String profile;
  private int rating;
  private LocalDate date;
  private String content;
}

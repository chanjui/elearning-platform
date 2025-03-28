package com.elearning.course.dto.CourseParticular;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class CourseRatingDTO {
  private Long id;
  private String user;
  private int rating;
  private LocalDateTime date;
  private String content;
}

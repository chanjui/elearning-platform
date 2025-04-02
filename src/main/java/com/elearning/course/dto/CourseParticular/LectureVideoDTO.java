package com.elearning.course.dto.CourseParticular;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LectureVideoDTO {
  private Long id;
  private String title;
  private int duration;
  private boolean isFree;
}

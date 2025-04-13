package com.elearning.course.dto.CourseParticular;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class CourseSectionDTO {
  private Long id;
  private String title;
  private List<LectureVideoDTO> lectures;
}

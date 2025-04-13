package com.elearning.course.dto.CourseLearn;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class LearnCourseSectionDTO {
  private Long id;
  private String title;
  private List<LearnLectureVideoDTO> lectures;
}

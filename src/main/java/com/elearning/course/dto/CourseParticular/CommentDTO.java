package com.elearning.course.dto.CourseParticular;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class CommentDTO {
  private Long id;
  private Long userId;
  private String user;
  private String profile;
  private String content;
  private LocalDate editDate;
}

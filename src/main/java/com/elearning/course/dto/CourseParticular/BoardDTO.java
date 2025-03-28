package com.elearning.course.dto.CourseParticular;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class BoardDTO {
  private Long id;
  private String user;
  private String title;
  private String content;
  private LocalDateTime date;
}

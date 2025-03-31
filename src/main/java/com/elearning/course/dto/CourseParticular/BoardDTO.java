package com.elearning.course.dto.CourseParticular;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class BoardDTO {
  private Long id;
  private String user;
  private String title;
  private String content;
  private LocalDateTime date;
}

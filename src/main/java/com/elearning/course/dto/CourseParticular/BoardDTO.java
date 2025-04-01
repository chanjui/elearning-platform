package com.elearning.course.dto.CourseParticular;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class BoardDTO {
  private Long id;
  private Long userId;
  private String user;
  private String profile;
  private String subject;
  private String content;
  private LocalDate date;
  private List<CommentDTO> comments;
}

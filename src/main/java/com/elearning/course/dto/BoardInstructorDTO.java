package com.elearning.course.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class BoardInstructorDTO {
  private Long id;
  private String subject;
  private String content;
  private LocalDateTime regDate;
}

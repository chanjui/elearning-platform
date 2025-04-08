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
  private String bname; // 게시글 타입
  private String subject;
  private String content;
  private LocalDateTime regDate;
  private String reply; // 강사의 댓글
}

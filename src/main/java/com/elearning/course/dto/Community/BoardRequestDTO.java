package com.elearning.course.dto.Community;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardRequestDTO {
  private Long BoardId;
  private Long userId;
  private String bname;
  private String subject;
  private String content;
  private String fileData;
}

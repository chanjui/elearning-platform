package com.elearning.instructor.dto.inquiries;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class InquiryReplyDTO {
  private Long id;
  private String author;
  private String regDate;
  private String content;
}

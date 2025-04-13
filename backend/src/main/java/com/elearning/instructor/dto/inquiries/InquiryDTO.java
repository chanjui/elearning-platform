package com.elearning.instructor.dto.inquiries;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class InquiryDTO {
  private Long id;
  private String courseTitle;
  private String subject;
  private String content;
  private String author;
  private LocalDateTime regDate;
  private Long replyCount;
  private String status; // "답변완료" / "미답변"
  private List<InquiryReplyDTO> replies;
}


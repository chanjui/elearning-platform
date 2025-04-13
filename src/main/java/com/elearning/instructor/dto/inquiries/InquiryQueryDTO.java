package com.elearning.instructor.dto.inquiries;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor  // JPQL new 키워드 필수
@AllArgsConstructor // 파라미터 개수 & 순서 그대로 맞춰야 함
public class InquiryQueryDTO {

  private Long id;
  private String courseTitle;
  private String subject;
  private String content;
  private String author;
  private LocalDateTime regDate;
  private Long replyCount; // ← 주의: 타입 Long
}

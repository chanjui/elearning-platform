package com.elearning.course.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CourseRatingDTO {
  private Long id;
  private Long courseId;
  private String subject; // 강의 제목
  private String thumbnailUrl; // 강의 썸네일 이미지
  private Long userId;
  private String nickname;
  private String profileUrl;
  private String content;
  private Integer rating;
  private LocalDateTime regDate;
}

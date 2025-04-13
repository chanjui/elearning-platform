package com.elearning.instructor.dto.reviews;

import lombok.Data;

@Data
public class CourseRatingReviewDTO {

  private Long id;
  private String content;
  private Integer rating;  // 정수형 평점
  private String regDate;
  private Long userId;
  private String nickname;
  private Long courseId;
  private String subject;
}

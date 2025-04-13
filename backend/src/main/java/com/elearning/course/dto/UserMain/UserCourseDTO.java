package com.elearning.course.dto.UserMain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCourseDTO {
  private Long id;
  private String subject; // 강의명
  private String instructor;  // 강사명
  private String thumbnailUrl;  // 썸네일 이미지 URL
  private Integer price;  // 가격
  private BigDecimal discountRate;  // 할인율
  private Double rating;  // 평점
}
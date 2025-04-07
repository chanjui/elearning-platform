package com.elearning.instructor.dto.home;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class InstructorCourseDTO {

  private Long courseId; // 강의 ID
  private String subject; // 강의명
  private String instructor;  // 강사명
  private String thumbnailUrl;  // 썸네일 이미지 URL
  private Integer price;  // 가격
  private BigDecimal discountRate;  // 할인율
  private Double rating;  // 평균 평점
  private String categoryName; // 카테고리명

}

package com.elearning.instructor.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CourseRevenueDto {
  private Long courseId;
  private String subject;
  private Long revenue; // 해당 강의의 총 수익
  private double percentage; // 전체 수익에서 차지하는 비율 (프론트 계산도 가능)
}

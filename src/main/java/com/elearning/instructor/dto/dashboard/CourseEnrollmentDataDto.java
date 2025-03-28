package com.elearning.instructor.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 각 강의별로 수강생의 상태를 통계화한 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseEnrollmentDataDto {
  private Long courseId;
  private String courseTitle;   // 강의명
  private int inProgressCount;  // 미완료(수강 중) 인원
  private int completedCount;   // 완료(수료) 인원
}

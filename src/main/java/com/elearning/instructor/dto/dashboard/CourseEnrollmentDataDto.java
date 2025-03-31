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
@Builder
public class CourseEnrollmentDataDto {
  private Long courseId;
  private String courseTitle;   // 강의명
  private Long inProgressCount;  // 미완료(수강 중) 인원
  private Long completedCount;   // 완료(수료) 인원

  // 이 생성자가 JPQL new 명령어와 매핑된다.
  public CourseEnrollmentDataDto(Long courseId, String courseTitle, Long inProgressCount, Long completedCount) {
    this.courseId = courseId;
    this.courseTitle = courseTitle;
    this.inProgressCount = inProgressCount;
    this.completedCount = completedCount;
  }
}

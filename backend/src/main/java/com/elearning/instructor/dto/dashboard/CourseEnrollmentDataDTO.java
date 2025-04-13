package com.elearning.instructor.dto.dashboard;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 각 강의별로 수강생의 상태를 통계화한 DTO
 */
@Data
@NoArgsConstructor
public class CourseEnrollmentDataDTO {
  private Long courseId;
  private String courseTitle;
  private Long totalStudents;
  private Long completedOver90;

  public CourseEnrollmentDataDTO(Long courseId, String courseTitle, Long totalStudents, Long completedOver90) {
    this.courseId = courseId;
    this.courseTitle = courseTitle;
    this.totalStudents = totalStudents;
    this.completedOver90 = completedOver90;
  }

  public double getCompletionRate() {
    if (totalStudents == 0) return 0;
    return (double) completedOver90 / totalStudents * 100;
  }
}

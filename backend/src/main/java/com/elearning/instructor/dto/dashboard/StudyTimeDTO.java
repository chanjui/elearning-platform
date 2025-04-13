package com.elearning.instructor.dto.dashboard;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 수강생 학습 시간(총 시청 시간, 평균 시청 시간 등)을 표현
 */
@Data
@NoArgsConstructor
@Builder
public class StudyTimeDTO {
  private Long courseId;
  private String courseTitle;
  private Integer averageVideoTime;
  private Integer videoCount;
  private Integer avgStudyMinutes;

  public StudyTimeDTO(Long courseId, String courseTitle, Integer avgVideoTime, Integer videoCount, Integer avgMinutes) {
    this.courseId = courseId;
    this.courseTitle = courseTitle;
    this.averageVideoTime = avgVideoTime;
    this.videoCount = videoCount;
    this.avgStudyMinutes = avgMinutes;
  }
}


package com.elearning.instructor.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 수강생 학습 시간(총 시청 시간, 평균 시청 시간 등)을 표현
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyTimeDto {
  private Long courseId;
  private String courseTitle;
  private long totalWatchTime;  // 전체 수강생 누적 시청 시간 (초 단위 등)
  // 필요하다면 평균 시청 시간도 추가 가능
  // private long avgWatchTime;
}


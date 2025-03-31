package com.elearning.instructor.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 예: 0~25%, 26~50%, 51~75%, 76~100% 구간별 수강생 수
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressStatusDto {
  private String rangeLabel;  // 예: "0~25%"
  private Long studentCount;   // 해당 구간에 속하는 수강생 수
}


package com.elearning.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class LectureMemoDTO {
  private Long id;
  private Long userId;
  private Long lectureVideoId;
  private String lectureVideoTitle;
  private String memo;
  private LocalDate updatedAt;
}

package com.elearning.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class LectureMemoDTO {
  private Long id;
  private Long userId;
  private String memo;
  private LocalDateTime updatedAt;
}

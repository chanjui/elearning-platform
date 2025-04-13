package com.elearning.instructor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ExpertiseDTO {
  private Long id;
  private String name;
}

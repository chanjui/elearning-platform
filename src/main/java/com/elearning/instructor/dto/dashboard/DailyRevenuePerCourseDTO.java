package com.elearning.instructor.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DailyRevenuePerCourseDTO {
  private Long courseId;
  private String subject;
  private LocalDate date;
  private Long amount;
}


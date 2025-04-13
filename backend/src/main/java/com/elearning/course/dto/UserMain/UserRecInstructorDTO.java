package com.elearning.course.dto.UserMain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRecInstructorDTO {
  private Long instructorId;
  private String name;
  private String profileUrl;
  private String bio;
  private Long coursesCount;
  private Long totalStudents;
  private Double averageRating;
}
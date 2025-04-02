package com.elearning.course.dto.UserMain;

import com.elearning.course.dto.UserMain.CourseDto;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserMainDTO {

  private List<CourseDto> latestActiveCourses;
  private List<CourseDto> freeActiveCourses;
  private List<UserReviewDTO> userReviews;
}
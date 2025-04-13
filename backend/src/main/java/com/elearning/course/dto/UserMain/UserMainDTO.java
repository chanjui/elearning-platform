package com.elearning.course.dto.UserMain;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserMainDTO {

  private List<UserSliderDTO> sliderList;
  private List<UserCourseDTO> popularCourses;
  private List<UserCourseDTO> latestCourses;
  private List<UserCourseDTO> freeCourses;
  private List<UserRecInstructorDTO> recommendedInstructors;
  private List<UserReviewDTO> userReviews;

}
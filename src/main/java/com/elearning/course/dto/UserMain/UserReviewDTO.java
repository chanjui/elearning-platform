package com.elearning.course.dto.UserMain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserReviewDTO {
  private String courseName;   // 수강한 강의명 (Course.subject)
  private String userName;     // 사용자 이름 (User.nickname)
  private String profileUrl;   // 사용자 프로필 URL (User.profileUrl)
  private String review;       // 수강평 내용 (CourseRating.content)
  private int rating;          // 별점 (CourseRating.rating)
}

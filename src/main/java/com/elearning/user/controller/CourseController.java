package com.elearning.user.controller;

import com.elearning.common.ResultData;
import com.elearning.course.dto.CourseLearn.CourseLearnDTO;
import com.elearning.course.dto.CourseParticular.CourseInfoDTO;
import com.elearning.course.dto.UserMain.UserMainDTO;
import com.elearning.course.dto.UserMain.UserReviewDTO;
import com.elearning.course.entity.CourseRating;
import com.elearning.course.service.CourseLearn.CourseLearnService;
import com.elearning.course.service.CourseParticular.CourseParticularService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import com.elearning.course.dto.UserMain.CourseDto;
import com.elearning.course.service.CourseService;

@RestController
@RequestMapping("/api/course")
@RequiredArgsConstructor
public class CourseController {
  private final CourseParticularService courseParticularService;
  private final CourseLearnService courseLearnService;
  private final CourseService courseService;

  @GetMapping("/{courseId}")
  public ResultData<CourseInfoDTO> getCourseParticular(@PathVariable Long courseId) {
    return ResultData.of(1, "success", courseParticularService.getCourseParticular(courseId));
  }

  @GetMapping("/{courseId}/learn")
  public ResultData<CourseLearnDTO> getCourseLearn(@PathVariable Long courseId) {
    return ResultData.of(1, "success", courseLearnService.getCourseDetails(courseId, null));
  }

   // // 최신강의 조회 (Active)
   // @GetMapping("/latest")
   // public List<CourseDto> getLatestActiveCourses() {
   //   return courseService.getLatestActiveCourses();
   // }
   //
   // // 무료 강의 조회 (Active)
   // @GetMapping("/free")
   // public List<CourseDto> getFreeActiveCourses() {
   //   return courseService.getFreeActiveCourses();
   // }
   //
   // // 강의 평점
   // @GetMapping("/review")
   // public ResponseEntity<List<UserReviewDTO>> getRandomUserReviews() {
   //   // 평점이 4.5 이상인 후기 중 랜덤 3개를 가져옵니다.
   //   List<UserReviewDTO> reviews = courseService.getRandomUserReviews(4, 3);
   //   return ResponseEntity.ok(reviews);
   // }

  @GetMapping("/main")
  public ResultData<UserMainDTO> getUserMainData() {
    UserMainDTO userMainDTO = courseService.getUserMainData();
    return ResultData.of(1, "success", userMainDTO);
  }
}

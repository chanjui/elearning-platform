package com.elearning.user.controller;

import com.elearning.common.ResultData;
import com.elearning.common.config.JwtUser;
import com.elearning.course.dto.CourseLearn.CourseLearnDTO;
import com.elearning.course.dto.CourseLearn.LearnVideoDTO;
import com.elearning.course.dto.CourseLearn.QuestionDTO;
import com.elearning.course.dto.CourseParticular.CourseBasicDTO;
import com.elearning.course.dto.CourseParticular.CourseInfoDTO;
import com.elearning.course.dto.UserMain.UserMainDTO;
import com.elearning.course.service.CourseLearn.CourseLearnService;
import com.elearning.course.service.CourseParticular.CourseParticularService;
import com.elearning.course.service.UserCourseService.UserCourseService;
import com.elearning.user.dto.LectureMemoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/course")
@RequiredArgsConstructor
public class CourseController {
  private final CourseParticularService courseParticularService;
  private final CourseLearnService courseLearnService;
  private final UserCourseService userCourseService;

  @GetMapping("/{courseId}")
  public ResultData<CourseInfoDTO> getCourseParticular(@PathVariable Long courseId, @RequestParam Long userId) {
    return ResultData.of(1, "success", courseParticularService.getCourseParticular(courseId, userId));
  }

  @GetMapping("/{courseId}/learn")
  public ResultData<CourseBasicDTO> getCourseLearn(@PathVariable Long courseId) {
    return ResultData.of(1, "success", courseLearnService.getBasicCourseInfo(courseId));
  }

  @GetMapping("/{courseId}/part")
  public ResultData<CourseLearnDTO> getCourseLearnPart(@PathVariable Long courseId, @RequestParam(required = false, defaultValue = "14") Long userId) {
    return ResultData.of(1, "success", courseLearnService.getCourseDetails(courseId, userId));
  }


  @GetMapping("learn/{videoId}")
  public ResultData<LearnVideoDTO> getLearnVideo(@PathVariable Long videoId, @RequestParam Long userId) {
    return ResultData.of(1, "success", courseLearnService.getLearnVideo(videoId, userId));
  }

  @PostMapping("learn/{videoId}/progress")
  public ResultData<Boolean> setProgress(@RequestParam Long userId, @RequestParam Long lectureVideoId, @RequestParam int currentTime) {
    return ResultData.of(1, "success", courseLearnService.saveOrUpdateProgress(userId, lectureVideoId, currentTime));
  }

  @PostMapping("/question")
  public ResultData<Boolean> addQuestion(@RequestBody QuestionDTO questionDTO) {
    boolean isSaved = courseLearnService.addQuestion(questionDTO);
    return ResultData.of(1, "success", isSaved);
  }

  @GetMapping("/main")
  public ResultData<UserMainDTO> getUserMainData(@AuthenticationPrincipal JwtUser jwtUser) {
    Long userId = jwtUser != null ? Long.valueOf(jwtUser.getId()) : null;
    UserMainDTO userMainDTO = userCourseService.getUserMainData(userId);
    return ResultData.of(1, "success", userMainDTO);
  }

  @PostMapping("/memo")
  public ResultData<Boolean> addMemo(@RequestBody LectureMemoDTO memoDTO) {
    boolean isSaved = courseLearnService.addLectureMemo(memoDTO.getLectureVideoId(), memoDTO.getUserId(), memoDTO.getMemo());
    return ResultData.of(1, "success", isSaved);
  }

  @PostMapping("/{courseId}/addInquiry")
  public ResultData<Boolean> addInquiry(@PathVariable Long courseId, @RequestParam Long userId, @RequestParam String subject, @RequestParam String content) {
    courseParticularService.addInquiry(userId, courseId, subject, content);
    return ResultData.of(1, "success", true);
  }

  @PostMapping("/{courseId}/like")
  public ResultData<Boolean> toggleLike(@PathVariable Long courseId, @RequestParam Long userId) {
    return ResultData.of(1, "success", courseParticularService.toggleCourseLike(courseId, userId));
  }


  //
  // // 최신강의 조회 (Active)
  // @GetMapping("/latest")
  // public List<CourseDto> getLatestActiveCourses() {
  //  System.out.println("최신강의 조회");
  //   return courseService.getLatestActiveCourses();
  // }
  //
  // // 무료 강의 조회 (Active)
  // @GetMapping("/free")
  // public List<CourseDto> getFreeActiveCourses() {
  //  System.out.println("무료 강의 조회");
  //   return courseService.getFreeActiveCourses();
  // }
}

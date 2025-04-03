package com.elearning.user.controller;

import com.elearning.common.ResultData;
import com.elearning.course.dto.CourseLearn.CourseLearnDTO;
import com.elearning.course.dto.CourseParticular.CourseInfoDTO;
import com.elearning.course.dto.UserMain.UserMainDTO;
import com.elearning.course.service.CourseLearn.CourseLearnService;
import com.elearning.course.service.CourseParticular.CourseParticularService;
import com.elearning.course.service.UserCourseService.UserCourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/course")
@RequiredArgsConstructor
public class CourseController {
  private final CourseParticularService courseParticularService;
  private final CourseLearnService courseLearnService;
  private final UserCourseService userCourseService;

  @GetMapping("/{courseId}")
  public ResultData<CourseInfoDTO> getCourseParticular(@PathVariable Long courseId) {
    return ResultData.of(1, "success", courseParticularService.getCourseParticular(courseId));
  }

  @GetMapping("/{courseId}/learn")
  public ResultData<CourseLearnDTO> getCourseLearn(@PathVariable Long courseId) {
    return ResultData.of(1, "success", courseLearnService.getCourseDetails(courseId, null));
  }

  @GetMapping("/main")
  public ResultData<UserMainDTO> getUserMainData() {
    UserMainDTO userMainDTO = userCourseService.getUserMainData();
    return ResultData.of(1, "success", userMainDTO);
  }
}

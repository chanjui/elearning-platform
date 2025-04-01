package com.elearning.course.controller;

import com.elearning.course.dto.CourseDto;
import com.elearning.course.service.CourseService;
import com.elearning.user.service.login.RequestService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {
  private final CourseService courseService;
  private final HttpServletRequest request;
  private final RequestService requestService;

  // 최신강의 조회 (Active)
  @GetMapping("/latest")
  public List<CourseDto> getLatestActiveCourses() {
    return courseService.getLatestActiveCourses();
  }

  // 무료 강의 조회 (Active)
  @GetMapping("/free")
  public List<CourseDto> getFreeActiveCourses() {
    return courseService.getFreeActiveCourses();
  }
}

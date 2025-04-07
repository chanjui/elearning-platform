package com.elearning.instructor.controller;

import com.elearning.common.ResultData;
import com.elearning.common.config.JwtProvider;
import com.elearning.course.entity.Course;
import com.elearning.instructor.dto.InstructorDTO;
import com.elearning.instructor.dto.home.InstructorCourseDTO;
import com.elearning.instructor.service.InstructorHomeService;
import com.elearning.instructor.service.InstructorService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class InstructorHomeController {

  private final InstructorHomeService instructorHomeService;
  private final JwtProvider jwtProvider;

  // 강사 정보 조회 API
  @GetMapping("/profile/{instructorId}")
  public InstructorDTO getInstructorProfile(@PathVariable Long instructorId) {
    return instructorHomeService.getInstructorProfile(instructorId);
  }

  // 강사의 ACTIVE 상태 강의 목록 조회 API
  @GetMapping("/courses/{instructorId}")
  public List<InstructorCourseDTO> getActiveCoursesByInstructor(@PathVariable Long instructorId) {
    return instructorHomeService.getActiveCoursesByInstructor(instructorId);
  }

  // 강사 소개글 수정
  @PostMapping("/bio")
  public ResultData<String> updateBio(
    @RequestBody Map<String, String> body,
    HttpServletRequest request
  ) {
    String bio = body.get("bio");
    String token = jwtProvider.resolveToken(request);
    Long userId = jwtProvider.getUserId(token);

    instructorHomeService.updateBio(userId, bio);
    return ResultData.of(1, "소개글이 성공적으로 수정되었습니다.");
  }
}

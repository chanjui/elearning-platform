package com.elearning.instructor.controller;

import com.elearning.common.ResultData;
import com.elearning.instructor.dto.InstructorDTO;
import com.elearning.instructor.service.InstructorService;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;
import com.elearning.common.config.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/instructor")
@RequiredArgsConstructor
public class InstructorController {

  private final InstructorService instructorService;
  private final JwtProvider jwtProvider;
  private final UserRepository userRepository;

  // 강사 전환 컨트롤러
  @PostMapping("/signup")
  public ResultData<InstructorDTO> signupInstructor(@RequestBody InstructorDTO dto, HttpServletRequest request) {
    String token = jwtProvider.resolveToken(request);
    if (token == null || !jwtProvider.verify(token)) {
      return ResultData.of(0, "로그인이 필요합니다.");
    }

    Long userId = Long.valueOf(jwtProvider.getClaims(token).get("id").toString());

    User user = userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    if (user.getIsInstructor()) {
      return ResultData.of(0, "이미 강사로 등록된 사용자입니다.");
    }

    InstructorDTO created = instructorService.createInstructor(userId, dto);
    return ResultData.of(1, "강사 등록 완료", created);
  }
}

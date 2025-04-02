package com.elearning.instructor.service;

import com.elearning.instructor.dto.InstructorDTO;
import com.elearning.instructor.entity.Instructor;
import com.elearning.instructor.repository.InstructorRepository;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InstructorService {

  private final InstructorRepository instructorRepository;
  private final UserRepository userRepository;

  @Transactional
  public InstructorDTO createInstructor(Long userId, InstructorDTO dto) {
    // 사용자 확인
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    // 강사 중복 방지
    if (user.getIsInstructor() == true) {
      throw new RuntimeException("이미 강사입니다.");
    }

    // DTO → Entity 변환 메서드 사용
    Instructor instructor = dto.toEntity(user);

    // 저장
    instructorRepository.save(instructor);

    // 사용자 isInstructor 상태 변경
    user.setIsInstructor(true);
    userRepository.save(user);

    return InstructorDTO.fromEntity(instructor);
  }
}

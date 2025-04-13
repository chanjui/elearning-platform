package com.elearning.instructor.service;

import com.elearning.course.repository.CategoryRepository;
import com.elearning.instructor.dto.InstructorDTO;
import com.elearning.instructor.entity.Instructor;
import com.elearning.instructor.entity.InstructorCategoryMapping;
import com.elearning.instructor.repository.ExpertiseRepository;
import com.elearning.instructor.repository.InstructorCategoryRepository;
import com.elearning.instructor.repository.InstructorRepository;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InstructorService {

  private final InstructorRepository instructorRepository;
  private final UserRepository userRepository;
  private final InstructorCategoryRepository instructorCategoryRepository;
  private final CategoryRepository categoryRepository;
  private final ExpertiseRepository expertiseRepository;

  @Transactional
  public InstructorDTO createInstructor(Long userId, InstructorDTO instructorDTO) {
    // 사용자 확인
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    //System.out.println("사용자 조회 완료: " + user.getEmail());

    if (user.getIsInstructor()) {
      throw new RuntimeException("이미 강사입니다.");
    }

    // 강사 엔티티 생성 및 설정
    Instructor instructor = instructorDTO.toEntity(user);
    //System.out.println("Instructor 엔티티 생성됨");

    // 전문 분야 설정
    if (instructorDTO.getExpertiseId() != null) {
      var expertise = expertiseRepository.findById(instructorDTO.getExpertiseId())
        .orElseThrow(() -> new RuntimeException("전문 분야가 존재하지 않습니다."));
      instructor.setExpertise(expertise);
      //System.out.println("전문 분야 설정 완료: " + expertise.getName());
    }

    // 먼저 저장해서 ID 확보
    Instructor savedInstructor = instructorRepository.save(instructor);
    //System.out.println("Instructor 저장 완료, id = " + savedInstructor.getId());

    // 희망 분야 매핑 생성
    List<InstructorCategoryMapping> desiredFields = instructorDTO.getFieldIds().stream()
      .map(fieldId -> {
        var category = categoryRepository.findById(fieldId)
          .orElseThrow(() -> new RuntimeException("존재하지 않는 분야입니다."));
        return InstructorCategoryMapping.builder()
          .instructor(savedInstructor)
          .category(category)
          .build();
      })
      .collect(Collectors.toList());

    // 매핑 저장
    instructorCategoryRepository.saveAll(desiredFields);
    //System.out.println("희망 분야 매핑 저장 완료. 총 " + desiredFields.size() + "개");

    // 역방향 연관관계 설정 (선택적)
    savedInstructor.setDesiredFields(desiredFields);

    // 사용자 상태 변경
    user.setIsInstructor(true);
    userRepository.save(user);
    //System.out.println("사용자 isInstructor 상태 업데이트 완료");

    return InstructorDTO.fromEntity(savedInstructor);
  }
}

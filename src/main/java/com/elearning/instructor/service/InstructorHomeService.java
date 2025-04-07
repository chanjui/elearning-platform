package com.elearning.instructor.service;

import com.elearning.course.entity.Course;
import com.elearning.course.repository.CourseRepository;
import com.elearning.instructor.dto.InstructorDTO;
import com.elearning.instructor.dto.home.InstructorCourseDTO;
import com.elearning.instructor.entity.Instructor;
import com.elearning.instructor.repository.InstructorRepository;
import com.elearning.instructor.repository.query.InstructorHomeQueryRepository;
import com.elearning.instructor.repository.query.InstructorHomeQueryRepositoryImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InstructorHomeService {

  private final InstructorRepository instructorRepository;
  private final InstructorHomeQueryRepository instructorHomeQueryRepository;
  private final CourseRepository courseRepository;
  private final InstructorHomeQueryRepositoryImpl instructorHomeQueryRepositoryImpl;

  // 소개글 수정
  @Transactional
  public void updateBio(Long userId, String newBio) {
    Instructor instructor = instructorRepository.findByUserId(userId)
      .orElseThrow(() -> new RuntimeException("강사 정보를 찾을 수 없습니다."));

    instructor.setBio(newBio); // 엔티티 상태 변경
    instructorRepository.save(instructor); // jpa에서 update문 실행
  }

  // 강사 정보 조회
  public InstructorDTO getInstructorProfile(Long instructorId) {
    Instructor instructor = instructorRepository.findById(instructorId)
      .orElseThrow(() -> new RuntimeException("강사를 찾을 수 없습니다."));

    return InstructorDTO.builder()
      .bio(instructor.getBio())
      .nickName(instructor.getUser().getNickname())  // 강사명
      .build();
  }

  // 강사의 ACTIVE 상태 강의 목록 조회
  public List<InstructorCourseDTO> getActiveCoursesByInstructor(Long instructorId) {
    List<Course> courses = instructorHomeQueryRepository.findActiveCoursesByInstructorId(instructorId);

    return courses.stream()
      .map(course -> {
        // 평균 평점 구하기
        Double averageRating = instructorHomeQueryRepositoryImpl.getAverageRatingForCourse(course.getId());

        return new InstructorCourseDTO(
          course.getId(),
          course.getSubject(),
          course.getInstructor().getUser().getNickname(),
          course.getThumbnailUrl(),
          course.getPrice(),
          course.getDiscountRate(),
          averageRating != null ? averageRating : 0.0, // 평균 평점이 없을 경우 0으로 설정
          course.getCategory().getName()
        );
      })
      .collect(Collectors.toList());
  }
}

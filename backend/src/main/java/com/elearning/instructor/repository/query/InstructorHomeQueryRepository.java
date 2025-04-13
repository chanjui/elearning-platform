package com.elearning.instructor.repository.query;

import com.elearning.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface InstructorHomeQueryRepository{
  // 강사 ID로 ACTIVE 상태인 강의 목록 조회
  List<Course> findActiveCoursesByInstructorId(Long instructorId);

  //courseId로 기술 스택 이름 리스트 조회
  List<String> getTechStackNamesByCourseId(Long courseId);
}

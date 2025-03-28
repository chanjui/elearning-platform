package com.elearning.course.repository;

import com.elearning.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {

  // 강사의 모든 강의 수
  int countByInstructorId(Long instructorId);
}

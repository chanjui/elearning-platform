package com.elearning.user.repository;

import com.elearning.user.entity.CourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {
  // 강의 상세 페이지 수강 인원
  Integer countCourseEnrollmentByCourseId(Long courseId);

}

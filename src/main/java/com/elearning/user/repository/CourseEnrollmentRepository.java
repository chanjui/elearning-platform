package com.elearning.user.repository;

import com.elearning.user.entity.CourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {

  // 강사의 강의들을 수강중인 전체 수강생 수 (중복 포함 or distinct 여부는 상황에 따라)
  @Query("SELECT COUNT(e.id) FROM CourseEnrollment e JOIN e.course c WHERE c.instructor.id = :instructorId")
  Long findTotalEnrollmentsByInstructorId(Long instructorId);

  // 필요하다면 중복 제거해서 수강생 수(유저 수)만 distinct로 구할 수도 있음
  @Query("SELECT COUNT(DISTINCT e.user.id) FROM CourseEnrollment e JOIN e.course c WHERE c.instructor.id = :instructorId")
  Long findDistinctStudentsByInstructorId(Long instructorId);
}

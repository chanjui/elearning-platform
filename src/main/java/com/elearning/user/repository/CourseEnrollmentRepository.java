package com.elearning.user.repository;

import com.elearning.course.entity.Course;
import com.elearning.user.entity.CourseEnrollment;
import com.elearning.user.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {
  // 강의 상세 페이지 수강 인원
  Integer countCourseEnrollmentByCourseId(Long courseId);

  boolean existsByUserAndCourse(User user, Course course);

  // 메인 페이지 인기 강의 (수강 등록 많은 순)
  @Query("SELECT ce.course.id, COUNT(ce.user.id) AS enrollCount " +
    "FROM CourseEnrollment ce " +
    "GROUP BY ce.course.id " +
    "ORDER BY enrollCount DESC")
  List<Object[]> findTopCoursesByEnrollmentCount(Pageable pageable);

  // 메인 페이지 로그인한 사용자의 수강 중인 강의 조회 (혜민 작업중)
  @Query("""
    SELECT ce FROM CourseEnrollment ce
      JOIN FETCH ce.course c
      LEFT JOIN FETCH c.category cat
      WHERE ce.user.id = :userId
        AND ce.progress > 0
      ORDER BY ce.enrolledAt DESC
    """)
  List<CourseEnrollment> findEnrolledCourses(@Param("userId") Long userId, Pageable pageable);

  // 메인 페이지 강의별 총 수강생 수
  @Query("SELECT COUNT(e) FROM CourseEnrollment e WHERE e.course.id = :courseId")
  Long countTotalStudentsByCourseId(@Param("courseId") Long courseId);

  @Query("SELECT COUNT(ce) FROM CourseEnrollment ce WHERE ce.course.id = :courseId")
  Long countByCourseId(@Param("courseId") Long courseId);

  @Query("SELECT CASE WHEN COUNT(ce) > 0 THEN true ELSE false END FROM CourseEnrollment ce WHERE ce.user.id = :userId AND ce.course.id = :courseId")
  boolean existsByUserIdAndCourseId(@Param("userId") Long userId, @Param("courseId") Long courseId);

  @Query("SELECT ce.course.id FROM CourseEnrollment ce GROUP BY ce.course.id ORDER BY COUNT(ce) DESC")
  List<Long> findTopCoursesByEnrollmentCount();

  @Query("SELECT ce FROM CourseEnrollment ce WHERE ce.user.id = :userId")
  List<CourseEnrollment> findByUserId(@Param("userId") Long userId);

  @Query("SELECT ce FROM CourseEnrollment ce WHERE ce.user.id = :userId AND ce.completionStatus = false")
  List<CourseEnrollment> findByUserIdAndCompletionStatusFalse(@Param("userId") Long userId);

  @Query("SELECT ce FROM CourseEnrollment ce WHERE ce.user.id = :userId AND ce.completionStatus = true")
  List<CourseEnrollment> findByUserIdAndCompletionStatusTrue(@Param("userId") Long userId);

  @Query("SELECT ce FROM CourseEnrollment ce WHERE ce.user.id = :userId AND ce.course.id = :courseId")
  CourseEnrollment findByUserIdAndCourseId(@Param("userId") Long userId, @Param("courseId") Long courseId);

  @Query("SELECT COUNT(ce) FROM CourseEnrollment ce WHERE ce.user.id = :userId AND ce.completionStatus = true")
  Integer countByUserIdAndCompletionStatusTrue(@Param("userId") Long userId);

  @Query("SELECT ce FROM CourseEnrollment ce WHERE ce.user.id = :userId AND ce.progress > :progress ORDER BY ce.enrolledAt DESC")
  List<CourseEnrollment> findByUserIdAndProgressGreaterThan(@Param("userId") Long userId, @Param("progress") BigDecimal progress, Pageable pageable);

  // 유저가 강의를 수강중인지 검증
  boolean existsByCourseIdAndUserId(Long courseId, Long userId);
  
  Optional<CourseEnrollment> findByUserAndCourse(User user, Course course);
}

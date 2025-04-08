package com.elearning.user.repository;

import com.elearning.course.dto.UserMain.UserSliderDTO;
import com.elearning.course.entity.Course;
import com.elearning.user.entity.CourseEnrollment;
import com.elearning.user.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

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
  // @Query("""
  // SELECT UserSliderDTO(
  //       c.id,
  //       c.subject,
  //       COALESCE(
  //         (SELECT cs.subject FROM CourseSection cs WHERE cs.course.id = c.id AND cs.orderNum = 1), ''
  //       ),
  //       COALESCE(cat.name, ''),
  //       '',
  //       COALESCE(c.instructor.user.nickname, ''),
  //       COALESCE(c.description, ''),
  //       COALESCE(c.backImageUrl, ''),
  //       COALESCE(c.target, ''),
  //       0.0,
  //       (SELECT COUNT(e2) FROM CourseEnrollment e2 WHERE e2.course.id = c.id),
  //       ce.progress
  //     )
  //   FROM CourseEnrollment ce
  //     JOIN ce.course c
  //     LEFT JOIN c.category cat
  //   WHERE ce.user.id = :userId
  //     AND ce.progress > 0
  //   ORDER BY ce.enrolledAt DESC
  // """)
  // List<UserSliderDTO> findEnrolledSliderCourses(@Param("userId") Long userId, Pageable pageable);

  @Query(value = "SELECT " +
    "c.id AS courseId, " +
    "c.subject AS subject, " +
    "COALESCE((SELECT cs.subject FROM courseSection cs WHERE cs.courseId = c.id AND cs.orderNum = 1 LIMIT 1), '') AS sectionTitle, " +
    "COALESCE(cat.name, '') AS category, " +
    "'' AS techStack, " +
    "COALESCE(u.nickname, '') AS instructor, " +
    "COALESCE(c.description, '') AS description, " +
    "COALESCE(c.backImageUrl, '') AS backImageUrl, " +
    "COALESCE(c.target, '') AS target, " +
    "0.0 AS rating, " +
    "(SELECT COUNT(*) FROM courseEnrollment e2 WHERE e2.courseId = c.id) AS totalStudents, " +
    "ce.progress AS progress " +
    "FROM courseEnrollment ce " +
    "JOIN course c ON ce.courseId = c.id " +
    "LEFT JOIN category cat ON c.categoryId = cat.id " +
    "JOIN instructor i ON c.instructorId = i.id " +
    "JOIN user u ON i.userId = u.id " +
    "WHERE ce.userId = :userId " +
    "  AND ce.progress > 0 " +
    "ORDER BY ce.enrolledAt DESC " +
    "LIMIT 5",
    nativeQuery = true)
  List<UserSliderDTO> findEnrolledSliderCourses(@Param("userId") Long userId, Pageable pageable);

  // 수강 중인지 판별
  boolean existsByUserIdAndCourseIdAndIsDelFalse(Long userId, Long courseId);

  // 메인 페이지 강의별 총 수강생 수
  @Query("SELECT COUNT(e) FROM CourseEnrollment e WHERE e.course.id = :courseId")
  Long countTotalStudentsByCourseId(@Param("courseId") Long courseId);
}

package com.elearning.course.repository;

import com.elearning.course.dto.CourseRatingDTO;
import com.elearning.course.dto.UserMain.UserReviewDTO;
import com.elearning.course.entity.CourseRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface CourseRatingRepository extends JpaRepository<CourseRating, Long> {
  // 강의 상세 페이지 강의 평가
  List<CourseRating> findByCourseId(Long courseId);

  // 메인 페이지 강의 평점
  @Query("SELECT cr.course.id, AVG(cr.rating) FROM CourseRating cr " +
    "WHERE cr.course.id IN :courseIds AND cr.isDel = false " +
    "GROUP BY cr.course.id")
  List<Object[]> findAverageRatingsByCourseIds(@Param("courseIds") List<Long> courseIds);

  // 메인 페이지 수강평
  @Query("SELECT new com.elearning.course.dto.UserMain.UserReviewDTO(c.subject, u.nickname, u.profileUrl, cr.content, cr.rating) " +
    "FROM CourseRating cr " +
    "JOIN cr.course c " +
    "JOIN cr.user u " +
    "WHERE cr.rating >= :minRating AND cr.isDel = false " +
    "ORDER BY function('RAND')")
  List<UserReviewDTO> findRandomUserReviews(@Param("minRating") double minRating);

  // 단일 강의 평균 평점
  @Query("SELECT COALESCE(AVG(cr.rating), 0) FROM CourseRating cr " +
    "WHERE cr.course.id = :courseId AND cr.isDel = false")
  Double getAverageRatingByCourseId(@Param("courseId") Long courseId);
  
  // 단일 강의 평점 개수
  @Query("SELECT COUNT(cr) FROM CourseRating cr " +
    "WHERE cr.course.id = :courseId AND cr.isDel = false")
  Long countRatingsByCourseId(@Param("courseId") Long courseId);
}
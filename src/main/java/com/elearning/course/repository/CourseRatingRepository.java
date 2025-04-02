package com.elearning.course.repository;

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
  @Query("SELECT cr.course.id as courseId, AVG(cr.rating) as avgRating FROM CourseRating cr WHERE cr.course.id IN :courseIds GROUP BY cr.course.id")
  List<Object[]> findAverageRatingsByCourseIds(@Param("courseIds") List<Long> courseIds);

}
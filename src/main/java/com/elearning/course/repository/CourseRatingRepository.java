package com.elearning.course.repository;

import com.elearning.course.entity.CourseRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CourseRatingRepository extends JpaRepository<CourseRating, Long> {
  @Query("SELECT AVG(cr.rating) FROM CourseRating cr WHERE cr.course.id = :courseId")
  Double findAverageRatingByCourseId(@Param("courseId") Long courseId);
}

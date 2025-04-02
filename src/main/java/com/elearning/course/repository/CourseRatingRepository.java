package com.elearning.course.repository;

import com.elearning.course.entity.CourseRating;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CourseRatingRepository extends JpaRepository<CourseRating, Long> {
  @Query("SELECT cr.course.id as courseId, AVG(cr.rating) as avgRating FROM CourseRating cr WHERE cr.course.id IN :courseIds GROUP BY cr.course.id")
  List<Object[]> findAverageRatingsByCourseIds(@Param("courseIds") List<Long> courseIds);

}
package com.elearning.course.repository;

import com.elearning.course.entity.CourseRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRatingRepository extends JpaRepository<CourseRating, Long> {
  List<CourseRating> findByCourseId(Long courseId);
}

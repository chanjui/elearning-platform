package com.elearning.course.repository;

import com.elearning.course.entity.CourseRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CourseRatingRepository extends JpaRepository<CourseRating, Long> {

  // 강사의 모든 강의에 대한 평균 평점
  @Query("SELECT AVG(r.rating) FROM CourseRating r JOIN r.course c WHERE c.instructor.id = :instructorId")
  Double findAverageRatingByInstructorId(Long instructorId);
}

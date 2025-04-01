package com.elearning.course.repository;

import com.elearning.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
  // 최신 강의 조회
  List<Course> findByStatusOrderByRegDateDesc(Course.CourseStatus status);

  // 무료 강의 조회
  List<Course> findByStatusAndPrice(Course.CourseStatus status, Integer price);
}
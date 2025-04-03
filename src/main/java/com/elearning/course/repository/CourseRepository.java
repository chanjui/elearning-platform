package com.elearning.course.repository;

import com.elearning.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
  // 상태별 최신 강의 조회 (등록일 내림차순)
  List<Course> findByStatusOrderByRegDateDesc(Course.CourseStatus status);

  // 상태와 가격(무료 강의인 경우 price = 0)으로 조회
  List<Course> findByStatusAndPrice(Course.CourseStatus status, Integer price);
}
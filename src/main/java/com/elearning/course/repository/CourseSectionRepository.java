package com.elearning.course.repository;

import com.elearning.course.entity.CourseSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseSectionRepository extends JpaRepository<CourseSection, Long> {
  // 강의 상세 페이지 강의 섹션
  List<CourseSection> findByCourseId(Long courseId);
}

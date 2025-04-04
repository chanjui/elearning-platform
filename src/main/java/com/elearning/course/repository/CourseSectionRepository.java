package com.elearning.course.repository;

import com.elearning.course.entity.CourseSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseSectionRepository extends JpaRepository<CourseSection, Long> {
  // 강의 상세 페이지 강의 섹션
  List<CourseSection> findByCourseId(Long courseId);

  // 메인 페이지 첫 섹션 제목 조회
  @Query("SELECT cs.subject FROM CourseSection cs WHERE cs.course.id = :courseId AND cs.orderNum = 1")
  String findFirstSectionTitleByCourseId(@Param("courseId") Long courseId);
}

package com.elearning.course.repository;

import com.elearning.course.entity.CourseTechMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseTechMappingRepository extends JpaRepository<CourseTechMapping, Integer> {
  // 메인 페이지 해당 강의의 기술 스택 이름 목록 조회
  @Query("SELECT t.name FROM CourseTechMapping ctm JOIN ctm.techStack t WHERE ctm.course.id = :courseId")
  List<String> findTechStackNamesByCourseId(@Param("courseId") Long courseId);
}

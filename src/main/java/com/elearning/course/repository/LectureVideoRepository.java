package com.elearning.course.repository;

import com.elearning.course.entity.LectureVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LectureVideoRepository extends JpaRepository<LectureVideo, Long> {
  List<LectureVideo> findBySectionId(Long sectionId);
}

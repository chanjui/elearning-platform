package com.elearning.course.repository;

import com.elearning.course.entity.LectureVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LectureVideoRepository extends JpaRepository<LectureVideo, Long> {
  // 강의 상세 페이지 섹션 내 강의 (섹션 ID로 강의를 찾기)
  List<LectureVideo> findBySectionId(Long sectionId);

  List<LectureVideo> findBySectionIdOrderBySeqAsc(Long sectionId);

  Optional<LectureVideo> findBySectionIdAndSeq(Long id, int i);
}

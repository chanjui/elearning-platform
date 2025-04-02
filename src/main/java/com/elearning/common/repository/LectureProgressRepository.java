package com.elearning.common.repository;

import com.elearning.common.entity.LectureProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LectureProgressRepository extends JpaRepository<LectureProgress, Long> {
  LectureProgress findByUserIdAndLectureVideoId(Long userId, Long lectureVideoId);

}

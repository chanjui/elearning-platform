package com.elearning.common.repository;

import com.elearning.common.entity.LectureProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface LectureProgressRepository extends JpaRepository<LectureProgress, Long> {
  LectureProgress findByUserIdAndLectureVideoId(Long userId, Long lectureVideoId);

  LectureProgress findTopByUserIdOrderByUpdatedAtDesc(Long userId);

  @Query("SELECT COALESCE(SUM(lp.currentTime) / 60.0, 0) FROM LectureProgress lp WHERE lp.user.id = :userId AND lp.updatedAt >= :startDate")
  Double calculateWeeklyStudyTime(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate);

  @Query("SELECT COALESCE(SUM(lp.currentTime) / 60.0, 0) FROM LectureProgress lp WHERE lp.user.id = :userId AND lp.updatedAt >= :startDate")
  Double calculateMonthlyStudyTime(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate);

  @Query("SELECT lp FROM LectureProgress lp WHERE lp.user.id = :userId AND lp.lectureVideo.section.course.id = :courseId ORDER BY lp.updatedAt DESC")
  LectureProgress findTopByUserIdAndCourseIdOrderByUpdatedAtDesc(@Param("userId") Long userId, @Param("courseId") Long courseId);
}

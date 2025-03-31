package com.elearning.user.repository;

import com.elearning.instructor.dto.dashboard.CourseEnrollmentDataDto;
import com.elearning.instructor.dto.dashboard.ProgressStatusDto;
import com.elearning.instructor.dto.dashboard.StudyTimeDto;
import com.elearning.user.entity.CourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {

  @Query("SELECT COUNT(e.id) FROM CourseEnrollment e JOIN e.course c WHERE c.instructor.id = :instructorId")
  Long findTotalEnrollmentsByInstructorId(Long instructorId);

  @Query("SELECT COUNT(DISTINCT e.user.id) FROM CourseEnrollment e JOIN e.course c WHERE c.instructor.id = :instructorId")
  Long findDistinctStudentsByInstructorId(Long instructorId);

  @Query("""
    SELECT new com.elearning.instructor.dto.dashboard.ProgressStatusDto(
      CASE
        WHEN lp.progress < 25 THEN '0~25%'
        WHEN lp.progress < 50 THEN '26~50%'
        WHEN lp.progress < 75 THEN '51~75%'
        ELSE '76~100%'
      END,
      COUNT(lp)
    )
    FROM LectureProgress lp
    JOIN lp.lectureVideo v
    JOIN v.section s
    JOIN s.course c
    WHERE c.instructor.id = :instructorId
    GROUP BY
      CASE
        WHEN lp.progress < 25 THEN '0~25%'
        WHEN lp.progress < 50 THEN '26~50%'
        WHEN lp.progress < 75 THEN '51~75%'
        ELSE '76~100%'
      END
  """)
  List<ProgressStatusDto> getProgressStatsByInstructor(Long instructorId);

  @Query("""
    SELECT new com.elearning.instructor.dto.dashboard.CourseEnrollmentDataDto(
      c.id,
      c.subject,
      SUM(CASE WHEN e.completionStatus = false THEN 1L ELSE 0L END),
      SUM(CASE WHEN e.completionStatus = true THEN 1L ELSE 0L END)
    )
    FROM CourseEnrollment e
    JOIN e.course c
    WHERE c.instructor.id = :instructorId
    GROUP BY c.id, c.subject
  """)
  List<CourseEnrollmentDataDto> getCourseEnrollmentData(Long instructorId);

  @Query("""
    SELECT new com.elearning.instructor.dto.dashboard.StudyTimeDto(
      c.id,
      c.subject,
      SUM(lp.currentTime)
    )
    FROM LectureProgress lp
    JOIN lp.lectureVideo v
    JOIN v.section s
    JOIN s.course c
    WHERE c.instructor.id = :instructorId
    GROUP BY c.id, c.subject
  """)
  List<StudyTimeDto> getStudyTimeByInstructor(Long instructorId);


}


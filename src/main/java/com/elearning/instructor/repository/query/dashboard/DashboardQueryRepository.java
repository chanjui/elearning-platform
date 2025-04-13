package com.elearning.instructor.repository.query.dashboard;

import com.elearning.instructor.dto.dashboard.*;
import com.elearning.common.entity.Notification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface DashboardQueryRepository {

  Double findAverageRatingByInstructorId(Long instructorId);

  Double findRecentAverageRatingByInstructorId(Long instructorId, LocalDateTime fromDate);

  int countCoursesByInstructorId(Long instructorId);

  Long findTotalRevenueByInstructorId(Long instructorId);

  Long findMonthlyRevenueByInstructorId(Long instructorId, int year, int month);

  // Long findTotalEnrollmentsByInstructorId(Long instructorId);

  Long findDistinctStudentsByInstructorId(Long instructorId);

  Long countDistinctRecentStudentsByInstructor(Long instructorId, LocalDateTime fromDate);

  List<CourseRevenueDTO> findCourseRevenueDistribution(Long instructorId, int year, int month);

  List<DailyRevenuePerCourseDTO> findDailyRevenueForLast7Days(Long instructorId, LocalDate fromDate);

  List<ProgressStatusDTO> getProgressStatsByInstructor(Long instructorId);

  List<CourseEnrollmentDataDTO> getCourseEnrollmentData(Long instructorId);

  List<StudyTimeDTO> getStudyTimeByInstructor(Long instructorId);

  List<Notification> findTop5NotificationsByInstructorId(Long instructorId);
}

package com.elearning.instructor.repository.query;

import com.elearning.instructor.dto.dashboard.*;
import com.elearning.common.entity.Notification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface DashboardQueryRepository {

  Double findAverageRatingByInstructorId(Long instructorId);

  int countCoursesByInstructorId(Long instructorId);

  Long findTotalRevenueByInstructorId(Long instructorId);

  Long findMonthlyRevenueByInstructorId(Long instructorId, int year, int month);

  // Long findTotalEnrollmentsByInstructorId(Long instructorId);

  Long findDistinctStudentsByInstructorId(Long instructorId);

  Long countDistinctRecentStudentsByInstructor(Long instructorId, LocalDateTime fromDate);

  List<CourseRevenueDto> findCourseRevenueDistribution(Long instructorId, int year, int month);

  List<DailyRevenuePerCourseDto> findDailyRevenueForLast7Days(Long instructorId, LocalDate fromDate);

  List<ProgressStatusDto> getProgressStatsByInstructor(Long instructorId);

  List<CourseEnrollmentDataDto> getCourseEnrollmentData(Long instructorId);

  List<StudyTimeDto> getStudyTimeByInstructor(Long instructorId);

  List<Notification> findTop5NotificationsByUserId(Long userId);
}

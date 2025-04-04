package com.elearning.instructor.repository.query;

import com.elearning.common.entity.Notification;
import com.elearning.instructor.dto.dashboard.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class DashboardQueryRepositoryImpl implements DashboardQueryRepository {

  @PersistenceContext
  private EntityManager em;

  // 강사의 전체 강의에 대한 평균 평점 조회
  @Override
  public Double findAverageRatingByInstructorId(Long instructorId) {
    return em.createQuery(
        "SELECT AVG(r.rating) FROM CourseRating r JOIN r.course c WHERE c.instructor.id = :instructorId",
        Double.class)
      .setParameter("instructorId", instructorId)
      .getSingleResult();
  }

  // 강사의 전체 강의에 대한 최근 30일 평균 평점 조회
  @Override
  public Double findRecentAverageRatingByInstructorId(Long instructorId, LocalDateTime fromDate) {
    return em.createQuery(
        "SELECT AVG(r.rating) " +
        "FROM CourseRating r " +
        "JOIN r.course c " +
        "WHERE c.instructor.id = :instructorId " +
        "AND r.regDate >= :fromDate",
        Double.class)
      .setParameter("instructorId", instructorId)
      .setParameter("fromDate", fromDate)
      .getSingleResult();
  }


  // 강사의 전체 강의 개수 조회
  @Override
  public int countCoursesByInstructorId(Long instructorId) {
    Long count = em.createQuery(
        "SELECT COUNT(c.id) FROM Course c WHERE c.instructor.id = :instructorId",
        Long.class)
      .setParameter("instructorId", instructorId)
      .getSingleResult();
    return count != null ? count.intValue() : 0;
  }

  // 강사의 모든 강의로 인한 총 수익 조회 (결제 상태가 완료된 것만)
  @Override
  public Long findTotalRevenueByInstructorId(Long instructorId) {
    return em.createQuery(
        "SELECT COALESCE(SUM(p.price), 0) FROM Payment p JOIN p.course c WHERE c.instructor.id = :instructorId AND p.status = 1",
        Long.class)
      .setParameter("instructorId", instructorId)
      .getSingleResult();
  }

  // 특정 연/월 기준으로 강사의 월 수익 조회
  @Override
  public Long findMonthlyRevenueByInstructorId(Long instructorId, int year, int month) {
    return em.createQuery(
        "SELECT COALESCE(SUM(p.price), 0) FROM Payment p JOIN p.course c WHERE c.instructor.id = :instructorId AND p.status = 1 AND FUNCTION('YEAR', p.regDate) = :year AND FUNCTION('MONTH', p.regDate) = :month",
        Long.class)
      .setParameter("instructorId", instructorId)
      .setParameter("year", year)
      .setParameter("month", month)
      .getSingleResult();
  }

  // @Override
  // public Long findTotalEnrollmentsByInstructorId(Long instructorId) {
  //   return em.createQuery(
  //       "SELECT COUNT(e.id) FROM CourseEnrollment e JOIN e.course c WHERE c.instructor.id = :instructorId",
  //       Long.class)
  //     .setParameter("instructorId", instructorId)
  //     .getSingleResult();
  // }

  // 강사의 모든 강의에 등록된 고유 수강생 수 조회
  @Override
  public Long findDistinctStudentsByInstructorId(Long instructorId) {
    return em.createQuery(
        "SELECT COUNT(DISTINCT e.user.id) FROM CourseEnrollment e JOIN e.course c WHERE c.instructor.id = :instructorId",
        Long.class)
      .setParameter("instructorId", instructorId)
      .getSingleResult();
  }

  // 최근 1개월 이내에 강의에 등록한 고유 수강생 수 조회
  @Override
  public Long countDistinctRecentStudentsByInstructor(Long instructorId, LocalDateTime fromDate) {
    return em.createQuery(
        "SELECT COUNT(DISTINCT e.user.id) FROM CourseEnrollment e JOIN e.course c WHERE c.instructor.id = :instructorId AND e.enrolledAt >= :fromDate",
        Long.class)
      .setParameter("instructorId", instructorId)
      .setParameter("fromDate", fromDate)
      .getSingleResult();
  }

  @Override
  public List<CourseRevenueDTO> findCourseRevenueDistribution(Long instructorId, int year, int month) {
    Long totalRevenueVal = findMonthlyRevenueByInstructorId(instructorId, year, month);

    // 람다 내부에서 사용하기 위해 totalRevenue를 final 또는 effectively final 변수로 분리
    final Long totalRevenue = (totalRevenueVal == null || totalRevenueVal == 0) ? 1L : totalRevenueVal;

    List<Object[]> results = em.createQuery("""
    SELECT c.id, c.subject, SUM(p.price)
    FROM Payment p
    JOIN p.course c
    WHERE c.instructor.id = :instructorId
      AND p.status = 1
      AND FUNCTION('YEAR', p.regDate) = :year
      AND FUNCTION('MONTH', p.regDate) = :month
    GROUP BY c.id, c.subject
    ORDER BY SUM(p.price) DESC
  """, Object[].class)
      .setParameter("instructorId", instructorId)
      .setParameter("year", year)
      .setParameter("month", month)
      .setMaxResults(5)
      .getResultList();

    return results.stream().map(row -> {
      Long courseId = (Long) row[0];
      String subject = (String) row[1];
      Long revenue = (Long) row[2];
      double percentage = (double) revenue * 100 / totalRevenue;
      return new CourseRevenueDTO(courseId, subject, revenue, percentage);
    }).toList();
  }

  @Override
  public List<DailyRevenuePerCourseDTO> findDailyRevenueForLast7Days(Long instructorId, LocalDate fromDate) {
    List<Object[]> results = em.createQuery("""
        SELECT c.id, c.subject, p.regDate, SUM(p.price)
        FROM Payment p
        JOIN p.course c
        WHERE c.instructor.id = :instructorId
          AND p.status = 1
          AND p.regDate >= :fromDate
        GROUP BY c.id, c.subject, p.regDate
        ORDER BY p.regDate ASC
    """, Object[].class)
      .setParameter("instructorId", instructorId)
      .setParameter("fromDate", fromDate.atStartOfDay()) // LocalDate -> LocalDateTime
      .getResultList();

    return results.stream().map(row -> {
      Long courseId = (Long) row[0];
      String subject = (String) row[1];
      LocalDate date = ((LocalDateTime) row[2]).toLocalDate();
      Long amount = (Long) row[3];

      return new DailyRevenuePerCourseDTO(courseId, subject, date, amount);
    }).toList();
  }


  // 수강생들의 강의 진행률 통계 (0~25%, 26~50%, 등급별로 그룹화)
  @Override
  public List<ProgressStatusDTO> getProgressStatsByInstructor(Long instructorId) {
    return em.createQuery(
        """
        SELECT new com.elearning.instructor.dto.dashboard.ProgressStatusDTO(
          CASE
            WHEN lp.progress < 10 THEN '0~10%'
            WHEN lp.progress < 20 THEN '10~20%'
            WHEN lp.progress < 30 THEN '20~30%'
            WHEN lp.progress < 40 THEN '30~40%'
            WHEN lp.progress < 50 THEN '40~50%'
            WHEN lp.progress < 60 THEN '50~60%'
            WHEN lp.progress < 70 THEN '60~70%'
            WHEN lp.progress < 80 THEN '70~80%'
            WHEN lp.progress < 90 THEN '80~90%'
            ELSE '90~100%'
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
            WHEN lp.progress < 10 THEN '0~10%'
            WHEN lp.progress < 20 THEN '10~20%'
            WHEN lp.progress < 30 THEN '20~30%'
            WHEN lp.progress < 40 THEN '30~40%'
            WHEN lp.progress < 50 THEN '40~50%'
            WHEN lp.progress < 60 THEN '50~60%'
            WHEN lp.progress < 70 THEN '60~70%'
            WHEN lp.progress < 80 THEN '70~80%'
            WHEN lp.progress < 90 THEN '80~90%'
            ELSE '90~100%'
          END
        ORDER BY
          CASE
            WHEN lp.progress < 10 THEN '0~10%'
            WHEN lp.progress < 20 THEN '10~20%'
            WHEN lp.progress < 30 THEN '20~30%'
            WHEN lp.progress < 40 THEN '30~40%'
            WHEN lp.progress < 50 THEN '40~50%'
            WHEN lp.progress < 60 THEN '50~60%'
            WHEN lp.progress < 70 THEN '60~70%'
            WHEN lp.progress < 80 THEN '70~80%'
            WHEN lp.progress < 90 THEN '80~90%'
            ELSE '90~100%'
          END
        """,
        ProgressStatusDTO.class
      )
      .setParameter("instructorId", instructorId)
      .getResultList();
  }

  // 강의별로 강의의 90% 이상 수강한 유저의 비율 (각 강의별로)
  @Override
  public List<CourseEnrollmentDataDTO> getCourseEnrollmentData(Long instructorId) {
    List<CourseEnrollmentDataDTO> result = em.createQuery(
        """
          SELECT new com.elearning.instructor.dto.dashboard.CourseEnrollmentDataDTO(
            c.id,
            c.subject,
            COUNT(ce.id),
            COUNT(CASE WHEN ce.progress >= 90 THEN ce.id END)
          )
          FROM CourseEnrollment ce
          JOIN ce.course c
          WHERE c.instructor.id = :instructorId
          GROUP BY c.id, c.subject
        """,
        CourseEnrollmentDataDTO.class)
      .setParameter("instructorId", instructorId)
      .getResultList();

    return result.stream()
      .sorted(Comparator.comparingDouble(CourseEnrollmentDataDTO::getCompletionRate).reversed())
      .limit(5)
      .toList();
  }


  // 강의별 수강생들의 누적 학습 시간 통계
  @Override
  public List<StudyTimeDTO> getStudyTimeByInstructor(Long instructorId) {
    List<Object[]> results = em.createNativeQuery("""
        WITH user_study AS (
          SELECT
            ce.courseId,
            lp.userId,
            SUM(lp.currentTime) AS total_study_time,
            ROW_NUMBER() OVER (PARTITION BY ce.courseId ORDER BY SUM(lp.currentTime)) AS row_num,
            COUNT(*) OVER (PARTITION BY ce.courseId) AS total_users
          FROM lectureProgress lp
          JOIN lectureVideo lv ON lv.id = lp.lectureVideoId
          JOIN courseSection cs ON cs.id = lv.sectionId
          JOIN courseEnrollment ce ON ce.userId = lp.userId AND ce.courseId = cs.courseId
          WHERE ce.progress >= 90
          GROUP BY ce.courseId, lp.userId
        ),
        study_median AS (
          SELECT
            courseId,
            total_study_time
          FROM user_study
          WHERE row_num = FLOOR((total_users + 1) / 2)
        )
        SELECT
          c.id AS courseId,
          c.subject AS courseTitle,
          ROUND(AVG(lv.duration)) AS averageVideoTime,
          COUNT(DISTINCT lv.id) AS videoCount,
          ROUND(AVG(us.total_study_time) / 60) AS avgStudyMinutes
        FROM course c
        JOIN courseEnrollment ce ON ce.courseId = c.id
        JOIN lectureVideo lv ON lv.sectionId IN (
          SELECT cs.id FROM courseSection cs WHERE cs.courseId = c.id
        )
        JOIN user_study us ON us.courseId = c.id
        JOIN study_median sm ON sm.courseId = c.id
        WHERE c.instructorId = :instructorId
        AND (
          SELECT COUNT(*) FROM courseEnrollment ce2 WHERE ce2.courseId = c.id
        ) >= 0
        AND us.total_study_time >= sm.total_study_time
        GROUP BY c.id, c.subject
        LIMIT 5
    """)
      .setParameter("instructorId", instructorId)
      .getResultList();

    return results.stream().map(row -> new StudyTimeDTO(
      ((Number) row[0]).longValue(),            // courseId
      (String) row[1],                          // courseTitle
      ((Number) row[2]).intValue(),             // avgVideoTime
      ((Number) row[3]).intValue(),             // videoCount
      ((Number) row[4]).intValue()              // avgStudyMinutes
    )).toList();
  }


  // 해당 유저의 최근 알림 5개 조회 (userId → user.id 사용 주의!)
  @Override
  public List<Notification> findTop5NotificationsByInstructorId(Long instructorId) {
    return em.createQuery("""
      SELECT n FROM Notification n
      JOIN n.user u
      JOIN Instructor i ON i.user.id = u.id
      WHERE i.id = :instructorId
      ORDER BY n.createdAt DESC
      """, Notification.class)
      .setParameter("instructorId", instructorId)
      .setMaxResults(5)
      .getResultList();
  }


}

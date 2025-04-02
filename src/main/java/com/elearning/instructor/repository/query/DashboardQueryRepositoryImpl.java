package com.elearning.instructor.repository.query;

import com.elearning.common.entity.Notification;
import com.elearning.instructor.dto.dashboard.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
  public List<CourseRevenueDto> findCourseRevenueDistribution(Long instructorId, int year, int month) {
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
      return new CourseRevenueDto(courseId, subject, revenue, percentage);
    }).toList();
  }

  @Override
  public List<DailyRevenuePerCourseDto> findDailyRevenueForLast7Days(Long instructorId, LocalDate fromDate) {
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

      return new DailyRevenuePerCourseDto(courseId, subject, date, amount);
    }).toList();
  }


  // 수강생들의 강의 진행률 통계 (0~25%, 26~50%, 등급별로 그룹화)
  @Override
  public List<ProgressStatusDto> getProgressStatsByInstructor(Long instructorId) {
    return em.createQuery(
        """
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
        """,
        ProgressStatusDto.class)
      .setParameter("instructorId", instructorId)
      .getResultList();
  }

  // 강의별로 수강자 수 및 완료자 수 통계 (각 강의별로)
  @Override
  public List<CourseEnrollmentDataDto> getCourseEnrollmentData(Long instructorId) {
    return em.createQuery(
        """
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
        """,
        CourseEnrollmentDataDto.class)
      .setParameter("instructorId", instructorId)
      .getResultList();
  }

  // 강의별 수강생들의 누적 학습 시간 통계
  @Override
  public List<StudyTimeDto> getStudyTimeByInstructor(Long instructorId) {
    return em.createQuery(
        """
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
        """,
        StudyTimeDto.class)
      .setParameter("instructorId", instructorId)
      .getResultList();
  }

  // 해당 유저의 최근 알림 5개 조회 (userId → user.id 사용 주의!)
  @Override
  public List<Notification> findTop5NotificationsByUserId(Long userId) {
    return em.createQuery(
        "SELECT n FROM Notification n WHERE n.user.id = :userId ORDER BY n.createdAt DESC",
        Notification.class)
      .setParameter("userId", userId)
      .setMaxResults(5)
      .getResultList();
  }

}

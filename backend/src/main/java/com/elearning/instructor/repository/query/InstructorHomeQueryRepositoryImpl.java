package com.elearning.instructor.repository.query;

import com.elearning.course.entity.Course;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class InstructorHomeQueryRepositoryImpl implements InstructorHomeQueryRepository {

  private final EntityManager entityManager;

  @Override
  public List<Course> findActiveCoursesByInstructorId(Long instructorId) {
    // JPQL 쿼리: 강사의 ACTIVE 상태인 강의만 조회
    String jpql = "SELECT c FROM Course c WHERE c.instructor.id = :instructorId AND c.status = 'ACTIVE'";
    TypedQuery<Course> query = entityManager.createQuery(jpql, Course.class);
    query.setParameter("instructorId", instructorId);
    return query.getResultList();
  }

  // 강의의 평균 평점 구하기 (Course와 CourseRating을 JOIN)
  public Double getAverageRatingForCourse(Long courseId) {
    String jpql = "SELECT AVG(cr.rating) FROM CourseRating cr WHERE cr.course.id = :courseId";
    TypedQuery<Double> query = entityManager.createQuery(jpql, Double.class);
    query.setParameter("courseId", courseId);
    return query.getSingleResult();
  }

  // 강의 기술 스택 조회
  @Override
  public List<String> getTechStackNamesByCourseId(Long courseId) {
    String jpql = """
    SELECT ctm.techStack.name
    FROM CourseTechMapping ctm
    WHERE ctm.course.id = :courseId
  """;
    return entityManager.createQuery(jpql, String.class)
      .setParameter("courseId", courseId)
      .getResultList();
  }

}

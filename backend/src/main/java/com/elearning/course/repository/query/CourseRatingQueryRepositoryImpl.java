package com.elearning.course.repository.query;

import com.elearning.course.dto.CourseRatingDTO;
import com.elearning.course.repository.CourseRatingRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CourseRatingQueryRepositoryImpl implements CourseRatingQueryRepository {

  @PersistenceContext
  private EntityManager em;

  @Override
  public List<CourseRatingDTO> findRatingsByInstructorId(Long instructorId) {
    String jpql = """
                SELECT new com.elearning.course.dto.CourseRatingDTO(
                    cr.id,
                    cr.course.id,
                    cr.course.subject,
                    cr.course.thumbnailUrl,
                    cr.user.id,
                    cr.user.nickname,
                    cr.user.profileUrl,
                    cr.content,
                    cr.rating,
                    cr.regDate
                )
                FROM CourseRating cr
                WHERE cr.course.instructor.id = :instructorId
                AND cr.isDel = false
                ORDER BY cr.regDate DESC
                """;

    TypedQuery<CourseRatingDTO> query = em.createQuery(jpql, CourseRatingDTO.class);
    query.setParameter("instructorId", instructorId);

    return query.getResultList();
  }

}

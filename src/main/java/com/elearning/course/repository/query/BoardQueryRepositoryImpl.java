package com.elearning.course.repository.query;

import com.elearning.course.dto.BoardInstructorDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class BoardQueryRepositoryImpl implements BoardQueryRepository{

  @PersistenceContext
  private EntityManager em;

  @Override
  public List<BoardInstructorDTO> findPostsByInstructorId(Long instructorId) {
    String jpql = """
                SELECT new com.elearning.course.dto.BoardInstructorDTO(
                    b.id,
                    b.subject,
                    b.content,
                    b.regDate
                )
                FROM Board b
                WHERE b.course.instructor.id = :instructorId
                AND b.isDel = false
                ORDER BY b.regDate DESC
                """;

    TypedQuery<BoardInstructorDTO> query = em.createQuery(jpql, BoardInstructorDTO.class);
    query.setParameter("instructorId", instructorId);
    return query.getResultList();
  }
}

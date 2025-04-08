package com.elearning.course.repository.query;

import com.elearning.course.dto.BoardInstructorDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BoardQueryRepositoryImpl implements BoardQueryRepository{

  @PersistenceContext
  private EntityManager em;

  @Override
  public List<BoardInstructorDTO> findPostsByInstructorId(Long instructorId) {
    String jpql = """
            SELECT new com.elearning.course.dto.BoardInstructorDTO(
                b.id,
                b.bname,
                b.subject,
                b.content,
                b.regDate,
                (
                    SELECT c.content
                    FROM Comment c
                    WHERE c.board.id = b.id
                    AND c.user.id = b.course.instructor.user.id
                    ORDER BY c.regDate ASC
                )
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

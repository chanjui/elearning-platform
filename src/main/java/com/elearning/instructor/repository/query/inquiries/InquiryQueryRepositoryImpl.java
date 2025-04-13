package com.elearning.instructor.repository.query.inquiries;

import com.elearning.instructor.dto.inquiries.InquiryQueryDTO;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class InquiryQueryRepositoryImpl implements InquiryQueryRepository {

  private final EntityManager em;

  @Override
  public List<InquiryQueryDTO> searchInquiries(Long instructorId, Long courseId, String query, String filterStatus) {

    StringBuilder jpql = new StringBuilder("""
      SELECT new com.elearning.instructor.dto.inquiries.InquiryQueryDTO(
        b.id,
        c.subject,
        b.subject,
        b.content,
        u.nickname,
        b.regDate,
        (SELECT COUNT(*) FROM Comment cm WHERE cm.board.id = b.id AND cm.isDel = false)
      )
      FROM Board b
      JOIN b.course c
      JOIN b.user u
      WHERE c.instructor.id = :instructorId
        AND b.bname = '수강전질문'
        AND b.isDel = false
    """);

    if (query != null && !query.isBlank()) {
      jpql.append(" AND (b.subject LIKE :query OR b.content LIKE :query OR u.nickname LIKE :query)");
    }

    if (courseId != null) {
      jpql.append(" AND c.id = :courseId");
    }

    if (filterStatus != null && !filterStatus.equals("전체")) {
      if (filterStatus.equals("미답변")) {
        jpql.append(" AND (SELECT COUNT(*) FROM Comment cm WHERE cm.board.id = b.id AND cm.isDel = false) = 0");
      } else if (filterStatus.equals("답변완료")) {
        jpql.append(" AND (SELECT COUNT(*) FROM Comment cm WHERE cm.board.id = b.id AND cm.isDel = false) > 0");
      }
    }

    jpql.append(" ORDER BY b.regDate DESC");

    var queryObj = em.createQuery(jpql.toString(), InquiryQueryDTO.class)
      .setParameter("instructorId", instructorId);

    if (query != null && !query.isBlank()) {
      queryObj.setParameter("query", "%" + query + "%");
    }

    if (courseId != null) {
      queryObj.setParameter("courseId", courseId);
    }

    return queryObj.getResultList();
  }
}

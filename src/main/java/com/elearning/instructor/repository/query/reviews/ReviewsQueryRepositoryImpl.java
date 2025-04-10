package com.elearning.instructor.repository.query.reviews;

import com.elearning.instructor.dto.reviews.CourseRatingReviewDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class ReviewsQueryRepositoryImpl implements ReviewsQueryRepository {

  private final JdbcTemplate jdbcTemplate;

  @Override
  public List<CourseRatingReviewDTO> findReviews(Long instructorId, Long courseId, String query) {
    StringBuilder sql = new StringBuilder("""
            SELECT 
                cr.id,
                cr.content,
                cr.rating,
                DATE_FORMAT(cr.regDate, '%Y-%m-%d') AS regDate,
                u.id AS userId,
                u.nickname,
                c.id AS courseId,
                c.subject
            FROM courseRating cr
            JOIN course c ON cr.courseId = c.id
            JOIN user u ON cr.userId = u.id
            WHERE c.instructorId = ?
              AND cr.isDel = 0
        """);

    List<Object> params = new ArrayList<>();
    params.add(instructorId);

    if (courseId != null) {
      sql.append(" AND c.id = ?");
      params.add(courseId);
    }

    if (query != null && !query.isBlank()) {
      sql.append(" AND (LOWER(cr.content) LIKE LOWER(?) OR LOWER(u.nickname) LIKE LOWER(?))");
      String q = "%" + query + "%";
      params.add(q);
      params.add(q);
    }

    sql.append(" ORDER BY cr.regDate DESC");

    return jdbcTemplate.query(sql.toString(), params.toArray(), this::mapRowToDto);
  }

  private CourseRatingReviewDTO mapRowToDto(ResultSet rs, int rowNum) throws SQLException {
    CourseRatingReviewDTO dto = new CourseRatingReviewDTO();
    dto.setId(rs.getLong("id"));
    dto.setContent(rs.getString("content"));
    dto.setRating(rs.getInt("rating"));
    dto.setRegDate(rs.getString("regDate"));
    dto.setUserId(rs.getLong("userId"));
    dto.setNickname(rs.getString("nickname"));
    dto.setCourseId(rs.getLong("courseId"));
    dto.setSubject(rs.getString("subject"));
    return dto;
  }
}


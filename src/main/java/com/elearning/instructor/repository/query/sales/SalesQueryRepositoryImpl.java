package com.elearning.instructor.repository.query.sales;

import com.elearning.instructor.dto.sales.CourseSimpleDTO;
import com.elearning.instructor.dto.sales.SalesHistoryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class SalesQueryRepositoryImpl implements SalesQueryRepository {

  private final JdbcTemplate jdbcTemplate;

  @Override
  public List<SalesHistoryDTO> findSalesHistory(Long instructorId, int year, int month,
                                                Long courseId, Long categoryId, String searchQuery) {
    StringBuilder sql = new StringBuilder("""
    SELECT 
        DATE_FORMAT(p.regDate, '%Y-%m-%d') AS date,
        DATE_FORMAT(p.regDate, '%H:%i') AS time,
        c.subject AS courseTitle,
        u.nickname AS studentName,
        c.price AS originalPrice,
        p.price AS actualPrice,
        FLOOR(p.price * (1 - ph.feeRate / 100)) AS instructorRevenue
    FROM payment p
    JOIN course c ON p.courseId = c.id
    JOIN user u ON p.userId = u.id
    JOIN paymentHistory ph ON ph.paymentId = p.id
    WHERE ph.instructorId = ?
      AND p.status = 1
      AND YEAR(p.regDate) = ?
      AND MONTH(p.regDate) = ?
  """);

    // ✅ PreparedStatement에 바인딩할 파라미터 리스트
    List<Object> params = new java.util.ArrayList<>();
    params.add(instructorId);
    params.add(year);
    params.add(month);

    // ✅ 조건 추가
    if (courseId != null) {
      sql.append(" AND c.id = ?");
      params.add(courseId);
    }

    if (categoryId != null) {
      sql.append(" AND c.categoryId = ?");
      params.add(categoryId);
    }

    if (searchQuery != null && !searchQuery.isBlank()) {
      sql.append(" AND u.nickname LIKE ?");
      params.add("%" + searchQuery + "%");
    }

    sql.append(" ORDER BY p.regDate DESC");

    return jdbcTemplate.query(
      sql.toString(),
      params.toArray(),
      (rs, rowNum) -> mapRowToDto(rs)
    );
  }

  @Override
  public List<CourseSimpleDTO> findCoursesByInstructorId(Long instructorId) {
    String sql = """
            SELECT id, subject AS title
            FROM course
            WHERE instructorId = ?
              AND isDel = 0
        """;

    return jdbcTemplate.query(sql, new Object[]{instructorId}, (rs, rowNum) ->
      new CourseSimpleDTO(
        rs.getLong("id"),
        rs.getString("title")
      )
    );
  }


  private SalesHistoryDTO mapRowToDto(ResultSet rs) throws SQLException {
    return SalesHistoryDTO.builder()
      .date(rs.getString("date"))
      .time(rs.getString("time"))
      .courseTitle(rs.getString("courseTitle"))
      .studentName(rs.getString("studentName"))
      .originalPrice(rs.getInt("originalPrice"))
      .actualPrice(rs.getInt("actualPrice"))
      .instructorRevenue(rs.getInt("instructorRevenue"))
      .build();
  }
}


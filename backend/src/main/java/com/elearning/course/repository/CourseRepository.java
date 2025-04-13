package com.elearning.course.repository;

import com.elearning.course.entity.Course;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
  //상태별 최신 강의 조회 (등록일 내림차순)
  List<Course> findTop5ByStatusOrderByRegDateDesc(Course.CourseStatus status);
  Optional<Course> findByIdAndStatus(Long id, Course.CourseStatus status);
  // 상태와 가격(무료 강의인 경우 price = 0)으로 조회
  List<Course> findTop5ByStatusAndPrice(Course.CourseStatus status, Integer price);

  // 메인 페이지 카테고리별 top1 강의 (ACTIVE 상태, 평점 내림차순)
  @Query("SELECT c FROM Course c " +
    "WHERE c.category.id = :categoryId AND c.status = :status " +
    "ORDER BY (SELECT COALESCE(AVG(cr.rating), 0) FROM CourseRating cr WHERE cr.course = c AND cr.isDel = false) DESC")
  List<Course> findTopByCategoryIdAndStatusOrderByAverageRatingDesc(
    @Param("categoryId") Long categoryId,
    @Param("status") Course.CourseStatus status,
    Pageable pageable
  );
}
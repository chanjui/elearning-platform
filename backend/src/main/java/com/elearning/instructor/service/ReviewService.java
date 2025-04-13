package com.elearning.instructor.service;

import com.elearning.instructor.dto.reviews.CourseRatingReviewDTO;
import com.elearning.instructor.repository.query.reviews.ReviewsQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

  private final ReviewsQueryRepository reviewsQueryRepository;

  /**
   * 강사의 수강평 목록 조회 (조건: 강의 ID, 검색어)
   *
   * @param instructorId 강사 ID
   * @param courseId     특정 강의 ID (nullable)
   * @param query        작성자 or 내용 검색어 (nullable)
   * @return 수강평 리스트
   */
  public List<CourseRatingReviewDTO> searchReviews(Long instructorId, Long courseId, String query) {
    return reviewsQueryRepository.findReviews(instructorId, courseId, query);
  }
}

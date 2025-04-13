package com.elearning.instructor.repository.query.reviews;

import com.elearning.instructor.dto.reviews.CourseRatingReviewDTO;
import java.util.List;

public interface ReviewsQueryRepository {
  List<CourseRatingReviewDTO> findReviews(Long instructorId, Long courseId, String query);
}

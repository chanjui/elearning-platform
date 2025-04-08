package com.elearning.course.repository.query;

import com.elearning.course.dto.CourseRatingDTO;
import com.elearning.course.entity.CourseRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface CourseRatingQueryRepository {

  // instructorId(강사 ID)에 해당하는 강사의 모든 강의에 작성된 수강평을 조회
  List<CourseRatingDTO> findRatingsByInstructorId(Long instructorId);
}

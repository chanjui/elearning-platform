package com.elearning.course.repository.query;

import com.elearning.course.dto.BoardInstructorDTO;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardQueryRepository {
  // 특정 강사의 모든 강의에 작성된 게시글 조회
  List<BoardInstructorDTO> findPostsByInstructorId(Long instructorId);
}

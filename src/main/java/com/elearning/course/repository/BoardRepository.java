package com.elearning.course.repository;

import com.elearning.course.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
  // 강의 상세 페이지 수강전 문의
  List<Board> findByCourseIdAndBname(Long courseId, Board.BoardType bname);

  // 특정 강사의 강의들에 속한 수강전 질문만 조회 (삭제되지 않은 것만)
  List<Board> findByCourse_InstructorIdAndBnameAndIsDel(Long instructorId, String bname, boolean isDel);
}

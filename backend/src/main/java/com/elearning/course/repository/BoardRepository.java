package com.elearning.course.repository;

import com.elearning.course.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
  // 강의 상세 페이지 수강전 문의
  List<Board> findByCourseIdAndBnameAndUserId(Long courseId, Board.BoardType bname, Long userId);

  // 커뮤니티 내 게시물(수강평, 수강전문의 제외)
  List<Board> findAllByBnameNotInAndIsDelFalse(List<Board.BoardType> 수강평);

  // 커뮤니티 게시물 1개 반환
  Optional<Board> findByIdAndIsDelFalse(Long boardId);

  // 특정 강사의 강의들에 속한 수강전 질문만 조회 (삭제되지 않은 것만)
  List<Board> findByCourse_InstructorIdAndBnameAndIsDel(Long instructorId, String bname, boolean isDel);
}

package com.elearning.course.repository;

import com.elearning.course.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
  // 강의 상세 페이지 수강전 문의
  List<Board> findByCourseIdAndBname(Long courseId, Board.BoardType bname);

  // 커뮤니티 내 게시물(수강평, 수강전문의 제외)
  List<Board> findAllByBnameNotInAndDelFalse(List<Board.BoardType> boardTypes);

}

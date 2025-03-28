package com.elearning.course.repository;

import com.elearning.course.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
  List<Board> findByCourseIdAndBname(Long courseId, Board.BoardType bname);
}

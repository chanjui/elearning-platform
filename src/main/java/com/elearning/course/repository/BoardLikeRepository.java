package com.elearning.course.repository;

import com.elearning.course.entity.Board;
import com.elearning.course.entity.BoardLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardLikeRepository extends JpaRepository<BoardLike, Long> {

  int countByBoard(Board board);
}

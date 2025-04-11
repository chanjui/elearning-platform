package com.elearning.course.repository;

import com.elearning.course.entity.Board;
import com.elearning.course.entity.BoardLike;
import com.elearning.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardLikeRepository extends JpaRepository<BoardLike, Long> {

  int countByBoard(Board board);

  Optional<BoardLike> findByBoardAndUser(Board board, User user);
}

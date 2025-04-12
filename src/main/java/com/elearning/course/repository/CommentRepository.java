package com.elearning.course.repository;

import com.elearning.course.entity.Board;
import com.elearning.course.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
  List<Comment> findByBoardId(Long boardId);

  // 특정 게시글(boardId)에 대한 답변(댓글)만 조회 (삭제되지 않은 것만)
  List<Comment> findByBoardIdAndIsDel(Long boardId, boolean isDel);

  int countByBoardAndIsDelFalse(Board board);

  List<Comment> findByBoardAndIsDelFalse(Board board);
}

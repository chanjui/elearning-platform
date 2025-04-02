package com.elearning.course.repository;

import com.elearning.course.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
  List<Comment> findByBoardId(Long boardId);
}

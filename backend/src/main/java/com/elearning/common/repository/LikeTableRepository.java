package com.elearning.common.repository;

import com.elearning.common.entity.LikeTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeTableRepository extends JpaRepository<LikeTable, Long> {
  Optional<LikeTable> findByCourseIdAndUserId(Long courseId, Long userId);

  boolean existsByCourseIdAndUserId(Long courseId, Long userId);
}

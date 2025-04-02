package com.elearning.user.repository;

import com.elearning.user.entity.LectureMemo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LectureMemoRepository extends JpaRepository<LectureMemo, Long> {
  List<LectureMemo> findByLectureVideoId(Long videoId);
}

package com.elearning.instructor.repository;

import com.elearning.instructor.entity.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Instructor 엔티티를 위한 기본 JPA Repository
public interface InstructorRepository extends JpaRepository<Instructor, Long> {

  // 특정 userId를 통해 해당 유저가 강사로 등록되어 있는지 조회
  Optional<Instructor> findByUserId(Long userId);
}

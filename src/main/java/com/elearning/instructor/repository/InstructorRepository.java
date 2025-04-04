package com.elearning.instructor.repository;

import com.elearning.course.dto.UserMain.UserRecInstructorDTO;
import com.elearning.instructor.entity.Instructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface InstructorRepository extends JpaRepository<Instructor, Long> {

  // 특정 userId를 통해 해당 유저가 강사로 등록되어 있는지 조회
  Optional<Instructor> findByUserId(Long userId);


  // 메인 페이지 강사 추천 (평균 평점 4.0 이상, 무작위 정렬)
  @Query("""
    SELECT new com.elearning.course.dto.UserMain.UserRecInstructorDTO(
        i.id,
        u.nickname,
        u.profileUrl,
        i.bio,
        (SELECT COUNT(c) FROM Course c WHERE c.instructor.id = i.id),
        (SELECT COUNT(e) FROM CourseEnrollment e JOIN e.course c2 WHERE c2.instructor.id = i.id),
        (SELECT COALESCE(AVG(r.rating), 0.0) FROM CourseRating r JOIN r.course c3 WHERE c3.instructor.id = i.id)
    )
    FROM Instructor i
    JOIN i.user u
    WHERE i.isDel = false
      AND u.isInstructor = true
      AND (SELECT COALESCE(AVG(r.rating), 0.0)
           FROM CourseRating r JOIN r.course c3
           WHERE c3.instructor.id = i.id) >= 4.0
    ORDER BY function('RAND')
    """)
  List<UserRecInstructorDTO> findRandomRecInstructors(Pageable pageable);
}
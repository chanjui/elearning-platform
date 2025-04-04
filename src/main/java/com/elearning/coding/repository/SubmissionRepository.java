package com.elearning.coding.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.elearning.coding.entity.Submissions;
import java.util.List;


public interface SubmissionRepository extends JpaRepository<Submissions, Long> {
  List<Submissions> findByProblem_Id(Long problemId);
  
  // 특정 문제의 전체 제출 수
  @Query("SELECT COUNT(s) FROM Submissions s WHERE s.problem.id = :problemId")
  Long countByProblemId(Long problemId);
  
  // 특정 문제의 통과된 제출 수
  @Query("SELECT COUNT(s) FROM Submissions s WHERE s.problem.id = :problemId AND s.status = 'ACCEPTED'")
  Long countAcceptedByProblemId(Long problemId);

  List<Submissions> findByProblem_IdAndUser_Id(Long problemId, Long userId);

  // 문제별 고유한 참여자 수를 세는 쿼리 추가
  @Query("SELECT COUNT(DISTINCT s.user.id) FROM Submissions s WHERE s.problem.id = :problemId")
  Long countDistinctUsersByProblemId(Long problemId);

  // 문제별 성공한 고유한 참여자 수를 세는 쿼리 추가
  @Query("SELECT COUNT(DISTINCT s.user.id) FROM Submissions s WHERE s.problem.id = :problemId AND s.status = 'ACCEPTED'")
  Long countDistinctSuccessfulUsersByProblemId(Long problemId);
}

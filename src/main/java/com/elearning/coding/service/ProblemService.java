package com.elearning.coding.service;

import com.elearning.coding.entity.Problems;
import com.elearning.coding.repository.ProblemRepository;
import com.elearning.coding.repository.SubmissionRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;
import com.elearning.coding.entity.Submissions;

@Service
public class ProblemService {

  private final ProblemRepository problemRepository;
  private final SubmissionRepository submissionRepository;

  public ProblemService(ProblemRepository problemRepository, SubmissionRepository submissionRepository) {
    this.problemRepository = problemRepository;
    this.submissionRepository = submissionRepository;
  }

  public List<Problems> getAllProblems() {
    return problemRepository.findAll();
  }

  public Optional<Problems> getProblemById(Long id) {
    return problemRepository.findById(id);
  }

  public Map<String, Object> getProblemStats(Long problemId) {
    Map<String, Object> stats = new HashMap<>();
    
    // 해당 문제의 전체 제출 기록 조회
    List<Submissions> submissions = submissionRepository.findByProblem_Id(problemId);
    
    // 전체 제출 수
    long totalSubmissions = submissions.size();
    
    // 성공한 제출 수
    long successSubmissions = submissions.stream()
        .filter(s -> s.getStatus() == Submissions.SubmissionStatus.ACCEPTED)
        .count();
    
    // 정답률 계산
    double successRate = totalSubmissions > 0 
        ? (double) successSubmissions / totalSubmissions * 100 
        : 0.0;
        
    // 소수점 2자리까지 반올림
    successRate = Math.round(successRate * 100.0) / 100.0;
    
    // 고유한 참여자 수 (중복 제거)
    long uniqueParticipants = submissions.stream()
        .map(s -> s.getUser().getId())
        .distinct()
        .count();

    stats.put("participants", uniqueParticipants);
    stats.put("successRate", successRate);
    
    return stats;
  }

  // 특정 사용자의 문제 풀이 상태 조회
  public String getProblemStatus(Long problemId, Long userId) {
    if (userId == null) return "NOT_ATTEMPTED";
    
    List<Submissions> userSubmissions = submissionRepository.findByProblem_IdAndUser_Id(problemId, userId);
    if (userSubmissions.isEmpty()) {
        return "NOT_ATTEMPTED";
    }
    
    // 하나라도 성공한 제출이 있는지 확인
    boolean hasSuccess = userSubmissions.stream()
        .anyMatch(submission -> submission.getStatus() == Submissions.SubmissionStatus.ACCEPTED);
        
    return hasSuccess ? "SUCCESS" : "FAIL";
  }
}
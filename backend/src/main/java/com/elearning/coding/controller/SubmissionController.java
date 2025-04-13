package com.elearning.coding.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.elearning.coding.dto.SubmissionsDTO;
import com.elearning.coding.entity.Submissions;
import com.elearning.coding.service.SubmissionService;

import com.elearning.coding.service.ProblemService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/coding/submissions")
public class SubmissionController {
  private final SubmissionService submissionService;
  private final ProblemService problemService;

  public SubmissionController(SubmissionService submissionService, ProblemService problemService) {
    this.submissionService = submissionService;
    this.problemService = problemService;
  }

  //  코드제출 
  @PostMapping("/{problemId}")
  public ResponseEntity<Submissions> submitCode(
    @PathVariable Long problemId,
    @RequestBody SubmissionsDTO request) {
      System.out.println("코드"+request.getCode());
      System.out.println("언어"+request.getLanguage());
      System.out.println("유저아이디"+request.getUserId());
    Submissions submission = submissionService.submitSolution(problemId, request.getLanguage().toString(), request.getCode(), request.getUserId());
    System.out.println("제출완료"+submission);
    return ResponseEntity.ok(submission);
  }

  // 문제 제출 기록 조회
  @GetMapping
  public ResponseEntity<List<SubmissionsDTO>> getSubmissionsByProblem(@RequestParam Long problemId) {
    System.out.println("problemId: " + problemId);
    List<SubmissionsDTO> submissions = submissionService.getSubmissionsByProblem(problemId);
    System.out.println("submissionssize: " + submissions.size());
    return ResponseEntity.ok(submissions);
  }

  // 사용자의 문제 해결 진행률 조회
  @GetMapping("/progress")
  public ResponseEntity<SubmissionsDTO> getUserProgress(@RequestParam Long userId) {
    SubmissionsDTO progress = submissionService.getUserProgress(userId);
    return ResponseEntity.ok(progress);
  }

  // 사용자의 특정 문제에 대한 코드 제출 기록 조회
  @GetMapping("/user/{problemId}")
  public ResponseEntity<List<SubmissionsDTO>> getUserSubmissionsByProblem(
    @PathVariable Long problemId,
    @RequestParam Long userId) {
    System.out.println("problemId: " + problemId + ", userId: " + userId);
    List<SubmissionsDTO> submissions = submissionService.getUserSubmissionsByProblem(problemId, userId);
    System.out.println("submissions size: " + submissions.size());
    return ResponseEntity.ok(submissions);
  }
}

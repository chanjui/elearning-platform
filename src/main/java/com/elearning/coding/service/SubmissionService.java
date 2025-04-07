package com.elearning.coding.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import com.elearning.coding.entity.Submissions;
import com.elearning.coding.repository.SubmissionRepository;
import com.elearning.coding.dto.SubmissionsDTO;

import com.elearning.coding.repository.ProblemRepository;

@Service
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final CodeExecutionService codeExecutionService;
    private final ProblemRepository problemRepository;

    public SubmissionService(SubmissionRepository submissionRepository, CodeExecutionService codeExecutionService, ProblemRepository problemRepository) {
        this.submissionRepository = submissionRepository;
        this.codeExecutionService = codeExecutionService;
        this.problemRepository = problemRepository;
    }

    public Submissions submitSolution(Long problemId, String language, String code, Long userId) {
        return codeExecutionService.executeCode(problemId, language, code, userId);
    }

    public List<SubmissionsDTO> getSubmissionsByProblem(Long problemId) {
        System.out.println("Searching for problemId: " + problemId);
        List<Submissions> results = submissionRepository.findByProblem_Id(problemId);
        System.out.println("Found submissions: " + results.size());
        
        return results.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<SubmissionsDTO> getUserSubmissionsByProblem(Long problemId, Long userId) {
        System.out.println("Searching for problemId: " + problemId + ", userId: " + userId);
        List<Submissions> results = submissionRepository.findByProblem_IdAndUser_Id(problemId, userId);
        System.out.println("Found submissions: " + results.size());
        
        return results.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    private SubmissionsDTO convertToDTO(Submissions submission) {
        SubmissionsDTO dto = new SubmissionsDTO();
        dto.setId(submission.getId());
        dto.setCode(submission.getCode());
        dto.setStatus(submission.getStatus());
        dto.setSubmittedAt(submission.getSubmittedAt());
        dto.setProblemId(submission.getProblem().getId().intValue());
        dto.setActualOutput(submission.getActualOutput());
        dto.setUserId(submission.getUser().getId());
        dto.setLanguage(submission.getLanguage());
        return dto;
    }

    public SubmissionsDTO getUserProgress(Long userId) {
        // 전체 문제 수 조회
        long totalProblems = problemRepository.count();
        
        // 사용자가 성공한 고유한 문제 수 조회 (중복 제외)
        long solvedProblems = submissionRepository.countDistinctProblemsByUserIdAndStatus(
            userId, Submissions.SubmissionStatus.ACCEPTED);
        
        // 진행률 계산 (소수점 2자리까지)
        double progressRate = totalProblems > 0 
            ? (double) solvedProblems / totalProblems * 100 
            : 0.0;
        progressRate = Math.round(progressRate * 100.0) / 100.0;

        SubmissionsDTO progress = new SubmissionsDTO();
        progress.setTotalProblems((int) totalProblems);
        progress.setSolvedProblems((int) solvedProblems);
        progress.setProgressRate(progressRate);
        
        return progress;
    }
}

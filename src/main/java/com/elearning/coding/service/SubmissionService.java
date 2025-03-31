package com.elearning.coding.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import com.elearning.coding.entity.Submissions;
import com.elearning.coding.repository.SubmissionRepository;
import com.elearning.coding.dto.SubmissionsDTO;

@Service
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final CodeExecutionService codeExecutionService;

    public SubmissionService(SubmissionRepository submissionRepository, CodeExecutionService codeExecutionService) {
        this.submissionRepository = submissionRepository;
        this.codeExecutionService = codeExecutionService;
    }

    public Submissions submitSolution(Long problemId, String code, Long userId) {
        return codeExecutionService.executeCode(problemId, code, userId);
    }

    public List<SubmissionsDTO> getSubmissionsByProblem(Long problemId) {
        System.out.println("Searching for problemId: " + problemId);
        List<Submissions> results = submissionRepository.findByProblem_Id(problemId);
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
        return dto;
    }
}

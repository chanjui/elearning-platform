package com.elearning.coding.dto;

import com.elearning.coding.entity.Submissions.SubmissionStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SubmissionsDTO {
    private Long id;
    private String code;
    private SubmissionStatus status;
    private LocalDateTime submittedAt;
    private Integer problemId;
    private String actualOutput;
    private Long userId;
} 
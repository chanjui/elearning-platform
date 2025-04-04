package com.elearning.coding.dto;

import com.elearning.coding.entity.Problems.Difficulty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ProblemsDTO {
    private Integer id;
    private String title;
    private String description;
    private String inputExample;
    private String outputExample;
    private Difficulty difficulty;
    private LocalDateTime createdAt;
} 
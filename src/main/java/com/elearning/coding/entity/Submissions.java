package com.elearning.coding.entity;


import com.elearning.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Getter
@Setter
public class Submissions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String code;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status;
    
    @Column(name = "submittedAt")
    private LocalDateTime submittedAt = LocalDateTime.now();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problemId", nullable = false)
    private Problems problem;
    
    @Column(columnDefinition = "TEXT")
    private String actualOutput;

  
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Language language;
    
    public enum SubmissionStatus {
        PENDING, ACCEPTED, WRONG_ANSWER, ERROR
    }

    public enum Language {
        JAVA, JAVASCRIPT, C, PYTHON
    }
} 
package com.elearning.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "problems")
@Getter
@NoArgsConstructor
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 255, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String input_example;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String output_example;

    @Enumerated(EnumType.STRING)
    @Column
    private Difficulty difficulty;

    @Column
    private LocalDateTime created_at;

    public enum Difficulty {
        EASY, MEDIUM, HARD
    }
} 
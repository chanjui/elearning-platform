package com.elearning.course.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "courseFaq")
@Getter
@Setter
public class CourseFaq {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content; // 질문

    @Column(columnDefinition = "TEXT", nullable = false)
    private String answer; // 답변

    @Column(name = "visible", columnDefinition = "TINYINT(1)", nullable = false)
    private boolean visible;

    public boolean isValidFaq() {
        return content != null && !content.trim().isEmpty()
                && answer != null && !answer.trim().isEmpty();
    }
} 
package com.elearning.course.entity;

import jakarta.persistence.*;
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

  @Column(nullable = false)
  private boolean isVisible = false;

  public boolean isValidFaq() {
    return content != null && !content.trim().isEmpty()
      && answer != null && !answer.trim().isEmpty();
  }
} 
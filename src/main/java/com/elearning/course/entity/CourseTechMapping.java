package com.elearning.course.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "courseTechMapping")
@Getter
@NoArgsConstructor
public class CourseTechMapping {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "courseId", nullable = false)
  private Course course;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "techStackId", nullable = false)
  private TechStack techStack;
}

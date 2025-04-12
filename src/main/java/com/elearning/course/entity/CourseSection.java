package com.elearning.course.entity;

import com.elearning.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courseSection")
@Getter
@Setter
public class CourseSection {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "courseId", nullable = false)
  private Course course;

  @Column(nullable = false, length = 255)
  private String subject;

  @Column(nullable = false)
  private Integer orderNum = 1;

  @Column(nullable = false, updatable = false)
  private LocalDateTime regDate = LocalDateTime.now();

  @OneToMany(mappedBy = "section", cascade = Cascade:Type.ALL, orphanRemoval = true)
  private List<LectureVideo> lectures = new ArrayList<>();

  @PrePersist
  protected void onCreate() {
    this.regDate = LocalDateTime.now();
  }
}
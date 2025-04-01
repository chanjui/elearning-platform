package com.elearning.coding.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "problems")
@Getter
@Setter
public class Problems {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false, length = 255)
  private String title;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String description;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String inputExample;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String outputExample;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Difficulty difficulty = Difficulty.EASY;

  @Column(name = "createdAt")
  private LocalDateTime createdAt = LocalDateTime.now();

  public enum Difficulty {
    EASY, MEDIUM, HARD
  }
} 
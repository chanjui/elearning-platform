package com.elearning.course.entity;

import com.elearning.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "boardLike")
@Getter
@Setter
public class BoardLike {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "userId", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "boardId", nullable = false)
  private Board board;

  @Column(name = "likedAt", nullable = false)
  private LocalDateTime likedAt = LocalDateTime.now();
}

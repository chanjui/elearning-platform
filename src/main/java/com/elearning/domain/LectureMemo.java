package com.elearning.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "lectureMemo")
@Getter
@NoArgsConstructor
public class LectureMemo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lectureVideoId", nullable = false)
    private LectureVideo lectureVideo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String memo;

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;
} 
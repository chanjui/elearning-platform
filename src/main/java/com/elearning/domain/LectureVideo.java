package com.elearning.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "lectureVideo")
@Getter
@NoArgsConstructor
public class LectureVideo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sectionId", nullable = false)
    private CourseSection section;

    @Column(length = 200, nullable = false)
    private String title;

    @Column(length = 255, nullable = false)
    private String videoUrl;

    @Column(nullable = false)
    private Integer duration;

    @Column(length = 255)
    private String previewUrl;

    @Column
    private Integer seq;

    @Column
    private boolean isFree;

    @Column
    private LocalDateTime regDate;
} 
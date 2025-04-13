package com.elearning.course.entity;

import com.elearning.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "lectureVideo")
@Getter
@Setter
public class LectureVideo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sectionId", nullable = false)
    private CourseSection section;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(nullable = false, length = 255)
    private String videoUrl;
    
    @Column(nullable = false)
    private Integer duration;
    
    @Column(length = 255)
    private String previewUrl;
    
    @Column(nullable = false)
    private Integer seq = 1;
    
    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean isFree = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime regDate = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
      this.regDate = LocalDateTime.now();
    }
} 
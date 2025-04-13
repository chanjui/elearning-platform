package com.elearning.common.entity;

import com.elearning.course.entity.LectureVideo;
import com.elearning.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "lectureProgress")
@Getter
@Setter
public class LectureProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lectureVideoId", nullable = false)
    private LectureVideo lectureVideo;
    
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal progress = BigDecimal.ZERO;
    
    @Column(nullable = false)
    private Integer currentTime;
    
    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isCompleted = false;
    
    @Column(name = "updatedAt")
    private LocalDateTime updatedAt = LocalDateTime.now();
} 
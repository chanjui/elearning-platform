package com.elearning.course.entity;

import com.elearning.common.entity.BaseEntity;
import com.elearning.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "board")
@Getter
@Setter
public class Board extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BoardType bname;
    
    @Column(nullable = false, length = 255)
    private String subject;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(length = 255)
    private String fileData;
    
    private LocalDateTime editDate;
    
    public enum BoardType {
        수강평, 질문및답변, 수강전질문
    }
} 
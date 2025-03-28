package com.elearning.instructor.entity;

import com.elearning.common.entity.BaseEntity;
import com.elearning.common.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "instructor")
@Getter
@Setter
public class Instructor extends BaseEntity {
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;
    
    @Column(length = 100)
    private String githubLink;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
} 
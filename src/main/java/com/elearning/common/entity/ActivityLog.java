package com.elearning.common.entity;

import com.elearning.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "activityLog")
@Getter
@Setter
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;
    
    @Column(nullable = false, length = 100)
    private String activityType;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 45)
    private String ipAddress;
    
    @Column(name = "createdAt")
    private LocalDateTime createdAt = LocalDateTime.now();
} 
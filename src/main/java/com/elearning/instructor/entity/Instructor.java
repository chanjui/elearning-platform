package com.elearning.instructor.entity;

import com.elearning.common.entity.BaseEntity;
import com.elearning.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "instructor")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Instructor extends BaseEntity {
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;
    
    @Column(length = 100)
    private String githubLink;
    
    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "desiredField")
    private String desiredField;

    @Column(name = "referralSource")
    private String referralSource;
} 
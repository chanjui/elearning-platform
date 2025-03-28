package com.elearning.common.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user")
@Getter
@Setter
public class User extends BaseEntity {
    
    @Column(nullable = false, length = 20)
    private String nickname;
    
    @Column(nullable = false, length = 255)
    private String password;
    
    @Column(nullable = false, length = 50)
    private String email;
    
    @Column(length = 20)
    private String phone;
    
    @Column(length = 512)
    private String refreshToken;
    
    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean isInstructor = false;
} 
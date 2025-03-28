package com.elearning.admin.entity;

import com.elearning.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "admin")
@Getter
@Setter
public class Admin extends BaseEntity {
    
    @Column(nullable = false, length = 20)
    private String nickname;
    
    @Column(nullable = false, length = 255)
    private String password;
    
    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 1")
    private Integer role = 1;
} 
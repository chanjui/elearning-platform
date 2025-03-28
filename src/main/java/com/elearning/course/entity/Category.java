package com.elearning.course.entity;

import com.elearning.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "category")
@Getter
@Setter
public class Category extends BaseEntity {
    
    @Column(nullable = false, length = 100)
    private String name;
} 
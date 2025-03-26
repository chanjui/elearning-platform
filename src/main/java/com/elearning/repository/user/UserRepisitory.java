package com.elearning.repository.user;

import org.springframework.stereotype.Repository;

import com.elearning.domain.User;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface UserRepisitory  extends JpaRepository<User, Long>{
    //사용자조회
    User findByEmail(String email);
    
}

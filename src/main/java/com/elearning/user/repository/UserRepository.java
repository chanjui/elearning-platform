package com.elearning.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.elearning.user.entity.User;

import java.util.Optional;

@Repository
public interface UserRepository  extends JpaRepository<User, Long> {
  // 회원가입 없어도 성공
  //로그인
  Optional<User> findByEmail(String email);
  Optional<User> findByRefreshToken(String refreshToken);

  // refreshToken을 Update하는 기능
  @Modifying
  @Transactional  // 업데이트가 안될 때 알아서 rollback 해줌
  @Query("UPDATE User user SET user.refreshToken = :refreshToken WHERE user.id = :id")
  void updateRefreshToken(@Param("id") Long id, @Param("refreshToken") String refreshToken);
}
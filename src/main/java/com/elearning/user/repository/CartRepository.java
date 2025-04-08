package com.elearning.user.repository;

import com.elearning.user.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
  // 장바구니 페이지 사용자 ID로 장바구니 전체 항목 조회
  List<Cart> findByUserIdAndIsDel(Long userId, boolean isDel);

  // 장바구니 페이지 사용자 ID + 강의 ID로 중복 여부 체크
  boolean existsByUserIdAndCourseIdAndIsDel(Long userId, Long courseId, boolean isDel);

  // 장바구니 페이지 사용자 ID + 강의 ID로 특정 항목 삭제
  Cart findByUserIdAndCourseIdAndIsDel(Long userId, Long courseId, boolean isDel);

  // 장바구니 페이지 장바구니 비우기
  void deleteByUserId(Long userId);
}

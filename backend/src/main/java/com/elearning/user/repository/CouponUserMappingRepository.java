package com.elearning.user.repository;

import com.elearning.user.entity.CouponUserMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CouponUserMappingRepository extends JpaRepository<CouponUserMapping, Long> {
  // 사용자가 가지고 있는 모든 쿠폰 매핑 찾기
  @Query("SELECT cum FROM CouponUserMapping cum WHERE cum.user.id = :userId")
  List<CouponUserMapping> findAllByUserId(@Param("userId") Long userId);

  // 사용자가 가지고 있는 특정 강의에 적용 가능한 쿠폰 매핑 찾기
  @Query("SELECT cum FROM CouponUserMapping cum " +
    "JOIN cum.coupon c " +
    "WHERE cum.user.id = :userId " +
    "AND (c.course.id = :courseId OR c.course IS NULL)")
  List<CouponUserMapping> findValidCouponsForUserAndCourse(
    @Param("userId") Long userId,
    @Param("courseId") Long courseId);
}

package com.elearning.user.service.Cart;

import com.elearning.course.entity.Course;
import com.elearning.course.repository.CourseRepository;
import com.elearning.user.dto.Cart.CartDTO;
import com.elearning.user.dto.Cart.CartItemDTO;
import com.elearning.user.entity.Cart;
import com.elearning.user.entity.User;
import com.elearning.user.repository.CartRepository;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {
  private final CartRepository cartRepository;
  private final CourseRepository courseRepository;
  private final UserRepository userRepository;

  /**
   * 장바구니에 담긴 강의 목록을 조회하여 CartDTO로 반환합니다.
   * - 강의 정보들을 CartItemDTO로 변환
   * - 총 금액, 할인 금액 계산 포함
   */
  public CartDTO getCartData(Long userId) {
    // 1. 사용자 장바구니에서 모든 Cart 엔티티 조회
    List<Cart> cartList = cartRepository.findByUserIdAndIsDel(userId, false);

    // 2. 각 Cart 엔티티에서 Course 정보를 꺼내서 CartItemDTO로 변환
    List<CartItemDTO> items = cartList.stream().map(cart -> {
      Course course = cart.getCourse();


      // 할인율과 할인된 가격 계산
      BigDecimal discountRate = BigDecimal.valueOf(course.getDiscountRate().doubleValue());  // 할인율 가져오기
      BigDecimal originalPrice = BigDecimal.valueOf(course.getPrice());        // 원가
      BigDecimal discountedPrice = originalPrice.multiply(BigDecimal.ONE.subtract(discountRate.divide(BigDecimal.valueOf(100)))); // 할인된 가격 계산
      BigDecimal discountAmount = originalPrice.subtract(discountedPrice);  // 할인 금액

      return CartItemDTO.builder()
        .courseId(course.getId())
        .title(course.getSubject())
        .instructor(course.getInstructor().getUser().getNickname())
        .price(originalPrice.intValue())  // 원가
        .discountRate(discountRate.doubleValue())  // 할인율
        .discountedPrice(discountedPrice.doubleValue())  // 할인된 가격
        .image(course.getThumbnailUrl())
        .discountAmount(discountAmount.doubleValue())  // 할인 금액
        .build();
    }).collect(Collectors.toList());

    // 3. 가격 계산
    BigDecimal subtotal = items.stream()
      .map(item -> BigDecimal.valueOf(item.getDiscountedPrice()))  // 할인된 가격 합계
      .reduce(BigDecimal.ZERO, BigDecimal::add);
    BigDecimal discount = items.stream()
      .map(item -> BigDecimal.valueOf(item.getDiscountAmount()))  // 총 할인 금액
      .reduce(BigDecimal.ZERO, BigDecimal::add);
    BigDecimal total = subtotal;  // 최종 결제 금액은 할인된 가격의 합

    // 4. 최종 장바구니 DTO 구성 후 반환
    return CartDTO.builder()
      .items(items)
      .subtotal(subtotal.intValue())  // 합계 금액
      .discount(discount.intValue())  // 할인 금액
      .total(total.intValue())  // 총 결제 금액
      .build();
  }

  // 장바구니 강의 추가
  public boolean addToCart(Long userId, Long courseId) {
    boolean exists = cartRepository.existsByUserIdAndCourseIdAndIsDel(userId, courseId, false);
    if (!exists) {
      User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));
      Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new IllegalArgumentException("해당 강의가 존재하지 않습니다."));

      Cart cart = new Cart();
      cart.setUser(user);
      cart.setCourse(course);
      cartRepository.save(cart);
      return true;
    }
    return false;
  }

  // 장바구니 특정 강의 삭제
  public boolean removeFromCart(Long userId, Long courseId) {
    // 삭제되지 않은 장바구니 항목 조회
    Cart cart = cartRepository.findByUserIdAndCourseIdAndIsDel(userId, courseId, false);

    if (cart != null) {
      cart.setDel(true); // 삭제 처리 (soft delete)
      cartRepository.save(cart); // DB에 반영
      return true;
    }

    return false;
  }

  /**
   * 장바구니 비우기 (결제 완료 시 사용)
   */
  public void clearCart(Long userId) {
    cartRepository.deleteByUserId(userId);
  }
}

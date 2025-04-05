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

      return CartItemDTO.builder()
        .courseId(course.getId())
        .title(course.getSubject())
        .instructor(course.getInstructor().getUser().getNickname())
        .price(course.getPrice())
        .image(course.getThumbnailUrl())
        .build();
    }).collect(Collectors.toList());

    // 3. 가격 계산
    int subtotal = items.stream().mapToInt(CartItemDTO::getPrice).sum();
    int discount = (int) (subtotal * 0.1); // 임시로 10% 할인 적용
    int total = subtotal - discount;

    // 4. 최종 장바구니 DTO 구성 후 반환
    return CartDTO.builder()
      .items(items)
      .subtotal(subtotal)
      .discount(discount)
      .total(total)
      .build();
  }

  /**
   * 장바구니에 강의를 추가합니다.
   * - 중복 체크 후 없을 경우에만 추가
   */
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

  /**
   * 장바구니에서 특정 강의를 삭제합니다.
   */
  /**
   * 장바구니에서 특정 강의를 삭제합니다.
   * - 실제 삭제하지 않고 isDel = 1로 soft delete 처리
   */
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

package com.elearning.user.controller;

import com.elearning.common.ResultData;
import com.elearning.user.dto.Cart.CartDTO;
import com.elearning.user.entity.User;
import com.elearning.user.service.Cart.CartService;
import com.elearning.user.service.login.RequestService;
import com.elearning.user.service.login.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
  private final CartService cartService;
  private final RequestService requestService;

  /**
   * 장바구니 조회 API
   */
  @GetMapping
  public ResultData<CartDTO> getCart(HttpServletRequest request) {
    Long userId = requestService.getUser().getId();
    CartDTO cart = cartService.getCartData(userId);
    return ResultData.of(1, "장바구니 조회 성공", cart);
  }

  /**
   * 장바구니 추가 API
   */
  @PostMapping("/add")
  public ResultData<Boolean> addToCart(@RequestBody Map<String, Long> body) {
    Long userId = requestService.getUser().getId();
    Long courseId = body.get("courseId");
    boolean added = cartService.addToCart(userId, courseId);
    return ResultData.of(1, "장바구니 추가 완료", added);
  }

  /**
   * 장바구니 삭제 API
   */
  @DeleteMapping("/remove")
  public ResultData<Boolean> removeFromCart(@RequestBody Map<String, Long> body) {
    Long userId = requestService.getUser().getId();
    Long courseId = body.get("courseId");
    boolean removed = cartService.removeFromCart(userId, courseId);
    return ResultData.of(1, "장바구니 삭제 완료", removed);
  }
}

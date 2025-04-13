package com.elearning.user.dto.Cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
  private Long courseId;           // 강의 ID
  private String title;            // 강의 제목
  private String instructor;       // 강사 이름
  private int price;               // 가격
  private double discountRate;     // 할인율 (%)
  private double discountedPrice;  // 할인된 가격
  private String image;            // 썸네일 URL
  private double discountAmount;   // 할인 금액
}

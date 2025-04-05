package com.elearning.user.dto.Cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
  private Long courseId;           // 강의 ID
  private String title;            // 강의 제목
  private String instructor;       // 강사 이름
  private int price;               // 가격
  private String image;            // 썸네일 URL
}

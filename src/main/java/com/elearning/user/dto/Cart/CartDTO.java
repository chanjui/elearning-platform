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
public class CartDTO {
  private List<CartItemDTO> items;
  private int subtotal;
  private int discount;
  private int total;
}

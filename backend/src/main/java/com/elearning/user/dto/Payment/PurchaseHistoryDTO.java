package com.elearning.user.dto.Payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseHistoryDTO {
  private String orderId;        // 주문 ID
  private String courseId;       // 강의 ID
  private String courseTitle;    // 강의 제목
  private String instructorName; // 강사명
  private String paymentMethod;  // 결제수단
  private int originalPrice;     // 원래 가격
  private int discountPrice;     // 할인된 가격
  private String paymentStatus;  // 결제 상태
  private String paymentDate;    // 결제 날짜
  private String imageUrl;       // 강의 이미지 URL
  private String impUid;
}

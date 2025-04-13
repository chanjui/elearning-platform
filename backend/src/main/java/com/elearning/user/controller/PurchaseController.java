package com.elearning.user.controller;

import com.elearning.user.dto.Payment.PurchaseHistoryDTO;
import com.elearning.user.service.Payment.PurchaseHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PurchaseController {
  // 구매 내역 조회 기능
  private final PurchaseHistoryService purchaseHistoryService;

  // 구매 내역을 조회하는 API
  @GetMapping("/api/purchases")
  public List<PurchaseHistoryDTO> getPurchaseHistory(@RequestParam Long userId) {
    return purchaseHistoryService.getPurchaseHistory(userId);
  }
}

package com.elearning.user.service.Payment;

import com.elearning.common.entity.PaymentHistory;
import com.elearning.user.repository.PaymentHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentHistoryService {

  private final PaymentHistoryRepository paymentHistoryRepository;
  // paymentHistory를 저장하는 메서드
  public void savePaymentHistory(PaymentHistory paymentHistory) {
    paymentHistoryRepository.save(paymentHistory);
  }
}

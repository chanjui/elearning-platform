import { NextRequest, NextResponse } from 'next/server';

// 결제 데이터 인터페이스
interface PaymentData {
  impUid: string;
  merchantUid: string;
  expectedAmount: number;
  courseIds: number[];
  couponMappingId?: number;
}

// 백엔드 API URL (환경 변수로 관리하는 것이 좋음)
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 요청 본문 파싱
    const paymentData: PaymentData = await request.json();

    // 필수 필드 검증
    if (!paymentData.impUid || !paymentData.merchantUid || !paymentData.expectedAmount || !paymentData.courseIds) {
      return NextResponse.json(
        { success: false, message: '필수 결제 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 백엔드 API 호출
    const response = await fetch(`${BACKEND_API_URL}/api/payment/verify`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    // 백엔드 응답 처리
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.message || '결제 검증 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    // 백엔드에서 받은 결제 검증 결과 반환
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('결제 검증 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';

// 쿠폰 인터페이스 정의 (백엔드 DTO와 일치하도록)
interface Coupon {
  id: number;
  couponId: number;
  code: string;
  discount: number;
  courseId: number | null;
  courseName: string;
  regDate: string;
  isDel: boolean;
}

// 백엔드 API URL (환경 변수로 관리하는 것이 좋음)
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080';

export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // URL에서 courseId 파라미터 추출
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { message: '강의 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    console.log(`백엔드 API 호출: ${BACKEND_API_URL}/api/payment/available-coupons?courseId=${courseId}`);
    console.log(`인증 헤더: ${authHeader.substring(0, 20)}...`);

    // 토큰 추출 (Bearer 접두사 제거)
    const token = authHeader.substring(7);
    console.log(`추출된 토큰: ${token.substring(0, 20)}...`);

    // 백엔드 API 호출
    const response = await fetch(`${BACKEND_API_URL}/api/payment/available-coupons?courseId=${courseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // 토큰 형식 수정
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      }
    });

    console.log(`백엔드 응답 상태: ${response.status}`);

    // 백엔드 응답 처리
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '알 수 없는 오류가 발생했습니다.' }));
      console.error('백엔드 오류 응답:', errorData);
      return NextResponse.json(
        { message: errorData.message || '쿠폰 조회 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    // 백엔드에서 받은 쿠폰 데이터 반환
    const coupons = await response.json();
    console.log(`조회된 쿠폰 수: ${Array.isArray(coupons) ? coupons.length : '응답이 배열이 아님'}`);
    
    return NextResponse.json(coupons, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('쿠폰 조회 중 오류 발생:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import userStore from "@/app/auth/userStore";

export default function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = userStore();
  
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      // 인증 코드가 없으면 로그인 페이지로 이동
      router.push("/auth/user/login");
      return;
    }
    
    // 백엔드 소셜 로그인 API 호출 (토큰 교환 및 사용자 정보 처리)
    axios
      .get(`/api/auth/kakao-callback?code=${code}`, { withCredentials: true })
      .then((response) => {
        const data = response.data;
        console.log("카카오 로그인 응답:", data.data);
        if (data.totalCount === 1) {
          // 사용자 정보를 zustand 스토어에 저장하고 메인 페이지로 이동
          setUser(data.data);
          router.push("/");
        } else {
          console.error("로그인 실패:", data);
          router.push("/auth/user/login");
        }
      })
      .catch((error) => {
        console.error("소셜 로그인 처리 오류:", error);
        router.push("/auth/user/login");
      });
  }, [router, searchParams, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <p>로그인 처리 중입니다. 잠시 기다려 주세요...</p>
    </div>
  );
}
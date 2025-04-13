"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import userStore from "@/app/auth/userStore";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = userStore();
  
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      router.push("/auth/user/login");
      return;
    }
    
    axios
      .get(`/api/auth/google-callback?code=${code}`, { withCredentials: true })
      .then((response) => {
        const data = response.data;
        console.log("구글 로그인 응답:", data);
        if (data.totalCount === 1) {
          setUser(data.data);
          router.push("/");
        } else {
          console.error("로그인 실패:", data.message);
          router.push("/auth/user/login");
        }
      })
      .catch((error) => {
        console.error("구글 소셜 로그인 처리 오류:", error);
        router.push("/auth/user/login");
      });
  }, [router, searchParams, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <p>구글 로그인 처리 중입니다. 잠시 기다려 주세요...</p>
    </div>
  );
}
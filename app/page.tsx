"use client"

import { redirect } from "next/navigation"

export default function Home() {
  // 루트 경로로 접근하면 사용자 홈페이지로 리다이렉트
  redirect("/user")
}


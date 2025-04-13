"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import NetflixHeader from "@/components/netflix-header"
import { useRouter } from "next/navigation"
import axios from "axios"
import userStore from "@/app/auth/userStore"


function getStorage(){
  try {
    if(window.localStorage)
      return window.localStorage;
  }catch (e) {
    return undefined;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = userStore();
  const API_URL = "/api/user/login";
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let localStorage = getStorage();
  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, { email, password }, { withCredentials: true});
      const data = response.data;
      console.log(data);
      if (data.totalCount === 1) {
        setUser(data.data); // zustand + localStorage 저장
        alert("로그인 성공!");
        router.push("/");
      } else {
        alert("로그인 실패: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("로그인 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <div className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Image
                src="/placeholder.svg?height=40&width=120"
                alt="인프런 로고"
                width={120}
                height={40}
                className="h-10 mx-auto"
              />
            </Link>
            <h2 className="mt-6 text-3xl font-bold">로그인</h2>
            <p className="mt-2 text-sm text-gray-400">인프런에서 가치를 높이세요</p>
          </div>

          <div className="bg-gray-900 py-8 px-6 shadow-lg rounded-lg border border-gray-800">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  이메일
                </Label>
                <div className="mt-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="example@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  비밀번호
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 pr-10 bg-gray-800 border-gray-700 text-white"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox id="remember-me" className="border-gray-600" />
                  <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    로그인 상태 유지
                  </Label>
                </div>

                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-medium text-red-500 hover:text-red-400">
                    비밀번호를 잊으셨나요?
                  </Link>
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  로그인
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">또는</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                 onClick={() => (window.location.href = "/api/auth/google")}>
                  <Image
                    src="/login/google.svg?height=20&width=20"
                    alt="Google"
                    width={20}
                    height={20}
                    className="mr-2 h-5 w-5"
                  />
                  Google
                </Button>
                <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                 onClick={() => {
                   window.location.href = "/api/auth/kakao";
                 }}>
                  <Image
                    src="/login/kakao.svg?height=20&width=20"
                    alt="Kakao"
                    width={20}
                    height={20}
                    className="mr-2 h-5 w-5"
                  />
                  Kakao
                </Button>
                <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => (window.location.href = "/api/auth/github")}>
                  <Image
                    src="/login/github.svg?height=20&width=20"
                    alt="GitHub"
                    width={20}
                    height={20}
                    className="mr-2 h-5 w-5"
                  />
                  GitHub
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              아직 인프런 회원이 아니신가요?{" "}
              <Link href="/auth/user/signup" className="font-medium text-red-500 hover:text-red-400">
                회원가입
              </Link>
            </p>
            <p className="text-sm text-gray-400 mt-2">
              강사로 활동하고 싶으신가요?{" "}
              <Link href="/instructor/apply" className="font-medium text-red-500 hover:text-red-400">
                강사 신청하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

export default function InstructorLoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-block">
            <Image
              src="/placeholder.svg?height=40&width=120"
              alt="인프런 로고"
              width={120}
              height={40}
              className="h-8"
            />
          </Link>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="mt-6 text-3xl font-bold">강사 로그인</h2>
            <p className="mt-2 text-sm text-gray-600">인프런에서 지식을 나누세요</p>
          </div>

          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            <form className="space-y-6">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  이메일
                </Label>
                <div className="mt-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="instructor@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                  <Checkbox id="remember-me" />
                  <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    로그인 상태 유지
                  </Label>
                </div>

                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                    비밀번호를 잊으셨나요?
                  </Link>
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                  로그인
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">또는</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <Image
                    src="/placeholder.svg?height=20&width=20"
                    alt="Google"
                    width={20}
                    height={20}
                    className="mr-2 h-5 w-5"
                  />
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <Image
                    src="/placeholder.svg?height=20&width=20"
                    alt="Kakao"
                    width={20}
                    height={20}
                    className="mr-2 h-5 w-5"
                  />
                  Kakao
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              강사 등록을 원하시나요?{" "}
              <Link href="/instructor/apply" className="font-medium text-green-600 hover:text-green-500">
                강사 신청하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


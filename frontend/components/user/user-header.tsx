"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Bell, ChevronDown, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import axios from "axios"
import userStore from "@/app/auth/userStore"

export default function UserHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const { user, clearUser } = userStore()
  const router = useRouter()

  // 알림 데이터
  const notifications = [
    { id: 1, date: "2023/10/27", content: "새로운 강의가 추가되었습니다: Docker 입문" },
    { id: 2, date: "2023/10/25", content: "질문에 답변이 달렸습니다" },
    { id: 3, date: "2023/10/20", content: "강의 할인 쿠폰이 발급되었습니다" },
  ]

  // 알림창 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 현재 활성화된 경로를 확인하는 함수
  const isActive = (path: string) => {
    if (typeof window !== "undefined") {
      return window.location.pathname.startsWith(path)
    }
    return false
  }

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await axios.post("/api/user/logout", {}, { withCredentials: true });
      clearUser();
      router.push("/auth/user/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? "bg-black" : "bg-gradient-to-b from-black/80 to-transparent"}`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/user" className="text-primary font-bold text-2xl">
              <Image
                src="/placeholder.svg?height=40&width=120"
                alt="인프런 로고"
                width={120}
                height={40}
                className="h-8"
              />
            </Link>

            <nav className="hidden md:flex space-x-6">
              <Link
                href="/user/courses"
                className={`text-white hover:text-gray-300 ${isActive("/user/courses") ? "font-bold text-red-500" : ""}`}
              >
                강의
              </Link>
              <Link
                href="/user/coding-test"
                className={`text-white hover:text-gray-300 ${isActive("/user/coding-test") ? "font-bold text-red-500" : ""}`}
              >
                코딩테스트
              </Link>
              <Link
                href="/user/community"
                className={`text-white hover:text-gray-300 ${isActive("/user/community") ? "font-bold text-red-500" : ""}`}
              >
                커뮤니티
              </Link>
              <Link
                href="/user/dashboard"
                className={`text-white hover:text-gray-300 ${isActive("/user/dashboard") ? "font-bold text-red-500" : ""}`}
              >
                내 학습
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              {showSearch ? (
                <div className="flex items-center bg-black/80 border border-gray-600 rounded-md overflow-hidden">
                  <Input
                    type="text"
                    placeholder="강의 검색"
                    className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white"
                    autoFocus
                    onBlur={() => setShowSearch(false)}
                  />
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                </div>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)} className="text-white">
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* 알림 아이콘 및 드롭다운 */}
            <div className="relative" ref={notificationRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-white relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              </Button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-black border border-gray-800 rounded-md shadow-lg z-50">
                  <div className="p-4 border-b border-gray-800">
                    <h3 className="font-medium text-white">알림</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-gray-800 hover:bg-gray-900 text-white">
                        <p className="text-sm">{notification.content}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.date}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 flex justify-center border-t border-gray-800">
                    <button className="text-gray-400 hover:text-white text-sm w-full py-2">모든 알림 보기</button>
                  </div>
                </div>
              )}
            </div>

            {/* 장바구니 아이콘 */}
            <Link href="/user/cart">
              <Button variant="ghost" size="icon" className="text-white relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
              </Button>
            </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 rounded-md bg-red-600 flex items-center justify-center">
                      <span className="font-bold">U</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black/90 border-gray-700 text-white">
                  {user ? (
                    <>
                      <DropdownMenuItem className="hover:bg-gray-800">
                        <Link href="/user/dashboard/settings" className="w-full">
                          마이페이지
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-gray-800">
                        <Link href="/user/dashboard/purchases" className="w-full">
                          구매 내역
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem className="hover:bg-gray-800" onClick={handleLogout}>
                        로그아웃
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem className="hover:bg-gray-800">
                        <Link href="/auth/user/login" className="w-full">
                          로그인
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-gray-800">
                        <Link href="/auth/user/signup" className="w-full">
                          회원가입
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {/* {user ? (
                    <>
                    <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="hover:bg-gray-800">
                      <Link href="/user/dashboard/settings" className="w-full">
                        마이페이지
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-800">
                      <Link href="/user/dashboard/purchases" className="w-full">
                        구매 내역
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="hover:bg-gray-800">
                      <Link href="/auth/user/login" className="w-full">
                        로그인
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-800">
                      <Link href="/auth/user/signup" className="w-full">
                        회원가입
                      </Link>
                    </DropdownMenuItem>
                    </>
                  )} */}
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}


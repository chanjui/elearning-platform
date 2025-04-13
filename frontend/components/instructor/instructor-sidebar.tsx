"use client"

import Link from "next/link"
import {
  ChevronRight,
  Home,
  BookOpen,
  Users,
  DollarSign,
  Star,
  PlusCircle,
  MessageSquare,
  HelpCircle,
  ExternalLink,
} from "lucide-react"
import useUserStore from "@/app/auth/userStore"
import { useEffect } from "react"

export default function InstructorSidebar() {

  const { user, restoreFromStorage } = useUserStore()

  // 컴포넌트 마운트 시 localStorage에서 user 복원
  useEffect(() => {
    if (!user) {
      restoreFromStorage();
    }
  }, [user, restoreFromStorage]);

  // user 값이 없으면 로딩 표시하여 undefined 방지
  if (!user) {
    return <div className="text-white text-center py-10">로딩 중...</div>;
  }

  const instructorId = user?.instructorId

  return (
    <div className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 fixed top-16 pt-6 pb-20 overflow-y-auto">
      <div className="px-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">강의 관리 바로 이동</h3>
            <ChevronRight className="h-4 w-4 text-gray-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
            <div className="flex items-center">
              <ExternalLink className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm">지식공유자 홈</span>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        <nav className="space-y-1">
          <div className="text-sm font-medium text-gray-400 py-2">메뉴</div>

          <Link href="/instructor" className="flex items-center px-3 py-2 text-sm rounded-md bg-red-600 text-white">
            <Home className="h-4 w-4 mr-3" />
            대시보드
          </Link>

          <Link
            href="/instructor/courses/create"
            className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800"
          >
            <PlusCircle className="h-4 w-4 mr-3" />새 강의 만들기
          </Link>

          <Link
            href="/instructor/courses/manage"
            className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800"
          >
            <BookOpen className="h-4 w-4 mr-3" />
            강의 관리
          </Link>

          <Link
            href="/instructor/questions"
            className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800"
          >
            <MessageSquare className="h-4 w-4 mr-3" />
            강의 질문 관리
          </Link>

          <Link
            href="/instructor/reviews"
            className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800"
          >
            <Star className="h-4 w-4 mr-3" />
            수강평 리스트
          </Link>

          <Link
            href="/instructor/sales"
            className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800"
          >
            <DollarSign className="h-4 w-4 mr-3" />
            수익 확인
          </Link>

          <Link
            href="/instructor/inquiries"
            className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800"
          >
            <Users className="h-4 w-4 mr-3" />
            수강전 문의관리
          </Link>

          <Link
            href="/instructor/guide"
            className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800"
          >
            <HelpCircle className="h-4 w-4 mr-3" />
            지식공유자 가이드
          </Link>
        </nav>
      </div>
    </div>
  )
}


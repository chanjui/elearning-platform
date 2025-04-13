'use client'

import { ChevronRight, Home } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter, useParams } from "next/navigation"

interface StatsCardsProps {
  data: {
    totalCourseCount: number
    averageRating: number
    recentAverageRating: number
    totalStudents: number
    recentStudents: number
    totalRevenue: number
  }
}

export default function StatsCards({ data }: StatsCardsProps) {

  const router = useRouter()
  const { instructorId } = useParams()

  return (
    <>
      {/* 상단 카드 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card
          onClick={() => router.push(`/instructor/${instructorId}/home`)}
          className="bg-gray-900 border-gray-800 text-white cursor-pointer hover:border-red-500 transition"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Home</CardTitle>
            <Home className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="flex items-center justify-center py-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Home className="h-6 w-6 text-red-500" />
              </div>
              <div className="text-sm text-gray-400">강사 홈</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">총 강의 수</CardTitle>
            <div className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{data.totalCourseCount}개</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">평점</CardTitle>
            <div className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{data.averageRating.toFixed(2)}점</div>
              <div className="text-xs text-gray-400">최근 30일 평점 {data.recentAverageRating.toFixed(2)}점</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 중간 카드 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">총 수강생 수</CardTitle>
            <div className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{data.totalStudents.toLocaleString()}명</div>
              <div className="text-xs text-gray-400">최근 1개월 내 가입 {data.recentStudents.toLocaleString()}명</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">강의 총 수익</CardTitle>
            <div className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{data.totalRevenue.toLocaleString()}원</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}


"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import InstructorHeader from "@/components/instructor/instructor-header"
import InstructorSidebar from "@/components/instructor/instructor-sidebar"

export default function CourseDiscountPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const courseId = params.id

  // 예시 데이터
  const [course, setCourse] = useState({
    id: courseId,
    title: "비전공자도 이해할 수 있는 Docker 입문/실전",
    originalPrice: 70000,
    discountPrice: 60000,
    discountStartDate: "2023-05-09",
    discountEndDate: "2023-05-18",
  })

  // 할인 가격 계산
  const calculateFinalPrice = (original: number, discount: number) => {
    return original - discount
  }

  // 할인율 계산
  const calculateDiscountRate = (original: number, discount: number) => {
    return Math.round((discount / original) * 100)
  }

  // 폼 데이터 업데이트
  const updateCourse = (field: string, value: any) => {
    setCourse((prev) => ({ ...prev, [field]: value }))
  }

  // 할인 설정 저장
  const saveDiscount = () => {
    console.log("할인 설정 저장:", course)
    // API 호출 로직 추가
    router.push("/instructor/courses/manage")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <InstructorHeader />

      <div className="flex">
        <InstructorSidebar />

        {/* 메인 콘텐츠 */}
        <main className="ml-64 flex-1 px-6 py-8 pt-24">
          <div className="mb-6">
            <Link href="/instructor/courses/manage" className="inline-flex items-center text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-1" />
              강의 관리로 돌아가기
            </Link>
          </div>

          <div className="bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-800 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-white">강의 할인</h1>

            <div className="mb-8">
              <h2 className="text-xl font-medium mb-4 text-white">할인 가격으로 배우는 포토샵</h2>

              <Alert className="bg-gray-800 border-gray-700 mb-4">
                <AlertDescription className="text-gray-300">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>할인 설정은 시작하기 전에는 언제든지 수정할 수 있습니다.</li>
                    <li>할인 기간은 14일까지만 가능합니다.</li>
                    <li>할인 가격은 원래 가격의 10% 이상이어야 합니다.</li>
                    <li>할인을 취소한 경우 7일 이내에 다시 할인을 설정할 수 없습니다.</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">강의 가격(할인 미적용)</label>
                  <div className="text-lg font-bold text-white">{course.originalPrice.toLocaleString()}원</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">할인 적용할 가격 (할인가)</label>
                  <Input
                    type="number"
                    value={course.discountPrice}
                    onChange={(e) => updateCourse("discountPrice", Number(e.target.value))}
                    className="border-gray-700 bg-gray-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">판매가(할인 후)</label>
                  <div className="text-lg font-bold text-white">
                    {calculateFinalPrice(
                      course.originalPrice,
                      course.originalPrice - course.discountPrice,
                    ).toLocaleString()}
                    원
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">할인가(할인 후)</label>
                  <div className="text-lg font-bold text-white">{course.discountPrice.toLocaleString()}원</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">할인 시작 시간</label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={course.discountStartDate}
                        onChange={(e) => updateCourse("discountStartDate", e.target.value)}
                        className="border-gray-700 bg-gray-800 text-white pr-10"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">할인 종료 시간</label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={course.discountEndDate}
                        onChange={(e) => updateCourse("discountEndDate", e.target.value)}
                        className="border-gray-700 bg-gray-800 text-white pr-10"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => router.push("/instructor/courses/manage")}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                취소
              </Button>
              <Button onClick={saveDiscount} className="bg-red-600 hover:bg-red-700 text-white">
                저장
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


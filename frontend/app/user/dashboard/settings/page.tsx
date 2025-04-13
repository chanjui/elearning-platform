"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Star, ChevronRight, Edit2, Bell, Shield, User, BookOpen, Clock, Award } from "lucide-react"
import UserHeader from "@/components/user/user-header"

export default function MyPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="min-h-screen bg-black text-white">
      <UserHeader />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 사이드바 */}
          <div className="w-full md:w-64 space-y-4">
            <div className="flex flex-col items-center p-6 bg-gray-900 rounded-lg border border-gray-800">
              <div className="relative mb-4">
                <Image
                  src="/placeholder.svg?height=120&width=120"
                  alt="프로필 이미지"
                  width={120}
                  height={120}
                  className="rounded-full bg-gray-800"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-xl font-bold mb-1">홍길동</h2>
              <p className="text-sm text-gray-400 mb-4">inflearn.com/users/@user123</p>

              <div className="grid grid-cols-2 w-full gap-2 text-center">
                <div className="p-2 bg-gray-800 rounded-md">
                  <p className="text-xs text-gray-400">수강한 강좌</p>
                  <p className="font-bold">3</p>
                </div>
                <div className="p-2 bg-gray-800 rounded-md">
                  <p className="text-xs text-gray-400">작성한 리뷰</p>
                  <p className="font-bold">1</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-800">
              <div className="p-4 font-medium">메뉴</div>
              <Separator className="bg-gray-800" />
              <nav className="p-2">
                <ul className="space-y-1">
                  <li>
                    <Link href="/user/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-800">
                      <BookOpen className="h-4 w-4 mr-3 text-gray-400" />
                      <span>대시보드</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/user/dashboard/settings"
                      className="flex items-center p-2 rounded-md bg-gray-800 text-red-500"
                    >
                      <User className="h-4 w-4 mr-3 text-red-500" />
                      <span>계정 정보</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/user/dashboard/purchases"
                      className="flex items-center p-2 rounded-md hover:bg-gray-800"
                    >
                      <Award className="h-4 w-4 mr-3 text-gray-400" />
                      <span>구매 내역</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/user/my-learning" className="flex items-center p-2 rounded-md hover:bg-gray-800">
                      <Clock className="h-4 w-4 mr-3 text-gray-400" />
                      <span>내 학습</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            <Tabs defaultValue="account">
              <TabsList className="bg-gray-900 border-b border-gray-800 w-full justify-start rounded-none h-auto p-0">
                <TabsTrigger
                  value="account"
                  className="px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-red-500"
                >
                  계정 정보
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-red-500"
                >
                  알림 설정
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="pt-6 space-y-6">
                <Card className="bg-gray-900 border-gray-800 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg">내 프로필</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-sm text-gray-400">이미지</div>
                      <div className="col-span-1">
                        <Image
                          src="/placeholder.svg?height=80&width=80"
                          alt="프로필 이미지"
                          width={80}
                          height={80}
                          className="rounded-full bg-gray-800"
                        />
                      </div>
                      <div className="text-right">
                        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                          수정
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-sm text-gray-400">닉네임</div>
                      <div className="col-span-1">홍길동</div>
                      <div className="text-right">
                        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                          수정
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-sm text-gray-400">프로필 주소</div>
                      <div className="col-span-1 text-sm">inflearn.com/users/@user123</div>
                      <div className="text-right">
                        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                          수정
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-sm text-gray-400">자기소개</div>
                      <div className="col-span-1 text-sm">안녕하세요! 개발을 배우고 있습니다.</div>
                      <div className="text-right">
                        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                          수정
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg">기본 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-sm text-gray-400">이메일</div>
                      <div className="col-span-1">user123@example.com</div>
                      <div className="text-right">
                        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                          수정
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-sm text-gray-400">비밀번호</div>
                      <div className="col-span-1">••••••••••</div>
                      <div className="text-right">
                        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                          수정
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-sm text-gray-400">휴대폰 번호</div>
                      <div className="col-span-1">010-1234-5678</div>
                      <div className="text-right">
                        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                          수정
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800 text-white">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">MY 카테고리</CardTitle>
                    <Link href="#" className="text-sm text-red-500 hover:text-red-400 flex items-center">
                      카테고리 관리
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-800 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-500 mr-2" />
                          <span>내 관심 강의 카테고리를 구성해보세요!</span>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-800 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <Bell className="h-5 w-5 text-gray-400 mr-2" />
                          <span>내 카테고리 새로운 강의 알림 받기</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="pt-6 space-y-6">
                <Card className="bg-gray-900 border-gray-800 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg">알림 설정</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">마케팅 정보 수신</p>
                        <p className="text-sm text-gray-400">인프런의 다양한 소식을 받아보세요</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="border-gray-700 text-gray-300">
                          이메일
                        </Badge>
                        <Badge variant="outline" className="border-gray-700 text-gray-300">
                          SMS
                        </Badge>
                      </div>
                    </div>
                    <Separator className="bg-gray-800" />

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">댓글 알림</p>
                        <p className="text-sm text-gray-400">내 게시글에 댓글이 달렸을 때 알림을 받습니다</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="border-gray-700 text-gray-300">
                          이메일
                        </Badge>
                        <Badge className="bg-red-600 hover:bg-red-700">웹</Badge>
                      </div>
                    </div>
                    <Separator className="bg-gray-800" />

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">강의 업데이트</p>
                        <p className="text-sm text-gray-400">수강 중인 강의가 업데이트되면 알림을 받습니다</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-red-600 hover:bg-red-700">이메일</Badge>
                        <Badge className="bg-red-600 hover:bg-red-700">웹</Badge>
                      </div>
                    </div>
                    <Separator className="bg-gray-800" />

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">관심 카테고리 신규 강의</p>
                        <p className="text-sm text-gray-400">관심 카테고리에 새 강의가 등록되면 알림을 받습니다</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-red-600 hover:bg-red-700">이메일</Badge>
                        <Badge variant="outline" className="border-gray-700 text-gray-300">
                          웹
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg">보안 설정</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium">2단계 인증</p>
                          <p className="text-sm text-gray-400">계정 보안을 강화하기 위한 2단계 인증을 설정합니다</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                        설정
                      </Button>
                    </div>
                    <Separator className="bg-gray-800" />

                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium">로그인 기록</p>
                          <p className="text-sm text-gray-400">최근 로그인 기록을 확인합니다</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                        보기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}


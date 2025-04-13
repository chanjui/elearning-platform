"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import DashboardHeader from "@/components/dashboard-header"
import { Camera, Globe, Github, Linkedin, Twitter } from "lucide-react"

export default function ProfilePage() {
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=200&width=200")

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">프로필 설정</h1>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Image
                  src={profileImage || "/placeholder.svg"}
                  alt="프로필 이미지"
                  width={200}
                  height={200}
                  className="w-40 h-40 rounded-full object-cover border"
                />
                <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full bg-white">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <h2 className="font-medium">홍길동</h2>
                <p className="text-sm text-gray-500">example@example.com</p>
              </div>
            </div>

            <div className="flex-1">
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">기본 정보</TabsTrigger>
                  <TabsTrigger value="account">계정 정보</TabsTrigger>
                  <TabsTrigger value="social">소셜 정보</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="mt-6">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">이름</Label>
                        <Input id="name" defaultValue="홍길동" />
                      </div>
                      <div>
                        <Label htmlFor="nickname">닉네임</Label>
                        <Input id="nickname" defaultValue="개발자길동" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">자기소개</Label>
                      <Textarea
                        id="bio"
                        placeholder="자기소개를 입력해주세요"
                        className="min-h-[100px]"
                        defaultValue="안녕하세요, 백엔드 개발자 홍길동입니다. 주로 Java와 Spring을 사용하며, 최근에는 Docker와 Kubernetes에 관심을 가지고 있습니다."
                      />
                    </div>

                    <div>
                      <Label htmlFor="job">직업</Label>
                      <Input id="job" defaultValue="백엔드 개발자" />
                    </div>

                    <div>
                      <Label htmlFor="company">회사/소속</Label>
                      <Input id="company" defaultValue="ABC 테크놀로지" />
                    </div>

                    <div className="flex justify-end">
                      <Button>저장하기</Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="account" className="mt-6">
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="email">이메일</Label>
                      <div className="flex gap-2">
                        <Input id="email" defaultValue="example@example.com" readOnly className="bg-gray-50" />
                        <Button variant="outline">변경</Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">전화번호</Label>
                      <div className="flex gap-2">
                        <Input id="phone" defaultValue="010-1234-5678" />
                        <Button variant="outline">인증</Button>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">비밀번호 변경</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="current-password">현재 비밀번호</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div>
                          <Label htmlFor="new-password">새 비밀번호</Label>
                          <Input id="new-password" type="password" />
                          <p className="text-xs text-gray-500 mt-1">8자 이상, 영문, 숫자, 특수문자 조합</p>
                        </div>
                        <div>
                          <Label htmlFor="confirm-password">비밀번호 확인</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button>저장하기</Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="social" className="mt-6">
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="website" className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        웹사이트
                      </Label>
                      <Input id="website" placeholder="https://example.com" />
                    </div>

                    <div>
                      <Label htmlFor="github" className="flex items-center">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Label>
                      <Input id="github" placeholder="https://github.com/username" />
                    </div>

                    <div>
                      <Label htmlFor="linkedin" className="flex items-center">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Label>
                      <Input id="linkedin" placeholder="https://linkedin.com/in/username" />
                    </div>

                    <div>
                      <Label htmlFor="twitter" className="flex items-center">
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </Label>
                      <Input id="twitter" placeholder="https://twitter.com/username" />
                    </div>

                    <div className="flex justify-end">
                      <Button>저장하기</Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


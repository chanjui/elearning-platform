"use client"

import React, {useEffect, useState} from "react"
import {useParams, useRouter} from "next/navigation"
import Link from "next/link"
import {ArrowLeft, Bold, Code, ImageIcon, Italic, LinkIcon, List, ListOrdered} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import NetflixHeader from "@/components/netflix-header"
import useUserStore from "@/app/auth/userStore"

interface CommunityBoardEditDTO {
  subject: string
  content: string
  bname: string
  fileData?: string | null
}

export default function CommunityEditPage() {
  const router = useRouter()
  const params = useParams()
  const boardId = Number(params.id)
  const API_URL = "/api/community"

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [bname, setBname] = useState("질문및답변")
  const [showImageUploadModal, setShowImageUploadModal] = useState(false)
  const {user, restoreFromStorage} = useUserStore()

  useEffect(() => {
    restoreFromStorage()
    if (boardId) fetchPostData()
  }, [boardId])

  const fetchPostData = async () => {
    try {
      const res = await fetch(`${API_URL}/${boardId}?userId=${user?.id || 0}`)
      const json = await res.json()
      const data: CommunityBoardEditDTO = {
        subject: json.data.subject,
        content: json.data.content,
        bname: json.data.category,
        fileData: json.data.fileData
      }
      setTitle(data.subject)
      setContent(data.content)
      setBname(data.bname)
    } catch (err) {
      console.error("게시글 데이터를 불러오는 중 오류 발생:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert("로그인이 필요합니다.")
      return
    }

    try {
      const response = await fetch(`${API_URL}/${boardId}/editPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          boardId: boardId,
          userId: user.id,
          bname: bname,
          subject: title,
          content,
          fileData: ""
        })
      })

      if (!response.ok) throw new Error("수정 실패")

      router.push("/user/community")
    } catch (err) {
      console.error("게시글 수정 오류:", err)
      alert("게시글 수정에 실패했습니다.")
    }
  }

  const handleImageUpload = () => {
    setShowImageUploadModal(false)
    setContent((prev) => `${prev}\n![이미지 설명](/placeholder.svg?height=300&width=500)\n`)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader/>
      <main className="container mx-auto px-4 py-20">
        <div className="mb-6">
          <Link href="/user/community" className="inline-flex items-center text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-1"/>
            커뮤니티로 돌아가기
          </Link>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
          <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium mb-2">카테고리</label>
              <Select value={bname} onValueChange={setBname}>
                <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="카테고리 선택"/>
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="질문및답변">질문및답변</SelectItem>
                  <SelectItem value="프로젝트">프로젝트</SelectItem>
                  <SelectItem value="자유게시판">자유게시판</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium mb-2">제목</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해주세요"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium mb-2">내용</label>
              <div className="flex items-center gap-1 p-2 border border-gray-700 rounded-t-lg bg-gray-800">
                {[Bold, Italic, LinkIcon, List, ListOrdered, Code].map((Icon, i) => (
                  <button key={i} type="button" className="p-1 hover:bg-gray-700 rounded text-gray-300">
                    <Icon className="h-4 w-4"/>
                  </button>
                ))}
                <Dialog open={showImageUploadModal} onOpenChange={setShowImageUploadModal}>
                  <DialogTrigger asChild>
                    <button type="button" className="p-1 hover:bg-gray-700 rounded text-gray-300">
                      <ImageIcon className="h-4 w-4"/>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-800 text-white">
                    <DialogHeader>
                      <DialogTitle>이미지 업로드</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                        <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400"/>
                        <p className="text-sm text-gray-400 mb-4">이미지를 여기에 드래그하거나 파일을 선택하세요</p>
                        <p className="text-xs text-gray-500 mb-4">지원 형식: JPG, PNG, GIF (최대 5MB)</p>
                        <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                          파일 선택
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowImageUploadModal(false)}
                              className="border-gray-700 text-gray-300 hover:bg-gray-800">
                        취소
                      </Button>
                      <Button className="bg-red-600 hover:bg-red-700" onClick={handleImageUpload}>
                        업로드
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력해주세요. 마크다운 형식을 지원합니다."
                className="min-h-[300px] rounded-t-none border-t-0 border-gray-700 bg-gray-800 text-white"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/user/community")}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                취소
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                수정하기
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

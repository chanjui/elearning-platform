"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ThumbsUp, MessageSquare, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import InstructorHeader from "@/components/instructor/instructor-header"
import InstructorSidebar from "@/components/instructor/instructor-sidebar"

export default function QuestionDetailPage({ params }: { params: { id: string } }) {
  const [replyContent, setReplyContent] = useState("")

  // 예시 질문 데이터
  const question = {
    id: params.id,
    title: "동일한 쓰레드의 소유권 정책에 대해 궁금합니다.",
    content: `동일한 쓰레드가 write_lock을 들고 있을 때는 read_lock을 들을 수 있지만 read_lock을 들고 있을 때에는 write_lock을 들을 수 없는 것 같아요.

그래서 ReadLock() 메소드에서 같은 쓰레드가 write_lock을 갖고있는지 체크를 해서 갖고있다면 단순히 read flag를 1 증가시키고 끝.

근데 그렇다면 WriteLock() 메소드에서는 동일한 쓰레드가 read flag가 0을 갖고있는지 확인해야 하는 것 아닌가요?

R -> W가 허용되지 않는다면, write_lock을 시도 한 번에 들고 쓰레드가 read flag가 0인지 체크하는 로직이 필요한 것 같습니다!`,
    author: "SeungHun Yim",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "2023-03-21 06:38",
    views: 15,
    likes: 0,
    course: "[C++과 언리얼로 만드는 MMORPG 게임 개발 시리즈] Part5: 게임 서버",
    tags: ["mmmorpg", "windows-server"],
    replies: [
      {
        id: "r1",
        author: "Rookiss",
        authorImage: "/placeholder.svg?height=40&width=40",
        date: "2023-03-21 13:42",
        content:
          "안녕하세요!\n\n라이브러리에 대해 R -> W에서 바로 W이 아니라\n\n별도의 락을 풀어준 뒤서 W를 거는 경우도 있고 다양하지만\n\n이런 코드들에서의 이유에 W->R OK R->W Crash는 구글링하시면 됩니다.",
        likes: 1,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <InstructorHeader />

      <div className="flex">
        <InstructorSidebar />

        {/* 메인 콘텐츠 */}
        <main className="ml-64 flex-1 px-6 py-8 pt-24">
          <div className="mb-6">
            <Link href="/instructor/questions" className="inline-flex items-center text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-1" />
              질문 목록으로 돌아가기
            </Link>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center">
                  <span>{question.date}</span>
                  <span className="mx-2">•</span>
                  <span>조회수: {question.views}</span>
                </div>
                <div>
                  <Badge className="bg-blue-600">{question.course}</Badge>
                </div>
              </div>
            </div>

            <Separator className="my-4 bg-gray-800" />

            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0">
                <Image
                  src={question.authorImage || "/placeholder.svg"}
                  alt={question.author}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="font-medium">{question.author}</span>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-line">{question.content}</p>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <button className="flex items-center text-gray-400 hover:text-white">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>좋아요 {question.likes}</span>
                  </button>
                  <button className="flex items-center text-gray-400 hover:text-white">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>댓글 {question.replies.length}</span>
                  </button>
                  <button className="flex items-center text-gray-400 hover:text-white">
                    <Share2 className="h-4 w-4 mr-1" />
                    <span>공유</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">답변 {question.replies.length}</h2>

              {question.replies.map((reply) => (
                <div key={reply.id} className="border border-gray-800 rounded-lg p-4 mb-4 bg-gray-800/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={reply.authorImage || "/placeholder.svg"}
                        alt={reply.author}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium text-green-400">{reply.author}</span>
                          <span className="text-xs text-gray-400 ml-2">{reply.date}</span>
                        </div>
                        <Badge className="bg-green-600">강사</Badge>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        <p className="whitespace-pre-line">{reply.content}</p>
                      </div>

                      <div className="flex items-center gap-4 mt-4">
                        <button className="flex items-center text-gray-400 hover:text-white">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>좋아요 {reply.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-6">
                <h3 className="font-medium mb-2">답변 작성</h3>
                <Textarea
                  placeholder="답변을 작성해주세요..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[150px] bg-gray-800 border-gray-700 text-white mb-2"
                />
                <div className="flex justify-end">
                  <Button className="bg-red-600 hover:bg-red-700">답변 등록</Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ChevronRight, MessageSquare, Phone, Mail, HelpCircle, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import NetflixHeader from "@/components/netflix-header"

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // 자주 묻는 질문 데이터
  const faqs = [
    {
      category: "계정",
      questions: [
        {
          id: "account-1",
          question: "비밀번호를 잊어버렸어요.",
          answer:
            "로그인 페이지에서 '비밀번호를 잊으셨나요?' 링크를 클릭하여 비밀번호 재설정을 진행할 수 있습니다. 가입 시 등록한 이메일로 재설정 링크가 발송됩니다.",
        },
        {
          id: "account-2",
          question: "계정 정보를 변경하고 싶어요.",
          answer:
            "대시보드 > 설정 메뉴에서 계정 정보를 변경할 수 있습니다. 이메일 변경의 경우 보안을 위해 추가 인증이 필요할 수 있습니다.",
        },
        {
          id: "account-3",
          question: "회원 탈퇴는 어떻게 하나요?",
          answer:
            "대시보드 > 설정 > 계정 설정 페이지 하단에서 '회원 탈퇴' 버튼을 통해 진행할 수 있습니다. 탈퇴 시 모든 데이터가 삭제되며 복구가 불가능하니 신중하게 결정해주세요.",
        },
      ],
    },
    {
      category: "결제",
      questions: [
        {
          id: "payment-1",
          question: "결제 방법은 어떤 것이 있나요?",
          answer:
            "신용/체크카드, 무통장입금, 카카오페이, 네이버페이 등 다양한 결제 방법을 지원하고 있습니다. 결제 페이지에서 원하는 방법을 선택할 수 있습니다.",
        },
        {
          id: "payment-2",
          question: "환불 정책은 어떻게 되나요?",
          answer:
            "강의 구매 후 7일 이내, 수강 진도율 25% 이하인 경우 전액 환불이 가능합니다. 그 이후에는 부분 환불 또는 환불이 불가능할 수 있으니 구매 전 강의 소개를 꼼꼼히 확인해주세요.",
        },
        {
          id: "payment-3",
          question: "세금계산서 발행이 가능한가요?",
          answer:
            "네, 법인 회원의 경우 세금계산서 발행이 가능합니다. 결제 완료 후 '구매내역' 페이지에서 세금계산서 발행 신청을 할 수 있습니다.",
        },
      ],
    },
    {
      category: "강의",
      questions: [
        {
          id: "course-1",
          question: "강의 수강 기간은 얼마인가요?",
          answer:
            "대부분의 강의는 무제한 수강이 가능합니다. 일부 특별 강의의 경우 기간 제한이 있을 수 있으며, 이는 강의 소개 페이지에 명시되어 있습니다.",
        },
        {
          id: "course-2",
          question: "수료증은 어떻게 받을 수 있나요?",
          answer:
            "강의 진도율 80% 이상 달성 시 수료증을 발급받을 수 있습니다. 강의 학습 페이지에서 '수료증 발급' 버튼을 클릭하여 PDF 형태로 다운로드 가능합니다.",
        },
        {
          id: "course-3",
          question: "강의 내용에 대해 질문하고 싶어요.",
          answer:
            "각 강의 페이지 내 '질문하기' 기능을 통해 강사에게 직접 질문할 수 있습니다. 다른 수강생들의 질문과 답변도 확인할 수 있어 학습에 도움이 됩니다.",
        },
      ],
    },
    {
      category: "기술",
      questions: [
        {
          id: "tech-1",
          question: "강의 영상이 재생되지 않아요.",
          answer:
            "브라우저 캐시를 삭제하거나 다른 브라우저로 접속해보세요. 문제가 지속되면 네트워크 연결을 확인하고, 방화벽 설정을 확인해주세요.",
        },
        {
          id: "tech-2",
          question: "모바일에서도 수강할 수 있나요?",
          answer:
            "네, 모바일 웹 브라우저를 통해 수강이 가능합니다. 더 나은 경험을 위해 인프런 모바일 앱을 설치하여 이용하실 것을 권장합니다.",
        },
        {
          id: "tech-3",
          question: "강의 자료를 다운로드할 수 없어요.",
          answer:
            "강의 자료 다운로드 문제는 브라우저 설정 또는 네트워크 문제일 수 있습니다. 팝업 차단 설정을 확인하고, 다른 브라우저로 시도해보세요.",
        },
      ],
    },
  ]

  // 필터링된 FAQ
  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">고객센터</h1>
            <p className="text-gray-400">무엇을 도와드릴까요?</p>
          </div>

          <div className="relative mb-12">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="질문을 검색해보세요"
              className="pl-12 py-6 text-lg bg-gray-800 border-gray-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 hover:border-red-500 transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center mr-3">
                  <HelpCircle className="h-5 w-5 text-red-500" />
                </div>
                <h2 className="text-lg font-medium">자주 묻는 질문</h2>
              </div>
              <p className="text-gray-400 mb-4">가장 많이 묻는 질문들에 대한 답변을 확인해보세요.</p>
              <Link href="#faq" className="text-red-500 hover:text-red-400 flex items-center">
                바로가기 <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 hover:border-red-500 transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center mr-3">
                  <MessageSquare className="h-5 w-5 text-red-500" />
                </div>
                <h2 className="text-lg font-medium">1:1 문의</h2>
              </div>
              <p className="text-gray-400 mb-4">더 자세한 문의가 필요하시면 1:1 문의를 이용해주세요.</p>
              <Link href="#contact" className="text-red-500 hover:text-red-400 flex items-center">
                바로가기 <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 hover:border-red-500 transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-red-500" />
                </div>
                <h2 className="text-lg font-medium">공지사항</h2>
              </div>
              <p className="text-gray-400 mb-4">인프런의 최신 소식과 업데이트 내용을 확인하세요.</p>
              <Link href="#notices" className="text-red-500 hover:text-red-400 flex items-center">
                바로가기 <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          <div id="faq" className="mb-16">
            <h2 className="text-2xl font-bold mb-6">자주 묻는 질문</h2>

            <Tabs defaultValue="all">
              <TabsList className="bg-gray-800 mb-6">
                <TabsTrigger value="all" className="data-[state=active]:bg-gray-700">
                  전체
                </TabsTrigger>
                <TabsTrigger value="account" className="data-[state=active]:bg-gray-700">
                  계정
                </TabsTrigger>
                <TabsTrigger value="payment" className="data-[state=active]:bg-gray-700">
                  결제
                </TabsTrigger>
                <TabsTrigger value="course" className="data-[state=active]:bg-gray-700">
                  강의
                </TabsTrigger>
                <TabsTrigger value="tech" className="data-[state=active]:bg-gray-700">
                  기술
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                {searchQuery && filteredFaqs.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
                    <p className="text-gray-400">다른 키워드로 검색하거나 1:1 문의를 이용해주세요.</p>
                  </div>
                ) : (
                  <>
                    {filteredFaqs.map((category) => (
                      <div key={category.category} className="mb-8">
                        <h3 className="text-lg font-medium mb-4">{category.category}</h3>
                        <Accordion type="single" collapsible className="space-y-2">
                          {category.questions.map((faq) => (
                            <AccordionItem
                              key={faq.id}
                              value={faq.id}
                              className="border border-gray-800 rounded-lg bg-gray-800/50 px-4"
                            >
                              <AccordionTrigger className="text-left py-4 hover:no-underline">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-gray-300 pb-4">{faq.answer}</AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    ))}
                  </>
                )}
              </TabsContent>

              <TabsContent value="account" className="mt-0">
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs
                    .find((c) => c.category === "계정")
                    ?.questions.map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border border-gray-800 rounded-lg bg-gray-800/50 px-4"
                      >
                        <AccordionTrigger className="text-left py-4 hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 pb-4">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="payment" className="mt-0">
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs
                    .find((c) => c.category === "결제")
                    ?.questions.map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border border-gray-800 rounded-lg bg-gray-800/50 px-4"
                      >
                        <AccordionTrigger className="text-left py-4 hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 pb-4">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="course" className="mt-0">
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs
                    .find((c) => c.category === "강의")
                    ?.questions.map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border border-gray-800 rounded-lg bg-gray-800/50 px-4"
                      >
                        <AccordionTrigger className="text-left py-4 hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 pb-4">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="tech" className="mt-0">
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs
                    .find((c) => c.category === "기술")
                    ?.questions.map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border border-gray-800 rounded-lg bg-gray-800/50 px-4"
                      >
                        <AccordionTrigger className="text-left py-4 hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 pb-4">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>

          <div id="contact" className="mb-16">
            <h2 className="text-2xl font-bold mb-6">1:1 문의하기</h2>

            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <form className="space-y-6">
                <div>
                  <label htmlFor="inquiry-type" className="block text-sm font-medium text-gray-300 mb-1">
                    문의 유형
                  </label>
                  <Select>
                    <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="문의 유형을 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="account">계정 문의</SelectItem>
                      <SelectItem value="payment">결제 문의</SelectItem>
                      <SelectItem value="course">강의 문의</SelectItem>
                      <SelectItem value="tech">기술 문의</SelectItem>
                      <SelectItem value="other">기타 문의</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="inquiry-title" className="block text-sm font-medium text-gray-300 mb-1">
                    제목
                  </label>
                  <Input
                    id="inquiry-title"
                    placeholder="문의 제목을 입력해주세요"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-content" className="block text-sm font-medium text-gray-300 mb-1">
                    내용
                  </label>
                  <Textarea
                    id="inquiry-content"
                    placeholder="문의 내용을 자세히 입력해주세요"
                    className="min-h-[200px] bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-file" className="block text-sm font-medium text-gray-300 mb-1">
                    첨부 파일 (선택)
                  </label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-400 mb-2">파일을 여기에 드래그하거나 클릭하여 업로드하세요</p>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      파일 선택
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-red-600 hover:bg-red-700">문의 제출하기</Button>
                </div>
              </form>
            </div>
          </div>

          <div id="notices" className="mb-16">
            <h2 className="text-2xl font-bold mb-6">공지사항</h2>

            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <div className="space-y-4">
                <div className="border-b border-gray-800 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">인프런 서비스 점검 안내 (2024.03.25)</h3>
                    <span className="text-sm text-gray-400">2024.03.20</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    서비스 안정화를 위한 정기 점검이 진행될 예정입니다. 점검 시간 동안 일부 서비스 이용이 제한될 수
                    있습니다.
                  </p>
                </div>

                <div className="border-b border-gray-800 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">개인정보처리방침 개정 안내</h3>
                    <span className="text-sm text-gray-400">2024.03.15</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    2024년 4월 1일부터 적용되는 개인정보처리방침 개정 내용을 안내드립니다. 주요 변경사항을 확인해주세요.
                  </p>
                </div>

                <div className="border-b border-gray-800 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">인프런 봄맞이 할인 이벤트 안내</h3>
                    <span className="text-sm text-gray-400">2024.03.01</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    3월 한 달간 진행되는 봄맞이 할인 이벤트에 많은 참여 바랍니다. 인기 강의를 최대 50% 할인된 가격으로
                    만나보세요.
                  </p>
                </div>

                <div className="border-b border-gray-800 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">모바일 앱 업데이트 안내 (v2.5.0)</h3>
                    <span className="text-sm text-gray-400">2024.02.15</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    인프런 모바일 앱이 업데이트되었습니다. 오프라인 재생 기능 개선 및 UI/UX 개선 사항이 포함되어
                    있습니다.
                  </p>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  더보기
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-bold mb-6">고객센터 연락처</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center mr-3">
                  <Phone className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">전화 문의</h3>
                  <p className="text-gray-300">02-1234-5678</p>
                  <p className="text-sm text-gray-400">평일 10:00 - 18:00 (공휴일 제외)</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center mr-3">
                  <Mail className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">이메일 문의</h3>
                  <p className="text-gray-300">support@inflearn.com</p>
                  <p className="text-sm text-gray-400">24시간 접수 가능</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center mr-3">
                  <MessageSquare className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">실시간 채팅</h3>
                  <p className="text-gray-300">채팅 상담하기</p>
                  <p className="text-sm text-gray-400">평일 10:00 - 17:00 (공휴일 제외)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


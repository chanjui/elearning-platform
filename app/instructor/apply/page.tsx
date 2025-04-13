"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import NetflixHeader from "@/components/netflix-header"

interface FormData {
  name: string
  email: string
  phone: string
  occupation: string
  experience: string
  expertise: string[]
  portfolioUrl: string
  sampleVideoUrl: string
  courseTitle: string
  courseDescription: string
  targetAudience: string
  courseOutline: string
  marketingPlan: string
  termsAgreed: boolean
}

export default function InstructorApplyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    occupation: "",
    experience: "",
    expertise: [],
    portfolioUrl: "",
    sampleVideoUrl: "",
    courseTitle: "",
    courseDescription: "",
    targetAudience: "",
    courseOutline: "",
    marketingPlan: "",
    termsAgreed: false,
  })

  // 폼 데이터 업데이트
  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // 전문 분야 토글
  const toggleExpertise = (value: string) => {
    setFormData((prev) => {
      const expertise = [...prev.expertise]
      if (expertise.includes(value)) {
        return { ...prev, expertise: expertise.filter((item) => item !== value) }
      } else {
        return { ...prev, expertise: [...expertise, value] }
      }
    }) 
  }

  // 다음 단계로 이동
  const goToNextStep = () => {
    setStep(step + 1)
    window.scrollTo(0, 0)
  }

  // 이전 단계로 이동
  const goToPrevStep = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }

  // 신청서 제출
  const submitApplication = () => {
    console.log("신청서 제출:", formData)
    // API 호출 로직 추가
    router.push("/instructor/apply/success")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <main className="container mx-auto px-4 py-20">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-1" />
            홈으로 돌아가기
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">강사 신청</h1>
            <p className="text-gray-400">인프런에서 당신의 지식과 경험을 공유하고 수익을 창출하세요.</p>
          </div>

          {/* 진행 상태 표시 */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <div className="text-sm text-gray-400">기본 정보</div>
              <div className="text-sm text-gray-400">강의 계획</div>
              <div className="text-sm text-gray-400">신청 완료</div>
            </div>
            <div className="relative h-2 bg-gray-800 rounded-full">
              <div
                className="absolute h-2 bg-red-600 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
              <div className="absolute top-0 left-0 transform -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full"></div>
              <div
                className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 ${
                  step >= 2 ? "bg-red-600" : "bg-gray-700"
                } rounded-full`}
              ></div>
              <div
                className={`absolute top-0 right-0 transform -translate-y-1/2 w-4 h-4 ${
                  step >= 3 ? "bg-red-600" : "bg-gray-700"
                } rounded-full`}
              ></div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
            {/* 단계 1: 기본 정보 */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-6">기본 정보</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">
                        이름
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white mt-1"
                        placeholder="실명을 입력해주세요"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-300">
                        이메일
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white mt-1"
                        placeholder="example@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-300">
                      연락처
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-1"
                      placeholder="010-0000-0000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="occupation" className="text-gray-300">
                      직업
                    </Label>
                    <Select value={formData.occupation} onValueChange={(value) => updateFormData("occupation", value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                        <SelectValue placeholder="직업을 선택해주세요" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="developer">개발자</SelectItem>
                        <SelectItem value="designer">디자이너</SelectItem>
                        <SelectItem value="marketer">마케터</SelectItem>
                        <SelectItem value="pm">기획자/PM</SelectItem>
                        <SelectItem value="student">학생</SelectItem>
                        <SelectItem value="teacher">교사/교수</SelectItem>
                        <SelectItem value="other">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2 block">전문 분야 (다중 선택 가능)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        "웹 개발",
                        "모바일 앱 개발",
                        "게임 개발",
                        "데이터 사이언스",
                        "인공지능/머신러닝",
                        "클라우드/DevOps",
                        "보안",
                        "디자인",
                        "마케팅",
                        "기획",
                        "비즈니스/경영",
                        "기타",
                      ].map((field) => (
                        <div key={field} className="flex items-center space-x-2">
                          <Checkbox
                            id={`expertise-${field}`}
                            checked={formData.expertise.includes(field)}
                            onCheckedChange={() => toggleExpertise(field)}
                            className="border-gray-600"
                          />
                          <Label htmlFor={`expertise-${field}`} className="text-gray-300">
                            {field}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="experience" className="text-gray-300">
                      관련 경력 및 경험
                    </Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => updateFormData("experience", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-1 min-h-[120px]"
                      placeholder="관련 분야에서의 경력과 경험을 자세히 작성해주세요."
                    />
                  </div>

                  <div>
                    <Label htmlFor="portfolioUrl" className="text-gray-300">
                      포트폴리오 URL (선택사항)
                    </Label>
                    <Input
                      id="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={(e) => updateFormData("portfolioUrl", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-1"
                      placeholder="https://github.com/username 또는 개인 웹사이트"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sampleVideoUrl" className="text-gray-300">
                      샘플 강의 영상 URL (선택사항)
                    </Label>
                    <Input
                      id="sampleVideoUrl"
                      value={formData.sampleVideoUrl}
                      onChange={(e) => updateFormData("sampleVideoUrl", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-1"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      기존에 제작한 강의 영상이나 발표 영상이 있다면 URL을 입력해주세요.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <Button onClick={goToNextStep} className="bg-red-600 hover:bg-red-700">
                    다음 단계
                  </Button>
                </div>
              </div>
            )}

            {/* 단계 2: 강의 계획 */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-6">강의 계획</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="courseTitle" className="text-gray-300">
                      강의 제목
                    </Label>
                    <Input
                      id="courseTitle"
                      value={formData.courseTitle}
                      onChange={(e) => updateFormData("courseTitle", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-1"
                      placeholder="강의 제목을 입력해주세요"
                    />
                  </div>

                  <div>
                    <Label htmlFor="courseDescription" className="text-gray-300">
                      강의 설명
                    </Label>
                    <Textarea
                      id="courseDescription"
                      value={formData.courseDescription}
                      onChange={(e) => updateFormData("courseDescription", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-1 min-h-[120px]"
                      placeholder="강의의 주요 내용과 목표를 설명해주세요."
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetAudience" className="text-gray-300">
                      대상 수강생
                    </Label>
                    <Textarea
                      id="targetAudience"
                      value={formData.targetAudience}
                      onChange={(e) => updateFormData("targetAudience", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-1 min-h-[100px]"
                      placeholder="이 강의가 어떤 사람들에게 적합한지 설명해주세요."
                    />
                  </div>

                  <div>
                    <Label htmlFor="courseOutline" className="text-gray-300">
                      강의 개요 (커리큘럼)
                    </Label>
                    <Textarea
                      id="courseOutline"
                      value={formData.courseOutline}
                      onChange={(e) => updateFormData("courseOutline", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-1 min-h-[150px]"
                      placeholder="강의의 주요 섹션과 각 섹션에서 다룰 내용을 개략적으로 작성해주세요."
                    />
                  </div>

                  <div>
                    <Label htmlFor="marketingPlan" className="text-gray-300">
                      마케팅 계획 (선택사항)
                    </Label>
                    <Textarea
                      id="marketingPlan"
                      value={formData.marketingPlan}
                      onChange={(e) => updateFormData("marketingPlan", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-1 min-h-[100px]"
                      placeholder="강의를 홍보하기 위한 계획이 있다면 작성해주세요."
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="termsAgreed"
                      checked={formData.termsAgreed}
                      onCheckedChange={(checked: boolean) => updateFormData("termsAgreed", checked)}
                      className="border-gray-600 mt-1"
                    />
                    <Label htmlFor="termsAgreed" className="text-gray-300">
                      인프런의{" "}
                      <Link href="#" className="text-red-500 hover:underline">
                        강사 이용약관
                      </Link>
                      과{" "}
                      <Link href="#" className="text-red-500 hover:underline">
                        개인정보 처리방침
                      </Link>
                      에 동의합니다.
                    </Label>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button
                    onClick={goToPrevStep}
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    이전 단계
                  </Button>
                  <Button
                    onClick={submitApplication}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={!formData.termsAgreed}
                  >
                    신청 완료
                  </Button>
                </div>
              </div>
            )}

            {/* 단계 3: 신청 완료 */}
            {step === 3 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">신청이 완료되었습니다!</h2>
                <p className="text-gray-400 mb-6">
                  강사 신청이 접수되었습니다. 검토 후 3-5일 내에 이메일로 결과를 알려드립니다.
                </p>

                <Alert className="bg-gray-800 border-gray-700 mb-6">
                  <Info className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-gray-300">
                    승인이 완료되면 강사 대시보드에 접근할 수 있으며, 강의를 업로드하고 관리할 수 있습니다.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => router.push("/")}
                  >
                    홈으로 이동
                  </Button>
                  <Button className="bg-red-600 hover:bg-red-700" onClick={() => router.push("/user/dashboard")}>
                    대시보드로 이동
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}


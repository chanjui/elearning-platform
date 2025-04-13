"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import NetflixHeader from "@/components/netflix-header"

const REFERRAL_SOURCES = [
  { id: "internet", label: "인터넷 검색" },
  { id: "sns", label: "SNS" },
  { id: "friend", label: "지인 추천" },
  { id: "linkedin", label: "링크드인 메시지" },
  { id: "remember", label: "리멤버 광고" },
  { id: "social_ads", label: "구글/페이스북/인스타그램 광고" },
  { id: "other", label: "그 외" },
]

const API_URL = "/api/instructor/signup"

export default function InstructorSignupPage() {
  const router = useRouter()

  const [githubLink, setGithubLink] = useState("")
  const [bio, setBio] = useState("")
  const [expertiseId, setExpertiseId] = useState<number | null>(null)
  const [expertiseList, setExpertiseList] = useState<{ id: number; name: string }[]>([])
  const [categoryList, setCategoryList] = useState<{ id: number; name: string }[]>([])
  const [desiredFields, setDesiredFields] = useState<number[]>([])
  const [referralSource, setReferralSource] = useState<string | null>(null)
  const [otherReferral, setOtherReferral] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleField = (fieldId: number) => {
    setDesiredFields((prev) =>
      prev.includes(fieldId) ? prev.filter((id) => id !== fieldId) : [...prev, fieldId]
    )
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const trimmedGithubLink = githubLink.trim()
    const trimmedBio = bio.trim()

    if (!trimmedGithubLink || !trimmedBio) {
      alert("링크와 자기소개를 입력해주세요.");
      setIsSubmitting(false);
      return;
    }

    if (expertiseId === null) {
      alert("전문 분야를 선택해주세요.");
      setIsSubmitting(false);
      return;
    }

    if (desiredFields.length === 0) {
      alert("희망 분야를 하나 이상 선택해주세요.");
      setIsSubmitting(false);
      return;
    }

    if (!referralSource) {
      alert("유입 경로를 선택해주세요.");
      setIsSubmitting(false);
      return;
    }

    if (referralSource === "other" && !otherReferral.trim()) {
      alert("유입 경로 상세 내용을 입력해주세요.")
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          githubLink: trimmedGithubLink,
          bio: trimmedBio,
          expertiseId: expertiseId,
          fieldIds: desiredFields,
          referralSource: referralSource === "other" ? otherReferral : referralSource,
        }),
      })

      const result = await res.json()
      //console.log("응답 결과:", result)

      if (res.ok) {
        alert("강사 가입이 완료되었습니다.")
        router.push("/instructor/apply/success")
      } else {
        alert(result.message || "강사 전환에 실패했습니다.")
      }
    } catch (error) {
      console.error("요청 오류:", error)
      alert("요청 중 오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [expertiseRes, categoryRes] = await Promise.all([
          fetch("/api/instructor/meta/expertise"),
          fetch("/api/instructor/meta/categories"),
        ])

        const expertiseData = await expertiseRes.json()
        const categoryData = await categoryRes.json()

        setExpertiseList(expertiseData.data)
        setCategoryList(categoryData.data)
      } catch (err) {
        console.error("메타 정보 로딩 실패:", err)
        alert("강사 등록에 필요한 정보를 불러오는 데 실패했습니다.")
      }
    }

    fetchMeta()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />
      <div className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="mt-6 text-3xl font-bold">강사 전환</h2>
            <p className="mt-2 text-sm text-gray-400">인프런에서 강의를 제작하고 공유해보세요</p>
          </div>

          <div className="bg-gray-900 py-8 px-6 shadow-lg rounded-lg border border-gray-800">
            <form className="space-y-6" onSubmit={handleSignupSubmit}>
              {/* 링크 입력 */}
              <div>
                <Label htmlFor="githubLink" className="text-sm font-medium text-gray-300">
                  나를 표현할 수 있는 링크 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="githubLink"
                  type="url"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  placeholder="https://github.com/username"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>

              {/* 자기소개 */}
              <div>
                <Label htmlFor="bio" className="text-sm font-medium text-gray-300">
                  나를 소개하는 글 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="강사로서의 경험과 전문 분야를 소개해주세요"
                  className="bg-gray-800 border-gray-700 text-white mt-1 min-h-[100px]"
                />
              </div>

              {/* 전문 분야 */}
              <div>
                <Label htmlFor="expertiseTitle" className="text-sm font-medium text-gray-300">
                  전문 분야 <span className="text-red-500">*</span>
                </Label>
                <select
                  id="expertiseTitle"
                  value={expertiseId ?? ""}
                  onChange={(e) => setExpertiseId(Number(e.target.value))}
                  required
                  className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md mt-1"
                >
                  <option value="">전문 분야를 선택해주세요</option>
                  {expertiseList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 희망 분야 (다중 선택) */}
              <div>
                <Label className="text-sm font-medium text-gray-300 mb-2">
                  희망 분야 <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categoryList.map((category) => (
                    <Button
                      key={category.id}
                      type="button"
                      variant={desiredFields.includes(category.id) ? "default" : "outline"}
                      className={`text-sm py-1 h-auto ${
                        desiredFields.includes(category.id)
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                      }`}
                      onClick={() => toggleField(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">여러 분야를 선택할 수 있습니다.</p>
              </div>

              {/* 유입 경로 */}
              <div>
                <Label className="text-sm font-medium text-gray-300 mb-2">
                  유입 경로 <span className="text-red-500">*</span>
                </Label>
                <RadioGroup value={referralSource || ""} onValueChange={setReferralSource}>
                  {REFERRAL_SOURCES.map((source) => (
                    <div key={source.id} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={source.id} id={source.id} className="border-gray-600" />
                      <Label htmlFor={source.id} className="text-gray-300">
                        {source.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {referralSource === "other" && (
                  <div className="mt-2">
                    <Input
                      type="text"
                      value={otherReferral}
                      onChange={(e) => {
                        if (e.target.value.length <= 20) setOtherReferral(e.target.value)
                      }}
                      placeholder="20자 이내로 입력해주세요"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">{otherReferral.length}/20자</p>
                  </div>
                )}
              </div>

              {/* 제출 버튼 */}
              <div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                  {isSubmitting ? "처리 중..." : "강사 회원가입"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
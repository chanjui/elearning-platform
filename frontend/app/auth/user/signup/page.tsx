"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, ArrowLeft, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import NetflixHeader from "@/components/netflix-header"
import { useRouter } from "next/navigation"

const API_URL = "/api/user/signup"

export default function SignupPage() {
  const router = useRouter();

  // 비밀번호 보기/숨기기 여부
  const [showPassword, setShowPassword] = useState(false)

  // 현재 단계: 1이면 회원가입 입력, 2이면 이메일 인증
  const [step, setStep] = useState(1)

  // 사용자의 입력값 상태 관리
  const [email, setEmail] = useState("")
  const [nickname, setNickname] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")

  // 이메일 인증 관련 상태
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState("")
  const [verificationSuccess, setVerificationSuccess] = useState(""); // 성공 메시지

  // 인증 타이머 (180초 = 3분)
  const [timeLeft, setTimeLeft] = useState(180)
  const [timerActive, setTimerActive] = useState(false)

  // 타이머 표시 형식: mm:ss 형태
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // 타이머 setInterval이 중첩 방지
  useEffect(() => {
    if (!timerActive) return;
  
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [timerActive]);

  // 타이머 시작 함수
  const startTimer = () => {
    setTimeLeft(180)
    setTimerActive(true);
  }

  // 회원가입 제출 핸들러
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 앞뒤 공백 제거
    const trimmedNickname = nickname.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirm = passwordConfirm.trim();

    // 이름 유효성 검사
    const nameRegex = /^[가-힣a-zA-Z]{2,6}$/;
    if (!nameRegex.test(trimmedNickname)) {
      alert("이름은 2~6자의 한글 또는 영문으로 입력해주세요.");
      return;
    }

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
}

    // 연락처 유효성 검사
    const phoneRegex = /^010\d{8}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      alert("전화번호는 010으로 시작하는 숫자 11자리여야 합니다.");
      return;
    }

    // 비밀번호 유효성 검사
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(trimmedPassword)) {
      alert("비밀번호는 8자 이상, 영문 + 숫자 + 특수문자를 포함해야 합니다.");
      return;
    }

    // 비밀번호 확인 체크
    if (trimmedPassword !== trimmedConfirm) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    // 1단계: 사용자 정보 서버로 전송
    const res = await fetch(`${API_URL}/input`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        nickname: trimmedNickname,
        email: trimmedEmail,
        phone: trimmedPhone,
        password: trimmedPassword,
       }),
    })

    console.log("응답 상태코드:", res.status)

    if (!res.ok) {
      // 에러 응답을 JSON이 아닌 일반 텍스트(HTML)로 처리
      const errorText = await res.text()
      console.error("서버 응답 오류:", errorText)
      alert("서버에 문제가 발생했습니다.")
      return
    }
  
    const result = await res.json()
    //console.log("[1단계] 서버 응답 내용:", result)

    if (result.totalCount !== 1) {
      alert(result.message)
      return
    }

    // 2단계: 이메일 인증코드 발송
    const emailRes = await fetch(`${API_URL}/sendEmail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: trimmedEmail }),
    })
    
    const emailResult = await emailRes.json()
    //console.log("[2단계] 인증코드 요청 응답 상태:", emailRes.status)
    //console.log("[2단계] 인증 이메일 응답 내용:", emailResult)

    if (emailResult.totalCount !== 1) {
      alert(emailResult.message)
      return
    }

    // 성공 시: 인증 페이지로 전환 + 타이머 시작
    setStep(2)
    //console.log("step 상태값:", 2)
    startTimer()

  }

  // 인증 코드 입력 후 제출 → 백엔드 인증 요청
  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setVerificationError("")
    setVerificationSuccess("")

    const res = await fetch(`${API_URL}/verifyEmail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, inputAuthCode: verificationCode }),
    })

    const result = await res.json()
    if (result.totalCount === 1) {
      // 인증 성공 → 회원가입 완료 진행
      await completeSignup()
    } else {
      // 인증 실패
      setVerificationError("인증 번호가 틀립니다.")
      alert("인증 번호가 틀립니다.")
    }

    setIsVerifying(false)
  }

  // 인증코드 재발송 버튼 클릭 시
  const resendVerificationCode = async () => {
    const res = await fetch(`${API_URL}/reissueAuthCode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    if (data.totalCount === 1) {
      setVerificationError("")
      setVerificationSuccess("인증 코드가 재발송되었습니다.")
      startTimer()
    } else {
      setVerificationSuccess("")
      setVerificationError("인증 코드 재발송에 실패했습니다.")
    }
  }

  // 이메일 인증 완료 후 → 실제 회원가입 완료 처리
  const completeSignup = async () => {
    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nickname, email, phone, password }),
    })

    const data = await res.json()
    if (data.totalCount === 1) {
      // 로그인 성공 → 메인 페이지로 이동
      alert("회원가입이 완료되었습니다.")
      router.push("/user")
    } else {
      alert(data.message)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <div className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Image
                src="/placeholder.svg?height=40&width=120"
                alt="인프런 로고"
                width={120}
                height={40}
                className="h-10 mx-auto"
              />
            </Link>
            <h2 className="mt-6 text-3xl font-bold">회원가입</h2>
            <p className="mt-2 text-sm text-gray-400">인프런에서 준비된 강의를 학습해보세요</p>
          </div>

          {step === 1 ? (
            <div className="bg-gray-900 py-8 px-6 shadow-lg rounded-lg border border-gray-800">
              <form className="space-y-6" onSubmit={handleSignupSubmit}>
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    이름
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="nickname"
                      name="nickname"
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      autoComplete="nickname"
                      required
                      placeholder="홍길동"
                      className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    이메일
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="example@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">회원가입 후 이메일 인증이 필요합니다.</p>
                </div>

                <div>
                  <Label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                    전화번호
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="phone"
                      name="phone"
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="'-'없이 작성해주세요."
                      className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    비밀번호
                  </Label>
                  <div className="mt-1 relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      placeholder="********"
                      className="appearance-none block w-full px-3 py-2 pr-10 bg-gray-800 border-gray-700 text-white"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">8자 이상, 영문, 숫자, 특수문자 조합</p>
                </div>

                <div>
                  <Label htmlFor="password-confirm" className="block text-sm font-medium text-gray-300">
                    비밀번호 확인
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="password-confirm"
                      name="password-confirm"
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      autoComplete="new-password"
                      required
                      placeholder="********"
                      className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <Checkbox id="terms" required className="border-gray-600" />
                    </div>
                    <div className="ml-3 text-sm">
                      <Label htmlFor="terms" className="text-gray-300">
                        <span>
                          인프런의{" "}
                          <Link href="/terms" className="text-red-500 hover:text-red-400">
                            이용약관
                          </Link>{" "}
                          및{" "}
                          <Link href="/privacy" className="text-red-500 hover:text-red-400">
                            개인정보취급방침
                          </Link>
                          에 동의합니다.
                        </span>
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                    회원가입
                  </Button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full bg-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">또는</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                    <Image
                      src="/placeholder.svg?height=20&width=20"
                      alt="Google"
                      width={20}
                      height={20}
                      className="mr-2 h-5 w-5"
                    />
                    Google
                  </Button>
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                    <Image
                      src="/placeholder.svg?height=20&width=20"
                      alt="Kakao"
                      width={20}
                      height={20}
                      className="mr-2 h-5 w-5"
                    />
                    Kakao
                  </Button>
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                    <Image
                      src="/placeholder.svg?height=20&width=20"
                      alt="GitHub"
                      width={20}
                      height={20}
                      className="mr-2 h-5 w-5"
                    />
                    GitHub
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 py-8 px-6 shadow-lg rounded-lg border border-gray-800">
              <button onClick={() => setStep(1)} className="flex items-center text-gray-400 hover:text-white mb-4">
                <ArrowLeft className="h-4 w-4 mr-1" />
                돌아가기
              </button>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold">이메일 인증</h3>
                <p className="text-sm text-gray-400 mt-2">
                  {email}로 인증 코드를 발송했습니다.
                  <br />
                  이메일을 확인하고 아래에 인증 코드를 입력해주세요.
                </p>
              </div>

              {verificationError && (
                <Alert variant="destructive" className="mb-4 bg-red-900 border-red-800 text-white">
                  <AlertDescription>{verificationError}</AlertDescription>
                </Alert>
              )}

              {verificationSuccess && (
                <Alert className="mb-4 bg-green-900 border-green-800 text-white">
                  <AlertDescription>{verificationSuccess}</AlertDescription>
                </Alert>
              )}

              <form className="space-y-6" onSubmit={handleVerificationSubmit}>
                <div>
                  <Label htmlFor="verification-code" className="block text-sm font-medium text-gray-300">
                    인증 코드
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="verification-code"
                      name="verification-code"
                      type="text"
                      required
                      placeholder="123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-400">
                      인증 코드 유효시간:{" "}
                      <span className={timeLeft < 60 ? "text-red-500" : "text-gray-300"}>{formatTime(timeLeft)}</span>
                    </p>
                    <button
                      type="button"
                      onClick={resendVerificationCode}
                      className="text-xs text-red-500 hover:text-red-400"
                    >
                      인증 코드 재발송
                    </button>
                  </div>
                </div>

                <div>
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isVerifying}>
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        인증 중...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        인증 완료
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              이미 인프런 회원이신가요?{" "}
              <Link href="/auth/user/login" className="font-medium text-red-500 hover:text-red-400">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
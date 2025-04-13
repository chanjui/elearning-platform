"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import NetflixHeader from "@/components/netflix-header"

export default function InstructorApplySuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 text-center">
            <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-500" />
            </div>

            <h1 className="text-3xl font-bold mb-4">강사 신청이 완료되었습니다!</h1>

            <p className="text-gray-300 mb-8">
              이제부터 강사로서 활동을 시작할 수 있습니다.<br/>
              강사 대시보드에서 강의 제작과 관리가 가능합니다.
            </p>

            <Alert className="bg-gray-800 border-gray-700 mb-8">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-gray-300 text-left">
                <p className="font-medium mb-2">다음 단계:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>강사 대시보드에 접속해 강의를 등록해보세요.</li>
                  <li>강의는 등록 후 검토 과정을 거쳐 승인되며, 이후 수강생에게 공개됩니다.</li>
                  <li>승인 상태는 대시보드에서 확인하실 수 있습니다.</li>
                  <li>강의가 검토되고 승인되면 판매가 시작됩니다.</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
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

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              문의사항이 있으신가요?{" "}
              <Link href="/support" className="text-red-500 hover:underline">
                고객센터
              </Link>
              에 문의하세요.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}


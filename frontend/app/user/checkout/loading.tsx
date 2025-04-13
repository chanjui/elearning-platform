import { Skeleton } from "@/components/ui/skeleton"
import NetflixHeader from "@/components/netflix-header"

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-6 w-40 bg-gray-800" />
        </div>

        <Skeleton className="h-10 w-48 mb-8 bg-gray-800" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 결제 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 주문 상품 */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <Skeleton className="h-8 w-40 mb-4 bg-gray-800" />

              <div className="space-y-4">
                {[1, 2].map((item) => (
                  <div key={item} className="flex gap-4">
                    <Skeleton className="w-[140px] h-20 rounded bg-gray-800" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-full mb-2 bg-gray-800" />
                      <Skeleton className="h-4 w-1/3 mb-2 bg-gray-800" />
                      <Skeleton className="h-5 w-24 bg-gray-800" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 쿠폰 및 포인트 */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <Skeleton className="h-8 w-40 mb-4 bg-gray-800" />
              <Skeleton className="h-10 w-full mb-2 bg-gray-800" />
              <Skeleton className="h-10 w-full bg-gray-800" />
            </div>

            {/* 결제 수단 */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <Skeleton className="h-8 w-40 mb-4 bg-gray-800" />

              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full bg-gray-800" />
                    <Skeleton className="h-6 w-32 bg-gray-800" />
                  </div>
                ))}
              </div>
            </div>

            {/* 개인정보 제공 동의 */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <Skeleton className="h-8 w-40 mb-4 bg-gray-800" />

              <div className="space-y-2">
                <div className="flex items-start">
                  <Skeleton className="h-4 w-4 mt-1 bg-gray-800" />
                  <Skeleton className="h-6 w-32 ml-2 bg-gray-800" />
                </div>
                <Skeleton className="h-px w-full bg-gray-800" />
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start">
                    <Skeleton className="h-4 w-4 mt-1 bg-gray-800" />
                    <Skeleton className="h-5 w-64 ml-2 bg-gray-800" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 결제 금액 및 휴대폰 인증 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 결제 금액 */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <Skeleton className="h-8 w-40 mb-4 bg-gray-800" />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24 bg-gray-800" />
                  <Skeleton className="h-5 w-24 bg-gray-800" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24 bg-gray-800" />
                  <Skeleton className="h-5 w-24 bg-gray-800" />
                </div>
                <Skeleton className="h-px w-full bg-gray-800" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-32 bg-gray-800" />
                  <Skeleton className="h-6 w-32 bg-gray-800" />
                </div>

                <Skeleton className="h-10 w-full mt-4 bg-gray-800" />
                <Skeleton className="h-4 w-full mt-2 bg-gray-800" />
              </div>
            </div>

            {/* 휴대폰 인증 */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <div className="flex items-center mb-4">
                <Skeleton className="h-5 w-5 mr-2 bg-gray-800" />
                <Skeleton className="h-8 w-40 bg-gray-800" />
              </div>

              <div className="space-y-4">
                <div>
                  <Skeleton className="h-5 w-24 mb-1 bg-gray-800" />
                  <div className="flex gap-2 mt-1">
                    <Skeleton className="flex-1 h-10 bg-gray-800" />
                    <Skeleton className="h-10 w-32 bg-gray-800" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-full mb-1 bg-gray-800" />
                  <Skeleton className="h-4 w-3/4 bg-gray-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


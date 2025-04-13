import { Skeleton } from "@/components/ui/skeleton"
import NetflixHeader from "@/components/netflix-header"

export default function CartLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <main className="container mx-auto px-4 py-20">
        <div className="mb-6">
          <Skeleton className="h-4 w-32 bg-gray-800" />
        </div>

        <Skeleton className="h-10 w-48 mb-8 bg-gray-800" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 장바구니 아이템 */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-32 bg-gray-800" />
                <Skeleton className="h-5 w-24 bg-gray-800" />
              </div>

              <div className="h-px w-full bg-gray-800 mb-4" />

              <div className="space-y-4">
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <Skeleton className="h-4 w-4 rounded-sm bg-gray-800" />
                    <Skeleton className="w-[140px] h-20 rounded bg-gray-800" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-full mb-2 bg-gray-800" />
                      <Skeleton className="h-4 w-32 bg-gray-800" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-5 w-20 mb-2 bg-gray-800" />
                      <Skeleton className="h-8 w-8 rounded-full bg-gray-800" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <Skeleton className="h-6 w-32 mb-4 bg-gray-800" />
              <div className="flex gap-2">
                <Skeleton className="flex-1 h-10 bg-gray-800" />
                <Skeleton className="h-10 w-20 bg-gray-800" />
              </div>
            </div>
          </div>

          {/* 오른쪽: 결제 금액 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <Skeleton className="h-6 w-32 mb-4 bg-gray-800" />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24 bg-gray-800" />
                  <Skeleton className="h-5 w-24 bg-gray-800" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24 bg-gray-800" />
                  <Skeleton className="h-5 w-24 bg-gray-800" />
                </div>
                <div className="h-px w-full bg-gray-800" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-32 bg-gray-800" />
                  <Skeleton className="h-6 w-32 bg-gray-800" />
                </div>

                <Skeleton className="h-10 w-full mt-4 bg-gray-800" />

                <Skeleton className="h-4 w-full mt-2 bg-gray-800" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


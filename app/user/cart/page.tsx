"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2, ShoppingCart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import NetflixHeader from "@/components/netflix-header"
import useUserStore from "@/app/auth/userStore"
import { useEffect, useState } from "react"
import axios from "axios"
import { cartStore } from "../cart/cartStore"

interface CartItem {
  courseId: number
  title: string
  instructor: string
  price: number
  discountedPrice: number
  discountAmount: number
  discountRate: number
  image: string
}

interface CartDTO {
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
}

export default function CartPage() {
  const { user, restoreFromStorage } = useUserStore()
  const [cart, setCart] = useState<CartDTO | null>(null)

  // Zustand store 연결 (local state인 selectedItems 제거)
  const { cartItems, selectedItems: selectedItemsState, addToCart, removeFromCart, selectItem, deselectItem, setCartItems, toggleAll, clearSelectedItems } = cartStore()

  useEffect(() => {
    if (!user) restoreFromStorage()
  }, [])

  useEffect(() => {
    if (!user) return

    axios.get(`/api/cart`, { withCredentials: true })
      .then((res) => {
        console.log("장바구니 조회 성공", res.data)
        if (res.data.totalCount === 1) {
          setCart(res.data.data)
          // 전역 store의 cartItems도 업데이트 (이렇게 해야 CheckoutPage에서 데이터 사용 가능)
          setCartItems(res.data.data.items)
        }
      })
      .catch((err) => {
        console.error("장바구니 조회 오류", err)
      })
  }, [user])

  useEffect(() => {
    // CartPage 마운트 시 선택된 항목을 모두 초기화합니다.
    clearSelectedItems();
  }, []);

  // 전체 선택/해제 처리: store의 toggleAll 사용
  const handleToggleAll = () => {
    if (!cart) return
    toggleAll(cart.items.map((item) => item.courseId))
  }

  // 개별 강의 선택/해제 처리
  const handleToggleItem = (id: number) => {
    if (selectedItemsState.includes(id)) {
      deselectItem(id)
    } else {
      selectItem(id)
    }
  }

  // 선택 삭제 처리: store의 selectedItems 상태를 기반으로 삭제 후 clearSelectedItems 호출
  const handleRemoveSelected = async () => {
    try {
      const toRemove = selectedItemsState;
      
      // 1. store의 cartItems 업데이트
      const updatedStoreItems = cartItems.filter((item) => !toRemove.includes(item.courseId));
      setCartItems(updatedStoreItems);
      
      // 2. 로컬 상태인 cart도 업데이트
      if (cart) {
        const updatedCartItems = cart.items.filter((item) => !toRemove.includes(item.courseId));
        setCart({ ...cart, items: updatedCartItems });
      }
      
      // 3. 선택된 항목 초기화
      clearSelectedItems();
  
      // 백엔드 삭제 요청을 병렬로 보냅니다.
      await Promise.all(
        toRemove.map((courseId) =>
          axios.delete(`/api/cart/remove`, {
            data: { courseId },
            withCredentials: true,
          })
        )
      );
    } catch (error) {
      console.error("선택 삭제 오류:", error);
      // 실패 시 재조회하거나 상태 복구 로직 추가 가능
    }
  };

  // 결제 페이지로 이동하는 함수
  const handleCheckout = () => {
    console.log("Selected course IDs:", selectedItemsState); // 디버깅용 로그
    // 선택된 강의의 courseId 배열을 문자열로 변환 (예: "1,2,3")
    const courseIdsQuery = selectedItemsState.join(",");
    // 결제 페이지로 이동 (쿼리 스트링에 courseIds 전달)
    window.location.href = `/user/checkout?courseIds=${encodeURIComponent(courseIdsQuery)}`;
  }

  const formatPrice = (price: number) => new Intl.NumberFormat("ko-KR").format(price)

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다.</h1>
        <Link href="/auth/user/login">
          <Button className="bg-red-600 hover:bg-red-700">로그인 하러가기</Button>
        </Link>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white text-center py-32">
        <NetflixHeader />
        <h2 className="text-2xl font-bold mb-4">장바구니가 비어있습니다</h2>
        <p className="text-gray-400 mb-6">수강하고 싶은 강의를 담아보세요</p>
        <Link href="/">
          <Button className="bg-red-600 hover:bg-red-700">강의 보러가기</Button>
        </Link>
      </div>
    )
  }

  // 선택한 강의들만 필터링 (store의 selectedItemsState 사용)
  const selectedItemsDetail = cart.items.filter(item =>
    selectedItemsState.includes(item.courseId)
  )

  const subtotal = selectedItemsDetail.reduce((sum, item) => sum + item.price, 0);
  const selectedDiscount = selectedItemsDetail.reduce((sum, item) => sum + item.discountAmount, 0);
  const selectedTotal = subtotal - selectedDiscount;

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <main className="container mx-auto px-4 py-20">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-1" />
            계속 쇼핑하기
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <ShoppingCart className="h-6 w-6 mr-2" />
          장바구니
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Checkbox
                    checked={selectedItemsState.length === cart.items.length}
                    onCheckedChange={handleToggleAll}
                    className="border-gray-600"
                  />
                  <label className="ml-2 text-sm font-medium">전체 선택</label>
                  <span className="ml-2 text-sm font-medium text-gray-400">({cart.items.length})</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveSelected}
                  className="text-red-500 hover:text-red-400 hover:bg-gray-800"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  선택 삭제
                </Button>
              </div>

              <Separator className="mb-4 bg-gray-800" />

              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.courseId} className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedItemsState.includes(item.courseId)}
                      onCheckedChange={() => handleToggleItem(item.courseId)}
                      className="border-gray-600"
                    />
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={140}
                      height={80}
                      className="w-[140px] h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.instructor}</p>
                    </div>
                    <div className="text-right">
                      {item.discountRate > 0 ? (
                        <>
                          {/* 할인율이 있는 경우: 할인 가격, 원가, 할인율 모두 표시 */}
                          <p className="font-bold">₩{formatPrice(item.discountedPrice)}</p>
                          <p className="text-sm text-gray-400 line-through">₩{formatPrice(item.price)}</p>
                          <p className="text-sm text-green-500">{item.discountRate}% ₩{formatPrice(item.discountAmount)}</p>
                        </>
                      ) : (
                        <>
                          {/* 할인율이 0인 경우: 원가만 표시 */}
                          <p className="font-bold">₩{formatPrice(item.price)}</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 sticky top-24">
              <h2 className="text-lg font-medium mb-4">결제 금액</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">상품 금액</span>
                  <span>₩{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-green-500">
                  <span>할인 금액</span>
                  <span>-₩{formatPrice(selectedDiscount)}</span>
                </div>
                <Separator className="bg-gray-800" />
                <div className="flex justify-between font-bold text-lg">
                  <span>총 결제 금액</span>
                  <span>₩{formatPrice(selectedTotal)}</span>
                </div>

                <Link href="/user/checkout">
                  <Button 
                    className="w-full mt-4 bg-red-600 hover:bg-red-700" 
                    disabled={selectedItemsState.length === 0}
                    onClick={handleCheckout}
                  >
                    결제하기
                  </Button>
                </Link>

                <div className="text-xs text-gray-500 mt-2">
                  결제하기 버튼을 클릭하면 구매 조건을 확인하고 결제에 동의하는 것으로 간주됩니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
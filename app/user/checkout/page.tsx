"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { CreditCard, ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NetflixHeader from "@/components/netflix-header";
import { cartStore } from "../cart/cartStore";
import useUserStore from "@/app/auth/userStore";
import axios from "axios";

interface CartItem {
  courseId: number;
  title: string;
  instructor: string;
  price: number;
  discountedPrice: number;
  discountAmount: number;
  discountRate: number;
  image: string;
}

interface TermsAgreed {
  all: boolean;
  terms1: boolean;
  terms2: boolean;
  terms3: boolean;
}

interface PaymentData {
  impUid: string;
  merchantUid: string;
  expectedAmount: number;
  courseIds: number[];
  couponMappingId?: number;
}

interface Coupon {
  id: number;
  couponId: number;
  code: string;
  discount: number;
  courseId: number | null;
  courseName: string;
  regDate: string;
  isDel: boolean;
}

export default function CheckoutPage(){
  const { user, restoreFromStorage } = useUserStore();

  useEffect(() => {
    restoreFromStorage();
  }, [restoreFromStorage]);

  const { cartItems, selectedItems, removeFromCart, clearSelectedItems } = cartStore();
  const selectedItemsDetails: CartItem[] = cartItems.filter((item: CartItem) =>
    selectedItems.includes(item.courseId)
  );

  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [isLoadingCoupons, setIsLoadingCoupons] = useState<boolean>(false);
  const [couponError, setCouponError] = useState<string>("");

  const fetchAvailableCoupons = async () => {
    if (!user || selectedItems.length === 0) return;
    
    setIsLoadingCoupons(true);
    setCouponError("");
    
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setCouponError("로그인이 필요합니다.");
        setIsLoadingCoupons(false);
        return;
      }
      
      const response = await axios.get(`/api/payment/available-coupons?courseId=${selectedItems[0]}`, {
        withCredentials: true,
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setAvailableCoupons(response.data);
    } catch (error: any) {
      console.error("쿠폰 조회 중 오류 발생:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || "서버 오류가 발생했습니다.";
        setCouponError(`쿠폰 조회 실패: ${errorMessage}`);
      } else if (error.request) {
        setCouponError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setCouponError("쿠폰 조회 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoadingCoupons(false);
    }
  };

  const handleCouponCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("쿠폰 코드를 입력해주세요.");
      return;
    }

    const coupon = availableCoupons.find(c => c.code === couponCode.trim());
    if (coupon) {
      setSelectedCoupon(coupon);
      setCouponError("");
    } else {
      setCouponError("유효하지 않은 쿠폰 코드입니다.");
    }
  };

  const selectCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setCouponCode(coupon.code);
    setCouponError("");
  };

  const removeCoupon = () => {
    setSelectedCoupon(null);
    setCouponCode("");
  };

  useEffect(() => {
    if (user && selectedItems.length > 0) {
      fetchAvailableCoupons();
    }
  }, [user, selectedItems]);

  const subtotal: number = selectedItemsDetails.reduce(
    (sum: number, item: CartItem) => sum + item.price,
    0
  );
  const discount: number = selectedItemsDetails.reduce(
    (sum: number, item: CartItem) => sum + item.discountAmount,
    0
  );
  
  const couponDiscount: number = selectedCoupon ? selectedCoupon.discount : 0;
  
  const totalDiscount: number = discount + couponDiscount;
  
  const total: number = subtotal - totalDiscount;

  const formatPrice = (price: number): string =>
    new Intl.NumberFormat("ko-KR").format(price);

  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  const [termsAgreed, setTermsAgreed] = useState<TermsAgreed>({
    all: false,
    terms1: false,
    terms2: false,
    terms3: false,
  });

  const handleAllTermsChange = (checked: boolean): void => {
    setTermsAgreed({
      all: checked,
      terms1: checked,
      terms2: checked,
      terms3: checked,
    });
  };

  const handleTermChange = (term: keyof TermsAgreed, checked: boolean): void => {
    const newTerms = { ...termsAgreed, [term]: checked };
    setTermsAgreed({
      ...newTerms,
      all: newTerms.terms1 && newTerms.terms2 && newTerms.terms3,
    });
  };

  const handleCardPayment = (): void => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const IMP: any = (window as any).IMP;
    if (!IMP) {
      alert("I'mport 스크립트가 로드되지 않았습니다.");
      return;
    }
    IMP.init("imp61741237");

    const merchantUid: string = `merchant_${new Date().getTime()}`;

    IMP.request_pay(
      {
        pg: "html5_inicis.INIpayTest",
        pay_method: "card",
        merchant_uid: merchantUid,
        name: "강의 주문 결제",
        amount: total,
        buyer_name: user.nickname,
        buyer_tel: user.phone,
        buyer_email: user.email,
        buyer_addr: "서울특별시 강남구 역삼동",
      },
      (rsp: any) => {
        if (rsp.success) {
          const paymentData: PaymentData = {
            impUid: rsp.imp_uid,
            merchantUid: rsp.merchant_uid,
            expectedAmount: total,
            courseIds: selectedItems,
            couponMappingId: selectedCoupon ? selectedCoupon.id : undefined,
          };

          const token: string | null = localStorage.getItem("accessToken");
          console.log("전송되는 결제 데이터:", paymentData);
          axios
            .post("/api/payment/verify", paymentData, {
              withCredentials: true,
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              if (response.data && response.data.success) {
                axios.delete("/api/cart/remove", {
                  data: { courseIds: selectedItems },
                  withCredentials: true,
                })
                selectedItems.forEach((courseId: number) => {
                  removeFromCart(courseId);
                });
                clearSelectedItems();

                alert("결제가 성공적으로 처리되었습니다.");
                window.location.href = "/user";
              } else {
                alert("결제 검증 실패: " + response.data.message);
              }
            })
            .catch((error) => {
              console.error("결제 요청 실패:", error);
              alert("결제 요청 중 오류가 발생했습니다.");
            });
        } else {
          alert("결제 실패: " + rsp.error_msg);
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Script
        src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js"
        strategy="beforeInteractive"
      />
      <NetflixHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/user/cart"
            className="inline-flex items-center text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            장바구니로 돌아가기
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-8">결제하기</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-lg font-medium mb-4">주문 상품</h2>
              <div className="space-y-4">
                {selectedItemsDetails.map((item: CartItem) => (
                  <div key={item.courseId} className="flex gap-4">
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
                          <p className="font-bold">₩{formatPrice(item.discountedPrice)}</p>
                          <p className="text-sm text-gray-400 line-through">
                            ₩{formatPrice(item.price)}
                          </p>
                          <p className="text-sm text-green-500">
                            {item.discountRate}% ₩{formatPrice(item.discountAmount)}
                          </p>
                        </>
                      ) : (
                        <p className="font-bold">₩{formatPrice(item.price)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-lg font-medium mb-4">쿠폰 및 포인트</h2>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="coupon" className="border-gray-800">
                  <AccordionTrigger className="py-2 text-gray-200 hover:text-white">쿠폰 사용</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="쿠폰 코드 입력" 
                          className="flex-1 bg-gray-800 border-gray-700"
                          value={couponCode}
                          onChange={handleCouponCodeChange}
                        />
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-200 hover:text-white hover:bg-gray-800"
                          onClick={applyCoupon}
                        >
                          적용
                        </Button>
                      </div>
                      
                      {couponError && (
                        <div className="text-sm text-red-500 flex items-center">
                          <X className="h-4 w-4 mr-1" /> {couponError}
                        </div>
                      )}
                      
                      {selectedCoupon && (
                        <div className="bg-green-900/20 border border-green-800 rounded-md p-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-green-400">{selectedCoupon.code}</p>
                            <p className="text-sm text-gray-300">
                              {selectedCoupon.courseName} - ₩{formatPrice(selectedCoupon.discount)} 할인
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                            onClick={removeCoupon}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                      {availableCoupons.length > 0 && !selectedCoupon && (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium mb-2">사용 가능한 쿠폰</h3>
                          <div className="space-y-2">
                            {availableCoupons.map((coupon) => (
                              <div 
                                key={coupon.id}
                                className="bg-gray-800 rounded-md p-3 flex items-center justify-between cursor-pointer hover:bg-gray-750"
                                onClick={() => selectCoupon(coupon)}
                              >
                                <div>
                                  <p className="font-medium">{coupon.code}</p>
                                  <p className="text-sm text-gray-400">
                                    {coupon.courseName} - ₩{formatPrice(coupon.discount)} 할인
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {isLoadingCoupons && (
                        <div className="text-sm text-gray-400">쿠폰을 불러오는 중...</div>
                      )}
                      
                      {!isLoadingCoupons && availableCoupons.length === 0 && !selectedCoupon && (
                        <div className="text-sm text-gray-400">사용 가능한 쿠폰이 없습니다.</div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-lg font-medium mb-4">결제 수단</h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value: string) => setPaymentMethod(value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" className="border-gray-600" />
                  <Label htmlFor="card" className="flex items-center text-gray-200">
                    <CreditCard className="h-5 w-5 mr-2" />
                    신용/체크카드
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-lg font-medium mb-4">개인정보 제공 동의</h2>
              <div className="space-y-2">
                <div className="flex items-start">
                  <Checkbox
                    id="terms-all"
                    className="mt-1 border-gray-600"
                    checked={termsAgreed.all}
                    onCheckedChange={(checked) => handleAllTermsChange(checked as boolean)}
                  />
                  <Label htmlFor="terms-all" className="ml-2 font-medium text-gray-200">
                    전체 동의
                  </Label>
                </div>
                <Separator className="bg-gray-800" />
                <div className="flex items-start">
                  <Checkbox
                    id="terms-1"
                    className="mt-1 border-gray-600"
                    checked={termsAgreed.terms1}
                    onCheckedChange={(checked) => handleTermChange("terms1", checked as boolean)}
                  />
                  <Label htmlFor="terms-1" className="ml-2 text-sm text-gray-300">
                    (필수) 구매조건 및 결제 진행에 동의
                  </Label>
                </div>
                <div className="flex items-start">
                  <Checkbox
                    id="terms-2"
                    className="mt-1 border-gray-600"
                    checked={termsAgreed.terms2}
                    onCheckedChange={(checked) => handleTermChange("terms2", checked as boolean)}
                  />
                  <Label htmlFor="terms-2" className="ml-2 text-sm text-gray-300">
                    (필수) 개인정보 제3자 제공 동의
                  </Label>
                </div>
                <div className="flex items-start">
                  <Checkbox
                    id="terms-3"
                    className="mt-1 border-gray-600"
                    checked={termsAgreed.terms3}
                    onCheckedChange={(checked) => handleTermChange("terms3", checked as boolean)}
                  />
                  <Label htmlFor="terms-3" className="ml-2 text-sm text-gray-300">
                    (필수) 개인정보 수집 및 이용 동의
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 sticky top-4">
              <h2 className="text-lg font-medium mb-4">결제 금액</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">상품 금액</span>
                  <span>₩{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-green-500">
                  <span>상품 할인</span>
                  <span>-₩{formatPrice(discount)}</span>
                </div>
                {selectedCoupon && (
                  <div className="flex justify-between text-green-500">
                    <span>쿠폰 할인 ({selectedCoupon.code})</span>
                    <span>-₩{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <Separator className="bg-gray-800" />
                <div className="flex justify-between font-bold text-lg">
                  <span>총 결제 금액</span>
                  <span>₩{formatPrice(total)}</span>
                </div>
                {paymentMethod === "card" ? (
                  <Button
                    className="w-full mt-4 bg-red-600 hover:bg-red-700"
                    disabled={selectedItems.length === 0 || !termsAgreed.all}
                    onClick={handleCardPayment}
                  >
                    결제하기
                  </Button>
                ) : (
                  <Link href="/user/checkout">
                    <Button
                      className="w-full mt-4 bg-red-600 hover:bg-red-700"
                      disabled={selectedItems.length === 0 || !termsAgreed.all}
                    >
                      결제하기
                    </Button>
                  </Link>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  위 주문 내용을 확인하였으며, 결제에 동의합니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 
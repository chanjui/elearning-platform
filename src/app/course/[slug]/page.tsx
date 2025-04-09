import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const CoursePage = () => {
  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [slug, setSlug] = useState('');

  const handleInquirySubmit = async () => {
    const subjectInput = document.getElementById("inquiry-title") as HTMLInputElement;
    const contentTextarea = document.getElementById("inquiry-content") as HTMLTextAreaElement;

    const subject = subjectInput?.value.trim();
    const content = contentTextarea?.value.trim();

    if (!user) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    if (!subject || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const userId = user?.id || 14;
    const url = `/api/course/${slug}/addInquiry` +
      `?userId=${userId}` +
      `&courseId=${slug}` +
      `&subject=${subject}` +
      `&content=${content}`;

    try {
      const response = await fetch(url, {
        method: "POST",
      });

      if (!response.ok) throw new Error("서버 오류");

      alert("문의가 성공적으로 접수되었습니다.");
      subjectInput.value = "";
      contentTextarea.value = "";
    } catch (error) {
      console.error("❌ 문의 전송 실패:", error);
      alert("문의 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const addToCart = async () => {
    if (!user) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    try {
      const response = await fetch(`/api/cart/add?userId=${user.id}&courseId=${slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('장바구니 추가 실패');
      }

      const result = await response.json();
      if (result.success) {
        alert('장바구니에 추가되었습니다.');
        window.location.href = '/user/cart';
      } else {
        alert(result.message || '장바구니 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('장바구니 추가 중 오류:', error);
      alert('장바구니 추가 중 오류가 발생했습니다.');
    }
  };

  const toggleWishlist = async () => {
    // ... existing code ...
  };

  return (
    // ... existing code ...
                    {course.isEnrolled == null || !course.isEnrolled ? (
                      <>
                        <Button 
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                          onClick={addToCart}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2"/>
                          수강신청 하기
                        </Button>
// ... existing code ...
  );
};

export default CoursePage; 
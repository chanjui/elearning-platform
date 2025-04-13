"use client"
import Image from "next/image"
import { Bold, Italic, Link, List, ListOrdered, Code, ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CourseDetailedDescriptionProps {
  formData: {
    detailedDescription: string
    [key: string]: any
  }
  updateFormData: (field: string, value: any) => void
  uploadedImages: string[]
  setUploadedImages: (images: string[]) => void
  showImageUploadModal: boolean
  setShowImageUploadModal: (show: boolean) => void
  handleImageUpload: () => void
  goToPrevStep: () => void
  goToNextStep: () => void
}

export default function CourseDetailedDescription({
  formData,
  updateFormData,
  uploadedImages,
  setUploadedImages,
  showImageUploadModal,
  setShowImageUploadModal,
  handleImageUpload,
  goToPrevStep,
  goToNextStep,
}: CourseDetailedDescriptionProps) {
  
  const saveAndNext = async () => {
    if (!formData.courseId) {
      console.error("❌ courseId가 없습니다. 먼저 강의를 생성해야 합니다.");
      return;
    }
  
    try {
      const res = await fetch(`/api/courses/${formData.courseId}/detailed-description`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          detailedDescription: formData.detailedDescription,
        }),
      });
  
      if (!res.ok) throw new Error("상세 설명 저장 실패");
  
      console.log("✅ 상세 설명 저장 성공");
      goToNextStep();
    } catch (err) {
      console.error("상세 설명 저장 중 에러:", err);
    }
  };
 
 
  //  상세 설명 저장 함수
  const saveDetailedDescription = async () => {
  // courseId는 최초 강의 생성 시 저장돼야 함
  if (!formData.courseId) {
    console.error("❌ courseId 없음. 먼저 강의를 생성해야 저장 가능!");
    return; // 이 상태에서는 저장하지 않고 멈춤
  }

  // 보낼 데이터 구성 (서버는 detailedDescription만 원함)
  const payload = {
    detailedDescription: formData.detailedDescription,
  };

  try {
    // PATCH 요청 보내기
    const res = await fetch(`/api/courses/${formData.courseId}/detailed-description`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // 실패 시 에러 처리
    if (!res.ok) throw new Error("상세 설명 저장 실패");

    // 성공 시 로그 출력 + 다음 단계로 이동
    console.log("✅ 상세 설명 저장 성공");
    goToNextStep(); // 다음 단계로 이동!
  } catch (err) {
    console.error("상세 설명 저장 중 에러:", err);
  }
};
  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-800">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-6 text-white">강의 상세 설명</h2>
        <p className="text-sm text-gray-400 mb-4">강의에 대한 상세한 설명과 이미지를 추가해보세요.</p>

        <div className="mb-6">
          <div className="flex items-center gap-1 p-2 border border-gray-700 rounded-t-lg bg-gray-800">
            <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
              <Bold className="h-4 w-4" />
            </button>
            <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
              <Italic className="h-4 w-4" />
            </button>
            <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
              <Link className="h-4 w-4" />
            </button>
            <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
              <List className="h-4 w-4" />
            </button>
            <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
              <ListOrdered className="h-4 w-4" />
            </button>
            <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
              <Code className="h-4 w-4" />
            </button>
            <button
              className="p-1 hover:bg-gray-700 rounded text-gray-300"
              onClick={() => setShowImageUploadModal(true)}
            >
              <ImageIcon className="h-4 w-4" />
            </button>
          </div>

          <Textarea
            placeholder="강의에 대한 상세한 설명을 작성해주세요. 마크다운 형식을 지원합니다."
            value={formData.detailedDescription}
            onChange={(e) => updateFormData("detailedDescription", e.target.value)}
            className="min-h-[300px] rounded-t-none border-t-0 border-gray-700 bg-gray-800 text-white"
          />
        </div>

        {uploadedImages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-white">업로드된 이미지</h3>
            <div className="grid grid-cols-2 gap-4">
              {uploadedImages.map((imageUrl, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-2 bg-gray-800">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={`Uploaded image ${index + 1}`}
                    width={500}
                    height={300}
                    className="w-full h-auto rounded"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-400">이미지 {index + 1}</span>
                    <button
                      className="text-red-500 hover:text-red-400"
                      onClick={() => {
                        const newImages = [...uploadedImages]
                        newImages.splice(index, 1)
                        setUploadedImages(newImages)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          variant="outline"
          className="border-gray-700 text-gray-300 hover:bg-gray-800"
          onClick={() => setShowImageUploadModal(true)}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          이미지 추가하기
        </Button>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={goToPrevStep} className="border-gray-700 text-gray-300 hover:bg-gray-800">
          이전
        </Button>
        <Button onClick={saveAndNext} className="bg-red-600 hover:bg-red-700 text-white">
  저장 후 다음 이동
</Button>
      </div>

      {/* 이미지 업로드 모달 */}
      <Dialog open={showImageUploadModal} onOpenChange={setShowImageUploadModal}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>이미지 업로드</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-400 mb-4">이미지를 여기에 드래그하거나 파일을 선택하세요</p>
              <p className="text-xs text-gray-500 mb-4">지원 형식: JPG, PNG, GIF (최대 5MB)</p>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                파일 선택
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowImageUploadModal(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              취소
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleImageUpload}>
              업로드
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


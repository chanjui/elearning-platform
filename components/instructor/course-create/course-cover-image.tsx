"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CourseCoverImageProps {
  goToPrevStep: () => void
  goToNextStep: () => void
  updateFormData: (field: string, value: any) => void 
  formData: any
}

export default function CourseCoverImage({ goToPrevStep, goToNextStep, updateFormData, formData}: CourseCoverImageProps) {
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const reader = new FileReader()

      reader.onload = () => {
        if (typeof reader.result === "string") {
          img.src = reader.result
        }
      }

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        const width = 1200
        const height = 760
        canvas.width = width
        canvas.height = height

        ctx?.drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject(new Error("이미지 변환 실패"))
        }, "image/jpeg", 0.9)
      }

      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const getPresignedUrl = async (file: File) => {
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      })
    
      if (!res.ok) throw new Error("Presigned URL 요청 실패")
    
      return await res.json() as { uploadUrl: string; fileUrl: string }
    }
    if (!file) return

    try {
      const resizedBlob = await resizeImage(file)
      const resizedFile = new File([resizedBlob], file.name, { type: "image/jpeg" })

      // 2. Presigned URL 요청
      const { uploadUrl, fileUrl } = await getPresignedUrl(resizedFile)

      // 3. S3 업로드
      await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": resizedFile.type,
      },
      body: resizedFile,
    })
      setCoverImage(resizedFile)
      setPreviewUrl(URL.createObjectURL(resizedBlob))

      updateFormData("backImageUrl", fileUrl)
      console.log("✅ 리사이즈된 이미지:", resizedFile)
    } catch (err) {
      console.error("❌ 이미지 리사이즈 실패:", err)
    }
  }

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-800">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-6 text-white">커버 이미지</h2>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-white">강의 커버 이미지 (대표용) 업로드</h3>
          <p className="text-sm text-gray-400 mb-4">
            일반 커버 이미지(카드형태)를 제작하실 경우, 인프런 권장사항을 참고해 주세요.
            <br />
            이미지가 규격에 맞지 않을 경우, 중앙을 중심으로 잘리게 됩니다.
          </p>

          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center bg-gray-800">
          <div className="mb-4">
  <label htmlFor="coverImageUpload" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer inline-block">
    파일 선택
    <input
      id="coverImageUpload"
      type="file"
      accept="image/png, image/jpeg"
      className="hidden"
      onChange={handleFileChange}
    />
  </label>
</div>

            <p className="text-sm text-gray-400">이미지 크기: 1200 x 760px (jpg, jpeg, png 형식만 가능합니다)</p>

            {previewUrl && (
              <img
                src={previewUrl}
                alt="썸네일 미리보기"
                className="mt-4 rounded border border-gray-700 w-[300px] h-[190px] object-cover mx-auto"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={goToPrevStep} className="border-gray-700 text-gray-300 hover:bg-gray-800">
          이전
        </Button>
        <Button
  onClick={async () => {
    try {
      const res = await fetch(`/api/courses/${formData.courseId}/cover-image`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          backImageUrl: formData.backImageUrl,
        }),
      });

      if (!res.ok) throw new Error("커버 이미지 저장 실패");
      goToNextStep();
    } catch (err) {
      console.error("❌ 커버 이미지 저장 중 에러:", err);
    }
  }}
  className="bg-red-600 hover:bg-red-700 text-white"
>
  저장 후 다음 이동
</Button>
      </div>
    </div>
  )
}
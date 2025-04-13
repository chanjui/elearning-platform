"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { set } from "date-fns"

interface AddLectureModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  formData: any
  updateFormData: (field: string, value: any) => void
  activeSectionIndex: number | null
}

export default function AddLectureModal({
  open,
  setOpen,
  formData,
  updateFormData,
  activeSectionIndex,
}: AddLectureModalProps) {
  const [title, setTitle] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)

  useEffect(() => {
    console.log("📦 AddLectureModal 렌더됨! open 상태:", open)
  }, [open])
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
      }
    }
  
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        document.getElementById("lectureTitleInput")?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [open])

  const handleClose = (open: boolean) => {
   setOpen(open)
  }

  const handleAdd = async () => {
    if (activeSectionIndex === null) {
      alert("어느 섹션에 수업을 추가할지 알 수 없습니다.");
      return;
    }
   

    if (!title.trim()) {
      alert("수업 제목을 입력해주세요.")
      return
    }
  
    if (!videoFile) {
      alert("영상을 선택해주세요.")
      return
    }
  
    let uploadUrl = ""
    let fileUrl = ""
  
    try {
      console.log("🔥 Presigned URL 요청 시작")
  
      const presignedRes = await fetch("/api/upload-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: videoFile.name,
          fileType: videoFile.type,
        }),
      })
  
      if (!presignedRes.ok) {
        const errorText = await presignedRes.text()
        throw new Error(`presigned URL 요청 실패: ${presignedRes.status} - ${errorText}`)
      }
  
      const json = await presignedRes.json()
      uploadUrl = json.uploadUrl
      fileUrl = json.fileUrl
  
      console.log("✅ presigned URL 응답 확인:", { uploadUrl, fileUrl })
    } catch (err) {
      console.error("❌ presigned URL 요청 에러", err)
      alert("presigned URL 요청 중 오류 발생")
      return // ❗ 실패 시 이후 로직 중단
    }
  
    try {
      await fetch(uploadUrl, {
        method: "PUT",
        body: videoFile,
        headers: {
          "Content-Type": videoFile.type,
        },
      })
  
      const newLecture = {
        title,
        videoUrl: fileUrl,
        duration: "0",
      }
      
  
      const updated = formData.curriculum.map((section: any, index: number) => {
        if (index === activeSectionIndex) {
          return {
            ...section,
            lectures: [...section.lectures, newLecture],
          }
        }
        return section
      });
  
      updateFormData("curriculum", updated)
  
      setTitle("")
      setVideoFile(null)
      setOpen(false)
    } catch (err) {
      console.error("영상 업로드 실패", err)
      alert("영상 업로드 중 오류가 발생했습니다.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="z-[9999]">
        <DialogHeader>
          <DialogTitle>수업 추가</DialogTitle>
          <DialogDescription>업로드할 수업 정보를 입력해주세요.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <label className="block text-sm font-medium mb-2">수업 제목</label>
          <Input
            id="lectureTitleInput"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="첫번째 수업을 만들어주세요."
            className="border-gray-700 bg-gray-800 text-white mb-4"
          />

          <label className="block text-sm font-medium mb-2">영상 업로드</label>
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-400 mb-2">
              최대 5GB (.mp4, .mkv, .m4v, .mov 만 가능), 최소 720p 이상
            </p>
            <input
              type="file"
              accept="video/mp4,video/mkv,video/m4v,video/quicktime"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="text-sm text-gray-300"
            />
            {videoFile && <p className="mt-2 text-sm text-green-400">✅ {videoFile.name}</p>}
            {videoFile && (
              <video
                src={URL.createObjectURL(videoFile)}
                controls
                className="mt-4 rounded-md border border-gray-700 w-full max-h-[300px]"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() =>  handleClose(false)}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            취소
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleAdd}>
            추가
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
"use client"

import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import AddLectureModal from "@/components/instructor/course-create/add-lecture-modal"

interface CourseCurriculumProps {
  formData: {
    curriculum: {
      title: string
      lectures: {
        title: string
        videoUrl: string
        duration: number
      }[]
    }[]
    [key: string]: any
  }
  updateFormData: (field: string, value: any) => void
  setOpenSectionModal: (open: boolean) => void
  openLectureModal: boolean 
  setOpenLectureModal: (open: boolean) => void
  goToPrevStep: () => void
  goToNextStep: () => void
}

export default function CourseCurriculum({
  formData,
  updateFormData,
  setOpenSectionModal,
  openLectureModal,
  setOpenLectureModal,
  goToPrevStep,
  goToNextStep,
}: CourseCurriculumProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editedTitle, setEditedTitle] = useState("")
  const [editingLecture, setEditingLecture] = useState<{ sectionIndex: number; lectureIndex: number } | null>(null)
  const [editedLectureTitle, setEditedLectureTitle] = useState("")

  const startEditing = (index: number) => {
    setEditingIndex(index)
    setEditedTitle(formData.curriculum[index].title)
  }

  const cancelEditing = () => setEditingIndex(null)
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  const saveEditedTitle = () => {
    if (editingIndex === null) return
    const updated = [...formData.curriculum]
    updated[editingIndex].title = editedTitle
    updateFormData("curriculum", updated)
    setEditingIndex(null)
  }

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-800">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-6 text-white">커리큘럼</h2>

        {formData.curriculum.map((section, sectionIndex) => (
          <div key={sectionIndex} className="border border-gray-700 rounded-lg mb-6 bg-gray-800">
            <div className="bg-gray-800 p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                {editingIndex === sectionIndex ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="bg-gray-700 px-2 py-1 text-white rounded"
                    />
                    <Button size="sm" onClick={saveEditedTitle}
                     className="bg-red-600 hover:bg-red-700 text-white"
                    >저장</Button>
                    <Button size="sm" variant="outline" onClick={cancelEditing}>취소</Button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-medium text-white">{section.title}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        className="text-gray-400 hover:text-white"
                        onClick={() => startEditing(sectionIndex)}
                      >
                        ✏️
                      </button>
                      <button
                        className="text-gray-400 hover:text-gray-200"
                        onClick={() => {
                          const updated = [...formData.curriculum]
                          updated.splice(sectionIndex, 1)
                          updateFormData("curriculum", updated)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                <div className="w-8">순서</div>
                <div className="flex-1">수업을 만들어주세요.</div>
                <div className="w-20"></div>
              </div>

              {section.lectures.length > 0 ? (
  section.lectures.map((lecture, lectureIndex) => (
    <div key={lectureIndex} className="flex items-center gap-4 py-2 border-b border-gray-700">
      <div className="w-8 text-center text-gray-400">{lectureIndex + 1}</div>

      <div className="flex-1 text-white flex items-center gap-4">
        {/* 썸네일 */}
        {lecture.videoUrl && (
          <video
            src={lecture.videoUrl}
            className="w-28 h-16 object-cover rounded border border-gray-700"
            muted
            preload="metadata"
          />
        )}

        {/* 수업 제목 */}
        {editingLecture &&
 editingLecture.sectionIndex === sectionIndex &&
 editingLecture.lectureIndex === lectureIndex ? (
  <div className="flex flex-col gap-2 w-full">
    <input
      type="text"
      value={editedLectureTitle}
      onChange={(e) => setEditedLectureTitle(e.target.value)}
      className="bg-gray-700 px-2 py-1 text-white rounded w-full"
    />
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => {
          const updated = [...formData.curriculum]
          updated[sectionIndex].lectures[lectureIndex].title = editedLectureTitle
          updateFormData("curriculum", updated)
          setEditingLecture(null)
        }}
        className="text-green-400 hover:text-green-600 text-sm"
      >
        저장
      </button>
      <button
        onClick={() => setEditingLecture(null)}
        className="text-gray-400 hover:text-gray-200 text-sm"
      >
        취소
      </button>
    </div>
  </div>
) : (
  <span>{lecture.title || "제목 없음"}</span>
)}
      </div>

      <div className="w-20 flex justify-end gap-1">
      <button
  className="text-gray-400 hover:text-gray-200"
  onClick={() => {
    setEditingLecture({ sectionIndex, lectureIndex })     // 어떤 수업을 수정 중인지 저장
    setEditedLectureTitle(lecture.title)                  // 기존 제목을 input에 넣기
  }}
>
  ✏️
</button>
        <button
          className="text-gray-400 hover:text-gray-200"
          onClick={() => {
              const updated = [...formData.curriculum]
    const section = { ...updated[sectionIndex] }
    section.lectures = section.lectures.filter((_, i) => i !== lectureIndex)
    updated[sectionIndex] = section
    updateFormData("curriculum", updated)
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  ))
) : (
  <div className="text-center py-4 text-gray-400">아직 수업이 없습니다.</div>
)}

              <div className="flex justify-center mt-4">
              <Button
  onClick={() => {
    if (formData.curriculum.length === 0) {
      alert("먼저 섹션을 추가해주세요.")
      return
    }
    setActiveSectionIndex(sectionIndex);
    setOpenLectureModal(true);
  }}
   className="bg-red-600 hover:bg-red-700 text-white"
>
  <Plus className="h-4 w-4 mr-1" /> 수업 추가
</Button>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
          onClick={() => setOpenSectionModal(true)}
        >
          <Plus className="h-4 w-4 mr-1" /> 섹션 추가
        </Button>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={goToPrevStep} className="border-gray-700 text-gray-300 hover:bg-gray-800">
          이전
        </Button>
        <Button
  onClick={async () => {
    if (!formData.courseId) {
      alert("먼저 강의를 생성해주세요.")
      return
    }

    // ✅ 백엔드에 맞는 payload 생성
    const payload = {
      sections: formData.curriculum.map((section: any) => ({
        title: section.title,
        subject: section.title,
        lectures: section.lectures.map((lecture: any) => ({
          title: lecture.title,
          videoUrl: lecture.videoUrl,
          duration: Number(lecture.duration),
        })),
      })),
    }

    try {
      const res = await fetch(`/api/courses/${formData.courseId}/curriculum`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("커리큘럼 저장 실패")

      alert("✅ 커리큘럼이 저장되었습니다.")
      goToNextStep()
    } catch (err) {
      console.error("❌ 커리큘럼 저장 오류:", err)
      alert("커리큘럼 저장 중 문제가 발생했습니다.")
    }
  }}
  className="bg-red-600 hover:bg-red-700 text-white"
>
  저장 후 다음 이동
</Button>
      </div>
      <AddLectureModal
  open={openLectureModal}
  setOpen={(open) => {
    setOpenLectureModal(open);
    if (!open) setActiveSectionIndex(null); // ✅ 닫을 때 초기화!
  }}
  formData={formData}
  updateFormData={updateFormData}
  activeSectionIndex={activeSectionIndex}
/>
    </div> 
  )
}

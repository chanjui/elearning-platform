"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AddSectionModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  newSectionTitle: string
  setNewSectionTitle: (title: string) => void
  formData: {
    curriculum: {
      title: string
      lectures: any[]
    }[]
  }
  updateFormData: (field: string, value: any) => void
}

export default function AddSectionModal({
  open,
  setOpen,
  newSectionTitle,
  setNewSectionTitle,
  formData,
  updateFormData,
}: AddSectionModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>섹션 추가</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <label className="block text-sm font-medium mb-2">제목</label>
          <Input
            placeholder="섹션을 입력해주세요."
            className="border-gray-700 bg-gray-800 text-white"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            취소
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              // 새 섹션 추가
              const updatedCurriculum = [
                ...formData.curriculum,
                {
                  title: newSectionTitle,
                  lectures: [],
                },
              ]
              updateFormData("curriculum", updatedCurriculum)
              setOpen(false)
              // 다음 섹션 번호 준비
              const nextSectionNumber = updatedCurriculum.length + 1
              setNewSectionTitle(`섹션 ${nextSectionNumber}`)
            }}
          >
            추가
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


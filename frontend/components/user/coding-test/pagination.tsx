"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const [pageInputValue, setPageInputValue] = useState(currentPage.toString())

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always include first page
      pageNumbers.push(1)

      // Calculate start and end of page range
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at the beginning
      if (currentPage <= 2) {
        endPage = 4
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push("...")
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...")
      }

      // Always include last page
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        className="border-gray-700 text-gray-300 hover:bg-gray-800"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        이전
      </Button>

      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className={`border-gray-700 ${currentPage === page ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800"}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ) : (
          <span key={index} className="text-gray-500 px-1">
            ...
          </span>
        ),
      )}

      <Button
        variant="outline"
        size="sm"
        className="border-gray-700 text-gray-300 hover:bg-gray-800"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        다음
      </Button>
    </div>
  )
}


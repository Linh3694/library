import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPrevNext?: boolean
  showFirstLast?: boolean
  maxVisiblePages?: number
  className?: string
}

const Pagination = React.forwardRef<
  HTMLDivElement,
  PaginationProps
>(({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showPrevNext = true, 
  showFirstLast = false,
  maxVisiblePages = 5,
  className,
  ...props 
}, ref) => {
  const getVisiblePages = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= maxVisiblePages) {
      // Hiển thị tất cả trang nếu ít hơn maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2)
      let start = Math.max(1, currentPage - halfVisible)
      const end = Math.min(totalPages, start + maxVisiblePages - 1)
      
      // Điều chỉnh start nếu end đã đạt totalPages
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1)
      }
      
      // Thêm trang đầu và dấu ... nếu cần
      if (start > 1) {
        pages.push(1)
        if (start > 2) {
          pages.push('...')
        }
      }
      
      // Thêm các trang trong khoảng visible
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      // Thêm dấu ... và trang cuối nếu cần
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...')
        }
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center gap-2", className)}
      {...props}
    >
      {/* Previous Button */}
      {showPrevNext && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={cn(
            "w-9 h-9 p-0 rounded-full border-gray-200",
            currentPage === 1 && "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      )}

      {/* First Page Button */}
      {showFirstLast && currentPage > 3 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            className="w-9 h-9 p-0 rounded-full border-gray-200"
          >
            1
          </Button>
          {currentPage > 4 && (
            <div className="flex items-center justify-center w-9 h-9">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
          )}
        </>
      )}

      {/* Page Numbers */}
      {visiblePages.map((page, index) => {
        if (page === '...') {
          return (
            <div key={`ellipsis-${index}`} className="flex items-center justify-center w-9 h-9">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
          )
        }

        const pageNumber = page as number
        const isActive = pageNumber === currentPage

        return (
          <Button
            key={pageNumber}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(pageNumber)}
            className={cn(
              "w-9 h-9 p-0 rounded-full",
              isActive 
                ? "bg-[#002855] text-white border-[#002855] hover:bg-[#002855]/90" 
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            )}
          >
            {pageNumber}
          </Button>
        )
      })}

      {/* Last Page Button */}
      {showFirstLast && currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && (
            <div className="flex items-center justify-center w-9 h-9">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="w-9 h-9 p-0 rounded-full border-gray-200"
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next Button */}
      {showPrevNext && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={cn(
            "w-9 h-9 p-0 rounded-full border-gray-200",
            currentPage === totalPages && "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
})

Pagination.displayName = "Pagination"

export { Pagination } 
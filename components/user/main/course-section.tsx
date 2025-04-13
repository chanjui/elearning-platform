import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import CourseCard from "../../course-card"

interface Course {
  id: number
  subject: string
  instructor: string | null
  price: number
  thumbnailUrl: string
  originalPrice?: number
  discountRate?: number
  rating?: number
  students?: number
  isNew?: boolean
  isUpdated?: boolean
}

interface CourseSectionProps {
  title?: string
  link?: string
  courses: Course[]
  scrollable?: boolean
  carouselRef?: React.RefObject<HTMLDivElement | null>
  onScrollLeft?: () => void
  onScrollRight?: () => void
  showHeader?: boolean
  sectionId?: string
}

export default function CourseSection({
  title,
  link,
  courses,
  scrollable = false,
  carouselRef,
  onScrollLeft,
  onScrollRight,
  showHeader = true,
  sectionId = "default",
}: CourseSectionProps) {
  return (
    <section className={showHeader ? "py-16 bg-black" : "bg-black"}> 
      <div className="container mx-auto px-4">
        {showHeader && title && (
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">{title}</h2>
                {link && (
                    <Link href={link} className="text-red-500 hover:text-red-400 flex items-center group">
                        더 보기
                        <ChevronRight className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" />
                    </Link>
                )}
            </div>
        )}

        {scrollable && carouselRef && onScrollLeft && onScrollRight ? (
          <div className="relative">
            <button
              onClick={onScrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all"
              aria-label="이전 슬라이드"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <div ref={carouselRef} className="flex gap-6 overflow-x-auto pb-4 carousel hide-scrollbar">
              {courses.map((course, index) => (
                <Link key={`${sectionId}-scroll-${course.id}-${index}`} href={`user/course/${course.id}`}>
                  <div className="flex-none w-[280px] transition-transform hover:scale-105 duration-300">
                    <CourseCard
                      thumbnail={course.thumbnailUrl || "/placeholder.svg"}
                      subject={course.subject}
                      instructor={course.instructor}
                      price={course.price}
                      originalPrice={course.originalPrice}
                      discountRate={course.discountRate}
                      rating={course.rating}
                      students={course.students ?? 0}
                      isNew={course.isNew}
                      isUpdated={course.isUpdated}
                    />
                  </div>
                </Link>
              ))}
            </div>

            <button
              onClick={onScrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all"
              aria-label="다음 슬라이드"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {courses.map((course, index) => (
              <Link key={`${sectionId}-grid-${course.id}-${index}`} href={`user/course/${course.id}`}>
                <div className="transition-transform hover:scale-105 duration-300">
                  <CourseCard
                    thumbnail={course.thumbnailUrl || "/placeholder.svg"}
                    subject={course.subject}
                    instructor={course.instructor}
                    price={course.price}
                    originalPrice={course.originalPrice}
                    discountRate={course.discountRate}
                    rating={course.rating}
                    students={course.students ?? 0}
                    isNew={course.isNew}
                    isUpdated={course.isUpdated}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
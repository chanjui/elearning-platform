"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Star } from "lucide-react"
import Link from "next/link"

export interface SliderData {
  courseId: number
  subject: string
  sectionTitle?: string | null
  category: string
  techStack: string
  instructor: string
  description: string
  backImageUrl?: string | null
  target: string
  rating: number
  totalStudents: number
  progress?: number
}

export default function slider({ slides }: { slides: SliderData[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <section className="relative h-[85vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.courseId}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
          <Image
            src={slide.backImageUrl || "/placeholder.svg"}
            alt={slide.subject}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="container mx-auto px-4 h-full flex items-center relative z-20">
            <div className="max-w-2xl">
              <div
                className={`transition-all duration-500 ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <Badge className="mb-4 bg-red-600 hover:bg-red-700">
                  {slide.category}
                </Badge>
                <h1 className="text-4xl font-bold mb-4">{slide.subject}</h1>
                <p className="text-lg text-gray-300 mb-6">{slide.description}</p>
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{slide.rating.toFixed(1)}</span>
                    <span className="text-gray-400 ml-1">
                      ({slide.totalStudents}명)
                    </span>
                  </div>
                  <div className="text-gray-400">|</div>
                  <div className="text-gray-300">{slide.instructor}</div>
                  <div className="text-gray-400">|</div>
                  <div className="text-gray-300">{slide.target}</div>
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {slide.techStack.split(", ").map((tag) => (
                    <Badge key={tag} variant="outline" className="border-gray-600">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {slide.sectionTitle && (
                  <div className="text-sm text-gray-400 mb-6">
                    <p>현재 학습중: {slide.sectionTitle}</p>
                    {typeof slide.progress === "number" && (
                      <p className="mt-1">진행률: {(slide.progress * 100).toFixed(0)}%</p>
                    )}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Play className="h-4 w-4 mr-2" /> 무료 맛보기
                  </Button>
                  <Link href={`/user/course/${slide.courseId}`}>
                    <Button
                      variant="outline"
                      className="border-gray-600 hover:bg-gray-800"
                    >
                      자세히 보기
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-red-600 w-6" : "bg-gray-600"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  )
}
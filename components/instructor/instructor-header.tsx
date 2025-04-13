"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InstructorHeader() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? "bg-black" : "bg-gradient-to-b from-black/80 to-transparent"}`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/user" className="text-primary font-bold text-2xl">
              <Image
                src="/placeholder.svg?height=40&width=120"
                alt="인프런 로고"
                width={120}
                height={40}
                className="h-8"
              />
            </Link>

            <nav className="hidden md:flex space-x-6">
              <Link href="/instructor" className="font-bold text-red-500">
                대시보드
              </Link>
              <Link href="/instructor/courses" className="text-white hover:text-gray-300">
                내 강의
              </Link>
              <Link href="/instructor/analytics" className="text-white hover:text-gray-300">
                통계
              </Link>
              <Link href="/instructor/earnings" className="text-white hover:text-gray-300">
                수익
              </Link>
              <Link href="/instructor/community" className="text-white hover:text-gray-300">
                커뮤니티
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white">
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="text-white">
              <Bell className="h-5 w-5" />
            </Button>

            <Button variant="ghost" className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-md bg-red-600 flex items-center justify-center">
                <span className="font-bold">I</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}


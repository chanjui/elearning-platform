import type React from "react"

export default function InstructorLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="min-h-screen bg-black text-white">{children}</div>
}


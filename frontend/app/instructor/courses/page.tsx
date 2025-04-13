import { redirect } from "next/navigation"

export default function CoursesRedirectPage() {
  redirect("/instructor/courses/manage")
}


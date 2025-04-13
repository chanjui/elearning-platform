import {
  Search,
  BookOpen,
  Map,
  Gamepad2,
  Database,
  Code,
  Heart,
  Briefcase,
  ShoppingBag,
  Headphones,
  Building,
  Pencil,
  FolderArchive,
} from "lucide-react"

export default function CategoryNav() {
  const categories = [
    { icon: Search, name: "검색" },
    { icon: BookOpen, name: "전체" },
    { icon: Map, name: "개발 · 프로그래밍" },
    { icon: Gamepad2, name: "게임 개발" },
    { icon: Database, name: "데이터 사이언스" },
    { icon: Code, name: "인공지능" },
    { icon: Heart, name: "보안 · 네트워크" },
    { icon: Briefcase, name: "커리어" },
    { icon: ShoppingBag, name: "디자인 · 어트" },
    { icon: Headphones, name: "기획 · 경영 · 마케팅" },
    { icon: Building, name: "업무 생산성" },
    { icon: Pencil, name: "자격증 · 시험대비" },
    { icon: FolderArchive, name: "대학 교육" },
  ]

  return (
    <div className="bg-black py-4">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto py-2 gap-4 no-scrollbar">
          {categories.map((category, index) => (
            <a key={index} href="#" className="flex flex-col items-center min-w-[60px] text-center text-sm">
              <div className="p-2 rounded-full">
                <category.icon className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1">{category.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}


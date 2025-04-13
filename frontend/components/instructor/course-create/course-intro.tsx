// "use client"

// import { Bold, Italic, Link, List, ListOrdered, Code, ImageIcon } from "lucide-react"
// import { Button } from "@/components/ui/button"

// interface CourseIntroProps {
//   goToPrevStep: () => void
//   goToNextStep: () => void
// }

// export default function CourseIntro({ goToPrevStep, goToNextStep }: CourseIntroProps) {
//   return (
//     <div className="bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-800">
//       <div className="mb-6">
//         <h2 className="text-xl font-bold mb-6 text-white">상세소개</h2>
//         <p className="text-sm text-gray-400 mb-4">200자 이상 작성</p>

//         <div className="border border-gray-700 rounded-lg mb-6 bg-gray-800">
//           <div className="flex items-center gap-1 p-2 border-b border-gray-700 bg-gray-800">
//             <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
//               <Bold className="h-4 w-4" />
//             </button>
//             <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
//               <Italic className="h-4 w-4" />
//             </button>
//             <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
//               <Link className="h-4 w-4" />
//             </button>
//             <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
//               <List className="h-4 w-4" />
//             </button>
//             <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
//               <ListOrdered className="h-4 w-4" />
//             </button>
//             <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
//               <Code className="h-4 w-4" />
//             </button>
//             <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
//               <ImageIcon className="h-4 w-4" />
//             </button>
//           </div>

//           <div className="p-4 min-h-[300px]">
//             <p className="text-gray-400">본문을 작성할 수 있어요</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-between">
//         <Button variant="outline" onClick={goToPrevStep} className="border-gray-700 text-gray-300 hover:bg-gray-800">
//           이전
//         </Button>
//         <Button onClick={goToNextStep} className="bg-red-600 hover:bg-red-700 text-white">
//           저장 후 다음 이동
//         </Button>
//       </div>
//     </div>
//   )
// }


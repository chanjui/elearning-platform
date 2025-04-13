import type {CSSProperties} from "react";
import {useEffect, useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Progress} from "@/components/ui/progress";
import useUserStore from "@/app/auth/userStore";
import {Button} from "@/components/ui/button";
import {CheckCircle, Play, Send} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";

const scrollStyles: CSSProperties = {
  overflowY: "auto",
  flexGrow: 1,
  scrollbarWidth: "none",     // Firefox
  msOverflowStyle: "none",    // IE/Edge
};

const scrollbarStyle = `
  .scroll-hidden::-webkit-scrollbar {
    display: none;
  }
`;

interface Lecture {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}

interface Section {
  id: number;
  title: string;
  lectures: Lecture[];
}

interface Question {
  id: number;
  subject: string;
  content: string;
  date: string;
  comments: {
    id: number;
    userId: number;
    user: string;
    content: string;
    editDate: string;
  }[];
}

interface Memo {
  id: number;
  userId: number;
  lectureVideoId: number;
  lectureVideoTitle: String;
  memo: string;
  updatedAt: string;
}

interface CourseData {
  completedLectures: number;
  totalLectures: number;
  progress: number;
  curriculum: Section[];
  questions: Question[];
  lectureMemos: Memo[];
}

interface SidebarProps {
  courseId: number;
  setCurrentLectureId: (id: number) => void;
  currentLectureId: number | null;
}

export default function Sidebar({courseId, setCurrentLectureId, currentLectureId}: SidebarProps) {
  const [course, setCourse] = useState<CourseData | null>(null);
  const [sidebarTab, setSidebarTab] = useState("curriculum");
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [newMemoContent, setNewMemoContent] = useState("");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showMemoForm, setShowMemoForm] = useState(false);
  const [currentLecture, setCurrentLecture] = useState<Lecture>();
  const {user, restoreFromStorage} = useUserStore();
  const API_URL = `/api/course`;

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/${courseId}/part?userId=${user?.id}`);
      const data = await response.json();
      setCourse(data.data);
    } catch (error) {
      console.error("❌ Failed to fetch course data", error);
    }
  };

  useEffect(() => {
    fetchData().then(() => restoreFromStorage());
  }, [courseId]);

  useEffect(() => {
    if (!course) return;
    const section = course.curriculum.find(section =>
      section.lectures.some(lec => lec.id === currentLectureId)
    );
    const lecture = section?.lectures.find(lec => lec.id === currentLectureId);
    if (lecture) {
      setCurrentLecture(lecture);
    }
  }, [currentLectureId, course]);

  const submitQuestion = async () => {
    if (!newQuestionTitle.trim() || !newQuestionContent.trim()) return;
    try {
      const response = await fetch(`${API_URL}/question`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          userId: user?.id,
          courseId,
          subject: newQuestionTitle,
          content: newQuestionContent,
        }),
      });
      if (!response.ok) throw new Error(`Failed to submit question`);
      await fetchData();
      setNewQuestionTitle("");
      setNewQuestionContent("");
      setShowQuestionForm(false);
    } catch (error) {
      console.error("❌ Failed to submit question", error);
    }
  };

  function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    } else {
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
  }


  const submitMemo = async () => {
    if (!newMemoContent.trim() || !currentLecture?.id) return;
    try {
      const response = await fetch(`${API_URL}/memo`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          userId: user?.id,
          lectureVideoId: currentLecture.id,
          memo: newMemoContent,
        }),
      });
      if (!response.ok) throw new Error(`Failed to submit memo`);
      await fetchData();
      setNewMemoContent("");
      setShowMemoForm(false);
    } catch (error) {
      console.error("❌ Failed to submit memo", error);
    }
  };

  if (!course) return <div className="text-gray-400">Loading...</div>;

  return (
    <aside className="w-80 h-full border-r border-gray-800 bg-gray-900 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-800 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-400">진행률</div>
          <div className="text-sm font-medium">
            {course.completedLectures}/{course.totalLectures} 강의
          </div>
        </div>
        <Progress value={course.progress} className="h-2 bg-gray-800"/>
      </div>

      <div className="scroll-hidden" style={scrollStyles}>
        <style>{scrollbarStyle}</style>
        <Tabs value={sidebarTab} onValueChange={setSidebarTab}>
          <TabsList className="w-full bg-gray-900 border-b border-gray-800 flex sticky top-0 z-10">
            <TabsTrigger value="curriculum" className="flex-1">커리큘럼</TabsTrigger>
            <TabsTrigger value="questions" className="flex-1">질문</TabsTrigger>
            <TabsTrigger value="memos" className="flex-1">메모</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum" className="p-4">
            {course.curriculum.map((section) => (
              <div key={section.id} className="mb-4">
                <h3 className="font-medium mb-2 text-gray-300">{section.title}</h3>
                <div className="space-y-1">
                  {section.lectures.map((lecture) => (
                    <button
                      key={lecture.id}
                      className={`w-full text-left p-2 rounded-md flex items-center text-sm ${
                        currentLecture?.id === lecture.id
                          ? "bg-gray-800 text-white"
                          : "hover:bg-gray-800 text-gray-300"
                      }`}
                      onClick={() => {
                        setCurrentLecture(lecture);
                        setCurrentLectureId(lecture.id);
                      }}
                    >
                      {lecture.completed ? (
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500"/>
                      ) : (
                        <Play className="h-4 w-4 mr-2 text-gray-400"/>
                      )}
                      <div className="flex-1 truncate">{lecture.title}</div>
                      <div className="text-xs text-gray-500">{formatDuration(Number(lecture.duration))}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* 질문 탭 */}
          <TabsContent
            value="questions"
            className={`${
              sidebarTab !== "questions" ? "hidden" : "p-4 flex flex-col h-full"
            }`}
          >
            <Button
              variant="outline"
              className="mb-4"
              onClick={() => setShowQuestionForm(!showQuestionForm)}
            >
              {showQuestionForm ? "작성 닫기" : "새 질문 작성"}
            </Button>

            {showQuestionForm && (
              <div className="mb-4">
                <Input
                  placeholder="질문 제목"
                  className="bg-gray-800 border-gray-700 text-white mb-3"
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                />
                <Textarea
                  placeholder="질문 내용을 작성해주세요..."
                  className="bg-gray-800 border-gray-700 text-white min-h-[150px]"
                  value={newQuestionContent}
                  onChange={(e) => setNewQuestionContent(e.target.value)}
                />
                <Button className="bg-red-600 hover:bg-red-700 mt-3" onClick={submitQuestion}>
                  <Send className="h-4 w-4 mr-1"/> 질문하기
                </Button>
              </div>
            )}

            <h3 className="font-medium text-gray-300 mb-2">내 질문 목록</h3>
            <div className="overflow-y-auto space-y-2 pr-1">
              {course.questions.length === 0 ? (
                <p className="text-gray-500">아직 등록된 질문이 없습니다.</p>
              ) : (
                course.questions.map((q) => (
                  <div key={q.id} className="border border-gray-800 rounded-md p-3 bg-gray-800/50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-lg">{q.subject}</h4>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${q.comments?.length ? "bg-green-600" : "bg-yellow-600"}`}>
                        {q.comments?.length ? "답변완료" : "대기중"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{q.date}</p>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-3">{q.content}</p>
                    {q.comments?.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-700">
                        <p className="text-xs text-gray-400 mb-1">답변 {q.comments.length}개</p>
                        {q.comments.map((reply) => (
                          <div key={reply.id} className="text-xs text-gray-300 pl-2 border-l-2 border-gray-700 mt-1">
                            <p className="font-medium text-green-400">{reply.user}</p>
                            <p className="line-clamp-2">{reply.content}</p>
                            <p className="text-gray-400 text-xs mt-1">{reply.editDate}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* 메모 탭 */}
          <TabsContent
            value="memos"
            className={`${
              sidebarTab !== "memos" ? "hidden" : "p-4 flex flex-col h-full"
            }`}
          >
            <Button
              variant="outline"
              className="mb-4"
              onClick={() => setShowMemoForm(!showMemoForm)}
            >
              {showMemoForm ? "작성 닫기" : "새 메모 작성"}
            </Button>

            {showMemoForm && (
              <div className="mb-4">
                <Textarea
                  placeholder="메모 내용을 작성해주세요..."
                  className="bg-gray-800 border-gray-700 text-white min-h-[150px]"
                  value={newMemoContent}
                  onChange={(e) => setNewMemoContent(e.target.value)}
                />
                <Button className="bg-blue-600 hover:bg-blue-700 mt-3" onClick={submitMemo}>
                  <Send className="h-4 w-4 mr-1"/> 메모 저장
                </Button>
              </div>
            )}

            <h3 className="font-medium text-gray-300 mb-2">내 메모 목록</h3>
            <div className="overflow-y-auto space-y-2 pr-1">
              {course.lectureMemos?.length === 0 || !course.lectureMemos ? (
                <p className="text-gray-500">아직 등록된 메모가 없습니다.</p>
              ) : (
                course.lectureMemos.map((memo) => (
                  <div key={memo.id} className="border border-gray-800 rounded-md p-3 bg-gray-800/50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-lg">{memo.lectureVideoTitle}</h4>
                      <span className="text-xs text-gray-400">{memo.updatedAt}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-3">{memo.memo}</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </aside>
  );
}

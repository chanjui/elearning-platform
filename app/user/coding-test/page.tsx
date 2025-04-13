"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Search, Filter, Users, Check, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import NetflixHeader from "@/components/netflix-header"
import Pagination from "@/components/user/coding-test/pagination"
import useUserStore from "@/app/auth/userStore"

// 타입 정의
interface ProblemData {
  id: number
  title: string
  difficulty: "EASY" | "MEDIUM" | "HARD"
  description: string
  inputExample: string
  outputExample: string
  participants: number
  successRate: number
  status: "SUCCESS" | "FAIL" | "NOT_ATTEMPTED"
}

interface CodingTest {
  id: number
  title: string
  difficulty: string
  participants: number
  successRate: number
  status: "SUCCESS" | "FAIL" | "NOT_ATTEMPTED"
}

// 사용자 진행률 타입 정의 수정
interface UserProgress {
  totalProblems: number;
  solvedProblems: number;
  progressRate: number;
}

export default function CodingTestPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [codingTests, setCodingTests] = useState<CodingTest[]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const { user, restoreFromStorage } = useUserStore()

  // userStats를 UserProgress 타입으로 변경
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalProblems: 0,
    solvedProblems: 0,
    progressRate: 0,
  })

  // 컴포넌트 마운트 시 로컬 스토리지에서 유저 정보 복원
  useEffect(() => {
    restoreFromStorage()
  }, [])

  // 진행률 데이터를 가져오는 함수 수정
  const fetchUserProgress = async (userId: string) => {
    try {
      // API 호출 시 절대 경로 사용
      const response = await fetch(`/api/coding/submissions/progress?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Progress data fetch failed');
      }

      const data = await response.json();
      console.log('Progress data:', data); // 데이터 확인용 로그

      // null 체크를 추가하여 더 안전하게 처리
      setUserProgress({
        totalProblems: data?.totalProblems ?? 0,
        solvedProblems: data?.solvedProblems ?? 0,
        progressRate: data?.progressRate ?? 0,
      });
    } catch (error) {
      console.error("진행률을 불러오는데 실패했습니다:", error);
      // 에러 발생 시 기본값 설정
      setUserProgress({
        totalProblems: 0,
        solvedProblems: 0,
        progressRate: 0,
      });
    }
  };

  // useEffect 수정
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // user.id가 문자열인지 확인하고 처리
        if (user && user.id) {
          console.log('Fetching progress for user:', user.id); // 디버깅용 로그
          await fetchUserProgress(user.id.toString());
        }

        // 기존의 문제 목록 가져오기
        const endpoint = user ? `/api/coding/problems?userId=${user.id}` : "/api/coding/problems";
        const response = await fetch(endpoint);
        const data = await response.json();

        const mappedData: CodingTest[] = data.map((problem: ProblemData) => ({
          id: problem.id,
          title: problem.title,
          difficulty: problem.difficulty === "EASY" ? "초급" : 
                     problem.difficulty === "MEDIUM" ? "중급" : "고급",
          participants: problem.participants,
          successRate: problem.successRate,
          status: user ? problem.status : "NOT_ATTEMPTED",
        }));

        setCodingTests(mappedData);
      } catch (error) {
        console.error("데이터를 불러오는데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  // Change page
  const handlePageChange = (pageNumber: number): void => {
    setCurrentPage(pageNumber)
  }

  // 메모이제이션을 통한 필터링 성능 개선
  const filteredProblems = useMemo(() => {
    return codingTests.filter((problem) => {
      const matchesSearch = searchQuery === "" || problem.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDifficulty = selectedDifficulties.length === 0 || selectedDifficulties.includes(problem.difficulty)
      return matchesSearch && matchesDifficulty
    })
  }, [codingTests, searchQuery, selectedDifficulties])

  // 필터 초기화 함수
  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedDifficulties([])
  }

  // 난이도 체크박스 핸들러
  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulties((prev) => {
      if (difficulty === "전체") {
        return []
      }
      if (prev.includes(difficulty)) {
        return prev.filter((d) => d !== difficulty)
      }
      return [...prev, difficulty]
    })
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <div className="container mx-auto px-4 pt-24 pb-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-400">문제 목록을 불러오는 중...</div>
          </div>
        ) : (
          <>
            {user && (
              <div className="mb-8">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                  <h2 className="text-xl font-bold mb-4">내 진행 상황</h2>
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">전체 진행률</span>
                        <span className="text-lg font-medium">
                          {userProgress.solvedProblems}/{userProgress.totalProblems} 문제 해결
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${userProgress.progressRate}%` }}
                        ></div>
                      </div>
                      <div className="mt-1 text-right text-sm text-gray-400">
                        {userProgress.progressRate?.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
              {/* 왼쪽: 필터 */}
              <div className="w-full md:w-64 shrink-0">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 sticky top-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-medium flex items-center text-white">
                      <Filter className="h-4 w-4 mr-1" />
                      필터
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm text-gray-400 hover:text-white"
                      onClick={handleResetFilters}
                    >
                      초기화
                    </Button>
                  </div>

                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="text"
                        placeholder="문제 검색"
                        className="pl-8 bg-gray-800 border-gray-700 text-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <Accordion type="multiple" defaultValue={["difficulty"]} className="space-y-2">
                    <AccordionItem value="difficulty" className="border-gray-800">
                      <AccordionTrigger className="py-2 text-gray-300 hover:text-white">난이도</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Checkbox
                              id="difficulty-all"
                              className="border-gray-600"
                              checked={selectedDifficulties.length === 0}
                              onCheckedChange={() => handleDifficultyChange("전체")}
                            />
                            <Label htmlFor="difficulty-all" className="ml-2 text-sm text-gray-300">
                              전체
                            </Label>
                          </div>
                          <div className="flex items-center">
                            <Checkbox
                              id="difficulty-beginner"
                              className="border-gray-600"
                              checked={selectedDifficulties.includes("초급")}
                              onCheckedChange={() => handleDifficultyChange("초급")}
                            />
                            <Label htmlFor="difficulty-beginner" className="ml-2 text-sm text-gray-300">
                              초급
                            </Label>
                          </div>
                          <div className="flex items-center">
                            <Checkbox
                              id="difficulty-intermediate"
                              className="border-gray-600"
                              checked={selectedDifficulties.includes("중급")}
                              onCheckedChange={() => handleDifficultyChange("중급")}
                            />
                            <Label htmlFor="difficulty-intermediate" className="ml-2 text-sm text-gray-300">
                              중급
                            </Label>
                          </div>
                          <div className="flex items-center">
                            <Checkbox
                              id="difficulty-advanced"
                              className="border-gray-600"
                              checked={selectedDifficulties.includes("고급")}
                              onCheckedChange={() => handleDifficultyChange("고급")}
                            />
                            <Label htmlFor="difficulty-advanced" className="ml-2 text-sm text-gray-300">
                              고급
                            </Label>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>

              {/* 오른쪽: 코딩 테스트 목록 */}
              <div className="flex-1">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-400">총 {codingTests.length}개 문제</div>
                  </div>

                  <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">문제</th>
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">난이도</th>
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">참여자</th>
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">정답비율</th>
                          {user && <th className="py-3 px-4 text-left text-gray-400 font-medium">상태</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProblems.slice(indexOfFirstItem, indexOfLastItem).map((test) => (
                          <tr key={test.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="py-4 px-4">
                              <Link href={`/user/coding-test/${test.id}`} className="font-medium hover:text-red-500">
                                {test.title}
                              </Link>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center text-gray-400">{test.difficulty}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center text-gray-400">
                                <Users className="h-4 w-4 mr-1" />
                                <span>{test.participants.toLocaleString()}명</span>
                              </div>
                            </td>
                          <td className="py-4 px-4">
                              <div className="flex items-center">
                                {user && test.status === "SUCCESS" ? (
                                  <div className="flex items-center text-green-500">
                                    <Check className="h-4 w-4 mr-1" />
                                    <span>{test.successRate.toFixed(1)}%</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">{test.successRate.toFixed(1)}%</span>
                                )}
                              </div>
                           </td>
                            {user && (
                              <td className="py-4 px-4">
                                <div className="flex items-center">
                                  {test.status === "SUCCESS" ? (
                                    <span className="text-green-500">성공</span>
                                  ) : test.status === "FAIL" ? (
                                    <span className="text-red-500">실패</span>
                                  ) : (
                                    <span className="text-gray-400">미시도</span>
                                  )}
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Pagination
                    totalItems={filteredProblems.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

// 코드 템플릿 타입 정의
type CodeLanguage = "JAVASCRIPT" | "PYTHON" | "JAVA" | "C"

interface CodeTemplates {
  [key: string]: string
}

export const codeTemplates: CodeTemplates = {
  JAVASCRIPT: `function solution(nums, target) {
  // 여기에 코드를 작성하세요
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`,

  PYTHON: `def solution(nums, target):
    # 여기에 코드를 작성하세요
    num_dict = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in num_dict:
            return [num_dict[complement], i]
            
        num_dict[num] = i
    
    return []`,

  JAVA: `public class Main {
    public static int[] solution(int[] nums, int target) {
        // 여기에 코드를 작성하세요
        Map<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            
            map.put(nums[i], i);
        }
        
        return new int[] {};
    }

    public static void main(String[] args) {
        // 메인 메서드는 제출 시 자동으로 생성됩니다.
    }
}`,

  C: `#include <stdio.h>
#include <stdlib.h>

int* solution(int* nums, int numsSize, int target, int* returnSize) {
    // 여기에 코드를 작성하세요
    int* result = (int*)malloc(2 * sizeof(int));
    *returnSize = 2;
    
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
    
    result[0] = -1;
    result[1] = -1;
    return result;
}`,
}


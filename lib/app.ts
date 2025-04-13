// API 요청을 위한 기본 설정
const API_BASE_URL = '/api/coding'; // API 기본 경로 수정

// 에러 핸들링 함수
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("접근 권한이 없습니다. 로그인이 필요할 수 있습니다.");
    }
    try {
      const errorData = await response.json()
      throw new Error(errorData.message || "서버 오류가 발생했습니다.")
    } catch (e) {
      throw new Error("서버와의 통신 중 오류가 발생했습니다.")
    }
  }
  return response.json()
}

// 문제 목록 조회
export const getCodingTests = async (filters?: any) => {
  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, String(value));
      }
    });
  }
  const response = await fetch(`${API_BASE_URL}/problems${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
  return handleResponse(response);
}

// 단일 문제 조회
export const getCodingTest = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/problems/${id}`);
  return handleResponse(response);
}

// 코드 제출
export const submitCodingTest = async (id: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

// 제출 기록 조회
export const getSubmissions = async (problemId: string) => {
  const response = await fetch(`${API_BASE_URL}/submissions?problemId=${problemId}`);
  return handleResponse(response);
}

// 제출용 데이터 타입 정의
interface SubmissionData {
  language: string;
  code: string;
  userId: string;
}

// 제출 함수 타입 정의
export const submitCode = async (problemId: string, submissionData: SubmissionData) => {
  const response = await fetch(`${API_BASE_URL}/submissions/${problemId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(submissionData)
  });
  return handleResponse(response);
}

// 태그 목록은 problems API에서 가져오도록 수정
export const getTags = async () => {
  // 백엔드에 태그 API가 없으므로, 임시로 빈 배열 반환
  // 백엔드에 태그 API 추가 필요
  return [];
}


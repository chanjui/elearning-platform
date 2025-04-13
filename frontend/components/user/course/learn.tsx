import {useCallback, useEffect, useRef, useState} from "react";
import useUserStore from "@/app/auth/userStore";

interface LearnVideo {
  id: number;
  title: string;
  videoUrl: string;
  duration: number;
  previewUrl: string | null;
  seq: number;
  currentTime: number;
  completed: boolean;
  free: boolean;
  nextVideoId: number;
}

export default function LearnVideoComponent({id, onNext}: { id: number, onNext?: (nextId: number) => void }) {
  const [video, setVideo] = useState<LearnVideo | null>(null);
  const currentTimeRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasPromptedRef = useRef(false);
  const API_URL = `/api/course/learn`;
  const {user, restoreFromStorage} = useUserStore();

  const sendProgressToServer = useCallback(async () => {
    if (!video || currentTimeRef.current === 0) return;

    try {
      const progressUrl = `${API_URL}/${id}/progress?userId=${user?.id}&lectureVideoId=${id}&currentTime=${Math.floor(currentTimeRef.current)}`;
      await fetch(progressUrl, {method: "POST"});
      console.log("✅ Progress saved:", currentTimeRef.current);
    } catch (error) {
      console.error("❌ Failed to save progress", error);
    }
  }, [video, user, id]);

  const setData = async () => {
    try {
      const response = await fetch(`${API_URL}/${id}?userId=${user?.id}`);
      const data = await response.json();
      setVideo(data.data);
      hasPromptedRef.current = false;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setData().catch(console.error);
    restoreFromStorage();
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      (e as any).returnValue = "";
      sendProgressToServer().catch(console.error);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      sendProgressToServer().catch(console.error);
    };
  }, [sendProgressToServer]);

  // ✅ 시청 이어보기 전용 useEffect
  useEffect(() => {
    const handleResumePrompt = () => {
      if (
        video &&
        !video.completed &&
        video.currentTime > 0 &&
        !hasPromptedRef.current
      ) {
        hasPromptedRef.current = true;
        const shouldResume = window.confirm(
          `이전에 ${Math.floor(video.currentTime)}초까지 시청하셨습니다. 이어서 보시겠습니까?`
        );
        if (shouldResume && videoRef.current) {
          videoRef.current.currentTime = video.currentTime;
        }
      }
    };

    handleResumePrompt();
  }, [video?.id]);

  // ✅ 영상 종료 시 다음 강의 여부 묻기
  useEffect(() => {
    const currentVideo = videoRef.current;
    if (!currentVideo) return;

    const handleVideoEnd = () => {
      if (video?.nextVideoId) {
        const goNext = window.confirm("강의를 모두 시청하셨습니다. 다음 강의로 이동하시겠습니까?");
        if (goNext && onNext) {
          onNext(video.nextVideoId);
        }
      } else {
        alert("강의를 모두 시청하셨습니다.");
      }
    };

    currentVideo.addEventListener("ended", handleVideoEnd);
    return () => {
      currentVideo.removeEventListener("ended", handleVideoEnd);
    };
  }, [video?.nextVideoId, onNext]);

  if (!video) return <p>Loading...</p>;

  return (
    <div className="w-full h-screen flex items-start justify-end bg-black p-4">
      <video
        key={id}
        ref={videoRef}
        className="w-full h-auto"
        controls
        onTimeUpdate={() => {
          currentTimeRef.current = videoRef.current?.currentTime ?? 0;
        }}
      >
        <source src={video.videoUrl} type="video/mp4"/>
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

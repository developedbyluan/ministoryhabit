"use client";

// import { Button } from "@/components/ui/button";
// import { Slider } from "@/components/ui/slider";
import { useParams, useSearchParams } from "next/navigation";
// import {
//   Languages,
//   Play,
//   X,
//   TvMinimalPlay,
//   TextSearch,
//   Pause,
// } from "lucide-react";

import { useVideo } from "@/hooks/use-video";
import ReadMode from "./ReadMode";
import { useEffect, useState } from "react";
import { getVideo, saveVideo } from "@/utils/indexedDB";
import KaraokeMode from "./KaraokeMode";

export const runtime = "edge";

// type Word = {
//   word: string;
//   index: number;
// };

type LessonData = {
  id: number;
  media_url: string;
  paid: boolean;
  title: string;
  type: "video" | "audio";
  body: string;
  thumbnail_url: string;
  seriesId: number;
};

export default function GoPage() {
  const params = useParams<{ slug: string }>();
  const lessonSlug = params.slug;

  const searchParams = useSearchParams();
  const lineIndex = searchParams.get("i");

  const [videoSource, setVideoSource] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  console.log(isLoading);

  const [lessonData, setLessonData] = useState<LessonData[]>([]);

  const [text, setText] = useState<string>("");

  const [showKaraokeMode, setKaraokeMode] = useState(false);

  useEffect(() => {
    if (!lessonSlug) return;

    // connect to supabase api
    const getMediaData = async (slug: string) => {
      try {
        const supabaseRes = await fetch(`/api/supabase/${slug}`);

        if (!supabaseRes.ok) {
          throw new Error(`Error fetching data: ${supabaseRes.statusText}`);
        }

        const lessonData = await supabaseRes.json();
        return lessonData;
      } catch (error) {
        console.error("Failed to fetch media data", error);
      }

      return null;
    };

    const fetchData = async () => {
      try {
        const data = (await getMediaData(lessonSlug)) as LessonData[];
        setLessonData(data);
      } catch (err) {
        console.error(err);
      } finally {
        // console.log("done");
      }
    };

    fetchData();
  }, [lessonSlug]);

  useEffect(() => {
    if (!lessonSlug) return;
    if (!lessonData) return;

    if (lessonData.length <= 0) return;
    setText(lessonData[0].body);
    // console.log("lessonData", lessonData)

    const handleDownload = async (
      remoteVideoUrl: string,
      videoName: string
    ) => {
      try {
        setIsLoading(true);
        const response = await fetch(remoteVideoUrl);
        const videoBlob = await response.blob();
        await saveVideo(videoBlob, videoName);
        // await loadStoredVideos()
        // setIsDownloadDialogOpen(false)
      } catch (err) {
        // setError("Failed to download video")
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const loadVideo = async (videoName: string) => {
      try {
        setIsLoading(true);
        // setError(null)

        const video = await getVideo(videoName);
        if (video) {
          // alert("Play video from indexedDB");
          const url = URL.createObjectURL(video.blob);
          // setVideoUrl(url)
          setVideoSource(url);
          // setIsOfflineAvailable(true)
          // setCurrentVideoName(name)
        } else {
          // alert(`Play video from remote url: ${lessonData.length}`);
          // setVideoUrl(null)
          // const remoteVideoUrl =
          //   "https://res.cloudinary.com/dqssqzt3y/video/upload/v1737861394/xitrum-25-ttpb_vhapji.mp4";

          const remoteVideoUrl = lessonData[0].media_url;
          console.log(remoteVideoUrl);
          setVideoSource(remoteVideoUrl);
          handleDownload(remoteVideoUrl, lessonSlug);
          // setIsOfflineAvailable(false)
          // setCurrentVideoName(null)
        }
      } catch (err) {
        // setError("Failed to load video")
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideo(lessonSlug);
  }, [lessonSlug, lessonData]);

  //
  const {
    videoRef,
    isPlaying,
    progress,
    duration,
    // currentLyric,
    togglePlay,
    handleProgressChange,
    playbackRate,
    handlePlaybackRateChange,
    lyrics,
    updateCurrentLyricIndex,
    handlePause,
    handlePlay,
  } = useVideo({
    src: videoSource,
    text: text,
    lineIndex: parseInt(lineIndex || "0"),
    lessonSlug: lessonSlug,
  });

  const handleShowKaraokeMode = () => {
    // const remoteVideoUrl = lessonData[0].media_url;
    // setVideoSource(remoteVideoUrl);
    if (!isPlaying) {
      togglePlay();
    }
    setKaraokeMode((prev) => !prev);
  };
  return (
    <div className="h-dvh py-4 grid grid-rows[1fr_auto_auto] gap-4">
      <video
        ref={videoRef}
        className={`${
          showKaraokeMode ? "" : "hidden"
        } w-[95%] max-w-[396px] mx-auto rounded-lg shadow-md max-h-full`}
        playsInline
      />

      {showKaraokeMode ? (
        <KaraokeMode
          videoRef={videoRef}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          handleShowKaraokeMode={handleShowKaraokeMode}
          lyrics={lyrics}
          handlePause={handlePause}
          lessonData={lessonData}
          progress={progress}
          updateCurrentLyricIndex={updateCurrentLyricIndex}
          handleProgressChange={handleProgressChange}
          duration={duration}
          playbackRate={playbackRate}
          handlePlaybackRateChange={handlePlaybackRateChange}
          handlePlay={handlePlay}
        />
      ) : (
        <ReadMode
          videoRef={videoRef}
          progress={progress}
          isPlaying={isPlaying}
          duration={duration}
          handleProgressChange={handleProgressChange}
          togglePlay={togglePlay}
          lyrics={lyrics}
          updateCurrentLyricIndex={updateCurrentLyricIndex}
          handlePause={handlePause}
          lessonData={lessonData}
          handleShowKaraokeMode={handleShowKaraokeMode}
        />
      )}
    </div>
  );
}

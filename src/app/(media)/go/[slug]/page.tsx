"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useParams, useSearchParams } from "next/navigation";
import {
  Languages,
  Play,
  X,
  TvMinimalPlay,
  TextSearch,
  Pause,
} from "lucide-react";

import { useVideo } from "@/hooks/use-video";
import ReadMode from "./ReadMode";
import { useEffect, useState } from "react";
import { getAllVideos, getVideo, saveVideo } from "@/utils/indexedDB";

type Word = {
  word: string;
  index: number;
};

const lyric = {
  text: "It's five o'clock and Allen is riding his motorcycle in San Francisco.",
  ipa: "ɪts faɪv əˈklɑk ænd ˈælən ɪz ˈraɪdɪŋ hɪz ˈmoʊtərˌsaɪkəl ɪn ˌsæn frænˈsɪskoʊ.",
  translation: "Bây giờ là năm giờ và Allen đang chạy xe máy ở San Francisco.",
};

export default function GoPage() {
  const params = useParams<{ slug: string }>();
  const lessonSlug = params.slug;

  const searchParams = useSearchParams();
  const lineIndex = searchParams.get("i");

  // console.log("Lesson Slug:", lessonSlug);
  // console.log("Line Index:", lineIndex);

  const src =
    "https://res.cloudinary.com/dqssqzt3y/video/upload/v1737861394/xitrum-25-ttpb_vhapji.mp4";

    const [videoSource, setVideoSource] = useState("")
    const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleDownload = async (remoteVideoUrl: string, videoName: string) => {
      try {
        setIsLoading(true)
        const response = await fetch(remoteVideoUrl)
        const videoBlob = await response.blob()
        await saveVideo(videoBlob, videoName)
        // await loadStoredVideos()
        // setIsDownloadDialogOpen(false)
      } catch (err) {
        // setError("Failed to download video")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    
    const loadVideo = async (videoName: string) => {
      try {
        setIsLoading(true)
        // setError(null)
  
        const video = await getVideo(videoName)
        if (video) {
          alert("Play video from indexedDB")
          const url = URL.createObjectURL(video.blob)
          // setVideoUrl(url)
          setVideoSource(url)
          // setIsOfflineAvailable(true)
          // setCurrentVideoName(name)
        } else {
          alert("Play video from remote url")
          // setVideoUrl(null)
          const remoteVideoUrl = "https://res.cloudinary.com/dqssqzt3y/video/upload/v1737861394/xitrum-25-ttpb_vhapji.mp4"
          setVideoSource(remoteVideoUrl)
          handleDownload(remoteVideoUrl, lessonSlug)
          // setIsOfflineAvailable(false)
          // setCurrentVideoName(null)
        }
      } catch (err) {
        // setError("Failed to load video")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadVideo(lessonSlug)
  }, [lessonSlug]);
  //
  const {
    videoRef,
    isPlaying,
    progress,
    duration,
    playbackRate,
    currentLyric,
    togglePlay,
    handleProgressChange,
    handlePlaybackRateChange,
    lyrics,
    updateCurrentLyricIndex,
    handlePause,
  } = useVideo({ src: videoSource});

  return (
    <>
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
      />
    </>
  );
}

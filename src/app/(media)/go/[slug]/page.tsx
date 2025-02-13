"use client";

import { useParams, useSearchParams } from "next/navigation";

import { useVideo } from "@/hooks/use-video";
import ReadMode from "./ReadMode";
import { useEffect, useRef, useState } from "react";
// import { getVideo, saveVideo } from "@/utils/indexedDB";
import { saveVideo } from "@/utils/indexedDB";
import KaraokeMode from "./KaraokeMode";
import SentenceMode from "./SentenceMode";
import type { LessonData } from "@/types";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import SignupForm from "@/components/squeeze-form/SignupForm";
import Link from "next/link";

export const runtime = "edge";

export default function GoPage() {
  const params = useParams<{ slug: string }>();
  const lessonSlug = params.slug;

  const searchParams = useSearchParams();
  const lineIndex = searchParams.get("i");

  const [videoSource, setVideoSource] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // console.log(isLoading);

  const [lessonData, setLessonData] = useState<LessonData>({
    id: "",
    media_url: "",
    paid: false,
    title: "",
    type: "video",
    body: "",
    thumbnail_url: "",
    playlists: {
      id: "",
      name: "",
    },
  });

  const [text, setText] = useState<string>("");

  const [showKaraokeMode, setKaraokeMode] = useState(true);

  const [showSentenceMode, setShowSentenceMode] = useState(false);

  const [showVideo, setShowVideo] = useState<boolean>(false);

  const previousModeRef = useRef<"karaoke" | "read" | "">("");

  const { isAuthenticated, getPermission } = useKindeBrowserClient();
  const isVIP = getPermission("access:paidcontent");
  useEffect(() => {
    if (!lessonSlug) return;

    // connect to supabase api
    const getMediaData = async (slug: string) => {
      try {
        const supabaseRes = await fetch(`/api/supabase_extra/${slug}`);

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
        const data = (await getMediaData(lessonSlug)) as LessonData;
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

    if (!lessonData) return;
    setText(lessonData.body);
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

        // const video = await getVideo(videoName);
        // if (video) {
        //   const url = URL.createObjectURL(video.blob);
        //   setVideoSource(url);
        // } else {
        console.log(videoName);
        const remoteVideoUrl = lessonData.media_url;
        // console.log(remoteVideoUrl);
        setVideoSource(remoteVideoUrl);
        handleDownload(remoteVideoUrl, lessonSlug);
        // }
      } catch (err) {
        // setError("Failed to load video")
        console.error(err);
      } finally {
        setIsLoading(false);
        console.log(isLoading);
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
    playInRange,
    currentLyricIndex,
  } = useVideo({
    src: videoSource,
    text: text,
    lineIndex: parseInt(lineIndex || "0"),
    lessonSlug: lessonSlug,
    playlistId: lessonData.playlists.id,
  });

  const handleShowKaraokeMode = (mode: "karaoke" | "read") => {
    // const remoteVideoUrl = lessonData[0].media_url;
    // setVideoSource(remoteVideoUrl);
    if (!isPlaying) {
      togglePlay();
    }
    setKaraokeMode((prev) => !prev);
    previousModeRef.current = mode;

    setShowSentenceMode(false);
  };

  const handleShowSentenceMode = (mode: "karaoke" | "read") => {
    const currentLyric = lyrics[currentLyricIndex];

    if (isPlaying) {
      handlePause(currentLyric.start_time, currentLyricIndex);
    }

    setShowSentenceMode((prev) => !prev);

    if (showKaraokeMode) {
      setKaraokeMode(false);
    }

    previousModeRef.current = mode;
  };

  const handleShowVideoInSentenceMode = () => {
    setShowVideo((prev) => !prev);
  };

  if (lessonData.paid) {
    // console.log(lessonData.paid);
    // console.log(isVIP);
    if (!isVIP?.isGranted) {
      // console.log(isVIP)
      return (
        <div className="min-h-dvh flex flex-col justify-center items-center">
          <p>This content is for VIP members only!</p>
          <Link className="text-blue-600 hover:text-blue-800" href="/">
            Back to Home Page
          </Link>
        </div>
      );
    }
  }

  return (
    <div className="bg-white max-w-xl mx-auto h-dvh py-4 grid grid-rows[1fr_auto_auto] gap-4">
      {!isAuthenticated && (
        <div className="absolute z-50 inset-0 bg-slate-600/30 flex flex-col justify-center items-center">
          <div className="bg-slate-100 pb-7 rounded-md px-10">
            <SignupForm redirectURL={`/go/${lessonSlug}`} />
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        className={`${
          showKaraokeMode || (showSentenceMode && showVideo) ? "" : "hidden"
        } w-[95%] max-w-[396px] mx-auto rounded-lg shadow-md`}
        playsInline
      />

      {showKaraokeMode && (
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
          handleShowSentenceMode={handleShowSentenceMode}
        />
      )}

      {!showKaraokeMode && !showSentenceMode && isAuthenticated && (
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
          handleShowSentenceMode={handleShowSentenceMode}
        />
      )}

      {showSentenceMode && isAuthenticated && (
        <SentenceMode
          isPlaying={isPlaying}
          playInRange={playInRange}
          lyrics={lyrics}
          currentLyricIndex={currentLyricIndex}
          updateCurrentLyricIndex={updateCurrentLyricIndex}
          handleShowKaraokeMode={handleShowKaraokeMode}
          handleShowSentenceMode={handleShowSentenceMode}
          previousMode={previousModeRef.current}
          showVideoInSentenceMode={handleShowVideoInSentenceMode}
          showVideo={showVideo}
        />
      )}
    </div>
  );
}

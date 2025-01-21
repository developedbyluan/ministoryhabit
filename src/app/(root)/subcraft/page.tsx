"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubtitleEditor from "./SubtitleEditor";


declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

type LyricObject = {
  id: number;
  start_time: number;
  end_time: number;
  text: string;
  ipa: string;
  translation: string;
};

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export default function CustomYouTubePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<any>(null);

  const [subtitleArr, setSubtitleArr] = useState<LyricObject[]>([]);

  const lyricsArrayRef = useRef<HTMLDivElement>(null);
  const prevLyricIndexRef = useRef<number>(0);

  useEffect(() => {
    // https://developers.google.com/youtube/iframe_api_reference
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        height: "360",
        width: "640",
        videoId: "BNArBr_J8mA",
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          controls: 0,
          disablekb: 1,
          rel: 0,
          //   start: 100,
          //   end: 110
        },
        events: {
          // https://developers.google.com/youtube/iframe_api_reference#Adding_event_listener
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // const currentLyricIndex = lyrics.findIndex((lyric: LyricObject) => {
    //   return currentTime >= lyric.start_time && currentTime < lyric.end_time;
    // });

    const currentLyricIndex = subtitleArr.findIndex((lyric: LyricObject) => {
      return currentTime >= lyric.start_time && currentTime < lyric.end_time;
    });

    if (currentLyricIndex === prevLyricIndexRef.current) return;

    prevLyricIndexRef.current = currentLyricIndex;

    if (currentLyricIndex != -1 && lyricsArrayRef.current) {
      const lyricElement = lyricsArrayRef.current.children[currentLyricIndex];
      lyricElement.scrollIntoView({ behavior: "smooth", block: "start" });

      // updateCurrentLyricIndex(currentLyricIndex);
    }
  }, [currentTime, subtitleArr]);

  const onPlayerReady = (event: any) => {
    // Player is ready
    setDuration(playerRef.current.getDuration());
  };

  const onPlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      startTimeUpdate();
    } else {
      setIsPlaying(false);
      stopTimeUpdate();
    }
  };

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const startTimeUpdate = () => {
    const updateTime = () => {
      if (playerRef.current) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
      requestAnimationFrame(updateTime);
    };
    updateTime();
  };

  const stopTimeUpdate = () => {
    cancelAnimationFrame(requestAnimationFrame(() => {}));
  };

  const rewind = () => {
    const newTime = Math.max(0, currentTime - 5);
    playerRef.current?.seekTo(newTime);
    setCurrentTime(newTime);
  };

  const skipForward = () => {
    const newTime = Math.max(0, currentTime + 5);
    playerRef.current?.seekTo(newTime);
    setCurrentTime(newTime);
  };

  const seek = (time: number) => {
    playerRef.current?.seekTo(time);
    setCurrentTime(time);
  };

  const changePlaybackRate = (rate: number) => {
    playerRef.current?.setPlaybackRate(rate);
    setPlaybackRate(rate);
  };

  const playInRange = (start: number, end: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(start, true);
      playerRef.current.playVideo();

      const checkTime = () => {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime >= end) {
          playerRef.current.pauseVideo();
          playerRef.current.seekTo(start, true);
        } else {
          requestAnimationFrame(checkTime);
        }
      };
      checkTime();
    }
  };

  const updateSubtitle = (newSubtitle: LyricObject[]) => {
    setSubtitleArr(newSubtitle);
  };

  const handleLyricClick = (start: number) => {
    const videoPlayer = playerRef.current;
    if (!videoPlayer) return;
    videoPlayer.seekTo(start, true);
    videoPlayer.playVideo();
  };

  return (
    <div className="sm:flex sm:justify-between">
      <SubtitleEditor
        currentTime={currentTime}
        isPlaying={isPlaying}
        updateSubtitle={updateSubtitle}
      />

      <div className="max-w-[540px] space-y-4 border min-h-screen">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
          <div id="youtube-player" className="absolute inset-0 w-full h-full" />
        </div>
        <p>
          <span className="hidden">{formatTime(currentTime)}</span> ~{" "}
          {currentTime}
        </p>
        <p>{formatTime(duration)}</p>
        <div className="flex justify-center">
          <Button
            onClick={togglePlayPause}
            size="lg"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
              </>
            )}
          </Button>

          <Button onClick={rewind}> Rewind</Button>
          <Button onClick={skipForward}>Skip Forward</Button>

          <Button
            onClick={() => playInRange(36, 45)}
            size="lg"
            className="gap-2"
            aria-label="Play video from 36 to 45 seconds"
          >
            Play Range
          </Button>

          <Select
            value={playbackRate.toString()}
            onValueChange={(value) => changePlaybackRate(Number(value))}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Speed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="0.66">0.66x</SelectItem>
              <SelectItem value="0.75">0.75x</SelectItem>
              <SelectItem value="0.9">0.9x</SelectItem>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="1.1">1.1x</SelectItem>
              <SelectItem value="1.25">1.25x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
              <SelectItem value="1.75">1.75x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Slider
          value={[currentTime]}
          step={1}
          max={duration}
          onValueChange={([value]) => seek(value)}
        />
        <div ref={lyricsArrayRef} className="h-48 overflow-y-auto">
          {subtitleArr.map((lyric) => {
            return (
              <p
                key={lyric.id}
                role="button"
                onClick={() => handleLyricClick(lyric.start_time)}
                className={`text-2xl mb-4 hover:text-red-400 ${
                  currentTime >= lyric.start_time &&
                  currentTime < lyric.end_time
                    ? "text-2xl font-bold"
                    : "text-gray-200 hover:cursor-pointer"
                }`}
              >
                {lyric.text}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

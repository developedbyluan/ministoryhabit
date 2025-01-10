"use client"

import LyricsDisplay from "@/components/LyricsDisplay";
import LyricsModeControls from "@/components/LyricsModeControls";
import { useAudio } from "@/hooks/use-audio";

import { sampleData } from "@/db/sample-data";

export default function AudioPlayerPage() {
    const audioUrl = sampleData.audioUrl
    // TODO: will be retrieved from database where the previous time the user left the app
    const startTime = 0
    const audioDuration = sampleData.metaData.duration

    const {playing, togglePlay, duration, currentTime, seek} = useAudio(audioUrl, startTime, audioDuration)

    return (
        <main>
            <LyricsDisplay />
            {/* Lyrics Mode Controls */}
            <LyricsModeControls 
                playing={playing}
                togglePlay={togglePlay}
                duration={duration}
                currentTime={currentTime}
                seek={seek}
            />
        </main>
    )
}
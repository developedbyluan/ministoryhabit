import React from 'react';

interface LyricsDisplayProps {
  currentLyric: string;
}

export function LyricsDisplay({ currentLyric }: LyricsDisplayProps) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-4">
      <h2 className="text-lg font-semibold mb-2">Lyrics</h2>
      <p className="text-xl">{currentLyric || "No lyrics at this time"}</p>
    </div>
  );
}


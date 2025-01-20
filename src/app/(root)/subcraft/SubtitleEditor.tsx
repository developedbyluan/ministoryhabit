"use client";

import { useState, useEffect, useRef, use } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { convertToSubtitleArr } from "./convertToSubtitlesArr";

type SubtitleEditorProps = {
  currentTime: number;
  isPlaying: boolean;
  updateSubtitle: (newSubtitle: string[]) => void
};

export default function SubtitleEditor({
  currentTime,
  isPlaying,
  updateSubtitle
}: SubtitleEditorProps) {
  const [transcript, setTranscript] = useState("");
  const [currentLine, setCurrentLine] = useState("");
  const [lineNumber, setLineNumber] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [lines, setLines] = useState<string[]>([]);

  const [previousLineNumber, setPreviousLineNumber] = useState<number>(0)

  useEffect(() => {
    if (lineNumber > 0 && lineNumber <= lines.length) {
      setCurrentLine(lines[lineNumber - 1]);
    }
  }, [lineNumber, lines]);

  useEffect(() => {
    setEndTime(`${currentTime}`);
  }, [currentTime]);

  useEffect(() => {
    if (subtitle === "") return;

    try {
      console.log(subtitle);
      console.log(convertToSubtitleArr(subtitle));
      updateSubtitle(convertToSubtitleArr(subtitle))
    } catch (error) {
      console.error(error);
    }
  }, [subtitle]);

  const loadFirstLine = () => {
    const newLines = transcript
      .split("\n")
      .filter((line) => line.trim() !== "");
    setLines(newLines);
    if (newLines.length > 0) {
      setCurrentLine(newLines[0]);
      setLineNumber(1);
      setStartTime(`${currentTime}`);
      setEndTime(`${currentTime}`);
    }
  };

  const addToSubtitle = () => {
    if (currentLine && startTime && endTime) {
      const newSubtitle = `\n${previousLineNumber + lineNumber}\n${startTime} ---> ${endTime}\n${currentLine}\n`;
      setSubtitle((prevSubtitle) => prevSubtitle + newSubtitle);

      // Load next line
      if (lineNumber < lines.length) {
        setLineNumber((prevLineNumber) => prevLineNumber + 1);
      } else {
        setCurrentLine("");
        setLineNumber(0);
      }

      // Reset time inputs
      //   setStartTime('')
      //   setEndTime('')
      setStartTime(endTime);
      setEndTime(`${currentTime}`);
    }
  };

  const handleLineNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLineNumber = parseInt(e.target.value, 10);
    if (!isNaN(newLineNumber) && newLineNumber >= 0) {
      setLineNumber(newLineNumber);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="transcript">Transcript</Label>
        <Textarea
          id="transcript"
          placeholder="Enter your transcript here..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={5}
        />
      </div>

      <Button onClick={loadFirstLine}>Load first line</Button>

      <div className="space-y-2">
        <Label htmlFor="currentLine">Current Line</Label>
        <Input
          id="currentLine"
          value={currentLine}
          onChange={(e) => setCurrentLine(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lineNumber">Current line number</Label>
        <Input
          id="lineNumber"
          type="number"
          value={lineNumber}
          onChange={handleLineNumberChange}
          min={0}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="previousLineNumber">Previous line number</Label>
        <Input
          id="previousLineNumber"
          type="number"
          value={previousLineNumber}
          onChange={(e) => setPreviousLineNumber(parseInt(e.target.value))}
          min={0}
        />
      </div>

      <div className="flex space-x-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="number"
            step="0.01"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="number"
            step="0.01"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            placeholder="0.00"
          />
        </div>
      </div>

      <Button onClick={addToSubtitle}>Add to Subtitle</Button>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Textarea
          id="subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          rows={5}
        />
      </div>
    </div>
  );
}

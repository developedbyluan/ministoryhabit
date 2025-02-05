"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Mic } from "lucide-react";

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        audioChunks.current = [];
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex flex-col items-center">
          <span className="text-2xl font-bold text-center">Voice Recorder</span>
          <span className="text-neutral-300 text-sm">for Shadowing</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <button
          onClick={() => (isRecording ? stopRecording() : startRecording())}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            isRecording
              ? "bg-red-500 animate-pulse"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          <Mic
            className={`w-8 h-8 ${
              isRecording ? "text-white" : "text-gray-500"
            }`}
          />
        </button>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-4">
        {audioURL && (
          <div className="w-full">
            <audio src={audioURL} controls className="w-full" />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

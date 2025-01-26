"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useParams, useSearchParams } from "next/navigation";
import { Languages, Play, X, TvMinimalPlay, TextSearch } from "lucide-react";
import { VideoPlayer } from "./VideoPlayer";

type Word = {
  word: string;
  index: number;
};

export default function GoPage() {
  const params = useParams<{ slug: string }>();
  const lessonSlug = params.slug;

  const searchParams = useSearchParams();
  const lineIndex = searchParams.get("i");

  console.log("Lesson Slug:", lessonSlug);
  console.log("Line Index:", lineIndex);

  const currentLyric = {
    text: "It's five o'clock and Allen is riding his motorcycle in San Francisco.",
    ipa: "ɪts faɪv əˈklɑk ænd ˈælən ɪz ˈraɪdɪŋ hɪz ˈmoʊtərˌsaɪkəl ɪn ˌsæn frænˈsɪskoʊ.",
    translation:
      "Bây giờ là năm giờ và Allen đang chạy xe máy ở San Francisco.",
  };

  const words: Word[] = currentLyric.text
    .split(" ")
    .map((word, index) => ({ word, index }));
  const ipaArr = currentLyric.ipa.split(" ");

  return (
    <div className="max-h-full py-4 flex flex-col justify-between">
      <header>
        <div className="max-w-[576px] w-[95%] mx-auto flex justify-between items-center gap-4 pb-4">
          <Button variant="ghost">
            <X className="scale-150" />
          </Button>
          <Slider />
          <Button variant="ghost">
            <Languages className="scale-150" />
          </Button>
        </div>
      </header>
      <main className="flex-grow overflow-y-auto">
        <div className="max-w-[576px] w-[95%] mx-auto px-6 space-y-4">
          <VideoPlayer src="https://res.cloudinary.com/dqssqzt3y/video/upload/v1737861394/xitrum-25-ttpb_vhapji.mp4" />
          <div className="my-4 text-center border border-red-400 flex flex-wrap">
            {words.map((word: Word) => (
              <div key={word.index} className="flex flex-col items-center mt-2">
                <span className="text-xs text-slate-400">
                  {ipaArr[word.index]}
                </span>
                <span className="px-2 cursor-pointer bg-blue-100">
                  {word.word}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer>
        <div className="max-w-[576px] w-[95%] mx-auto px-4 pt-4">
          <div className="play-pause-toggler flex justify-between items-center">
            <Button variant="outline" size="sm">
              <TvMinimalPlay className="scale-150" />
            </Button>
            <Button
              size="icon"
              className="bg-white hover:bg-slate-100 border w-12 h-12 rounded-full"
            >
              <Play fill="black" strokeWidth={4} stroke="black" />
            </Button>
            <Button variant="outline" size="sm">
              <TextSearch className="scale-150" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

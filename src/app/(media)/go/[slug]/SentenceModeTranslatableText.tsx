"use client";

import * as React from "react";
import { HoverableText } from "./SentenceModeHoverableText";
import { SavedTranslations } from "./SentenceModeSavedTranslations";
import { translateText } from "@/app/actions/translate";
import { openaiApiLogs } from "@/app/actions/openai-api-logs";
import { useParams } from "next/navigation";


import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

interface TranslatableTextProps {
  text: string;
  handleAddToGoldlist: (
    originalChunk: string,
    newChunk: string
  ) => Promise<boolean>;
}

interface Translation {
  original: string;
  translation: string;
  isLoading: boolean;
}

export function TranslatableText({
  text,
  handleAddToGoldlist,
}: TranslatableTextProps) {
  const [selectedRange, setSelectedRange] = React.useState<
    [number, number] | null
  >(null);
  const [firstClick, setFirstClick] = React.useState<number | null>(null);
  const [savedTranslations, setSavedTranslations] = React.useState<
    Translation[]
  >([]);

  const [isTranslating, setIsTranslating] = React.useState<boolean>(false);

  const params: { slug: string } = useParams();
  // console.log(params.slug)

  const { user } = useKindeBrowserClient();

  const handleWordClick = async (index: number) => {
    if (firstClick === null) {
      setFirstClick(index);
    } else {
      const start = Math.min(firstClick, index);
      const end = Math.max(firstClick, index);
      setSelectedRange([start, end]);

      const selectedText = getSelectedText(start, end);
      handleSaveTranslation(selectedText);

      // Reset firstClick and selectedRange after a short delay
      setTimeout(() => {
        setFirstClick(null);
        setSelectedRange(null);
      }, 500); // 500ms delay to show highlighting
    }
  };

  const processText = (text: string) => {
    const regex = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)|(\S+)/g;
    const matches = Array.from(text.matchAll(regex));

    return matches.map((match, index) => {
      const word = match[0];
      const isPhrase = /[A-Z]/.test(word[0]) && word.includes(" ");
      const isSelected =
        selectedRange && index >= selectedRange[0] && index <= selectedRange[1];
      const isFirstSelected = firstClick === index;

      return (
        <React.Fragment key={index}>
          <HoverableText
            text={word}
            isPhrase={isPhrase}
            index={index}
            isSelected={isSelected || false}
            isFirstSelected={isFirstSelected}
            onWordClick={handleWordClick}
          />
          {index < matches.length - 1 && " "}
        </React.Fragment>
      );
    });
  };

  const getSelectedText = (start: number, end: number) => {
    const regex = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)|(\S+)/g;
    const matches = Array.from(text.matchAll(regex));
    return matches
      .slice(start, end + 1)
      .map((match) => match[0])
      .join(" ");
  };
  const handleSaveTranslation = async (original: string) => {
    setIsTranslating(true);
    setSavedTranslations((prev) => [
      ...prev,
      { original, translation: "", isLoading: true },
    ]);

    const result = await translateText(original);

    setSavedTranslations((prev) =>
      prev.map((item) =>
        item.original === original
          ? {
              ...item,
              translation: result.translation || "Translation failed",
              isLoading: false,
            }
          : item
      )
    );
    setIsTranslating(false);

    // const { data, error } = await openaiApiLogs(
    //   params.slug,
    //   original,
    //   "kp_xxx"
    // );
    // if (error) {
    //   console.error(error);
    // }
    // console.log(data);

    await openaiApiLogs(
      params.slug,
      original,
      // "kp_xxx",
      user?.id || "kp_"
    );
  };

  console.log(isTranslating);
  return (
    <div className="space-y-4">
      <div className="relative">
        {isTranslating ? (
          <p className="leading-relaxed text-lg">{text}</p>
        ) : (
          <p className="leading-relaxed text-lg">{processText(text)}</p>
        )}
      </div>
      {savedTranslations.length > 0 && (
        <div>
          {/* <h3 className="text-lg font-semibold mb-2">Saved Translations</h3> */}
          <SavedTranslations
            translations={savedTranslations}
            handleAddToGoldlist={handleAddToGoldlist}
          />
        </div>
      )}
    </div>
  );
}

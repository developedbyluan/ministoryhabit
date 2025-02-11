"use client";

import {
  getWords,
  getWordFrequency,
  createResultObject,
} from "@/utils/getUniqueWords";
import { words3000 } from "../words3000";
import { useEffect, useState } from "react";
import WordFrequencyGrid from "./WordFrequencyGrid";
import { addToCollectedVocab } from "@/app/actions/add-to-collected-vocab";
import { Button } from "@/components/ui/button";

export const runtime = "edge";

type VocabResponse = {
  data?: { vocab_array: string[] }[];
  error?: string;
};

export default function StatsPage() {
  const [wordFrequency, setWordFrequency] = useState<{
    [key: string]: { frequency: number; isInTheArray: boolean };
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: handleInsertExposureWords
  const handleStoreExposureWords = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const exposureListRaw = localStorage.getItem("exposure_list") || "[]";
      let words: string[];

      try {
        words = getWords(JSON.parse(exposureListRaw));
      } catch (err) {
        words = [];
      }

      if (words.length > 0) {
        // setError("No words to store.");

        // Attempt to insert the words into the database.
        const insertSuccess = await addToCollectedVocab(
          words,
        );

        if (!insertSuccess) {
          setError("Failed to insert words into Supabase.");
          return;
        }
      }
    } catch (err) {
      setError(
        `Failed to fetch vocabulary: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
      // Fetch vocabulary data from the API.
      const response = await fetch("/api/supabase_vocab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kinde_auth_id: "",
        }),
      });

      const vocab: VocabResponse = await response.json();

      if (vocab.data) {
        setWordFrequency(
          createResultObject(words3000, getWordFrequency(vocab.data))
        );
        localStorage.setItem("exposure_list", "[]");
      } else if (vocab.error) {
        setError(vocab.error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {Object.entries(wordFrequency).length === 0 ? (
          <div className="my-4 flex justify-center items-center">
            <Button
              variant="outline"
              className="border-2 hover:bg-red-400 hover:text-white border-red-400 font-semibold"
              onClick={handleStoreExposureWords}
              disabled={isLoading}
            >
              {isLoading
                ? "Loading..."
                : "View My High Frequency Words"}
            </Button>
          </div>
        ) : (
          <WordFrequencyGrid data={wordFrequency} />
        )}
      </div>
    </div>
  );
}

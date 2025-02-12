"use client";

import {
  getWords,
  getWordFrequency,
  createResultObject,
} from "@/utils/getUniqueWords";
import { words3000 } from "../words3000";
import { useState } from "react";
import WordFrequencyGrid from "./WordFrequencyGrid";
import { addToCollectedVocab } from "@/app/actions/add-to-collected-vocab";
import { Button } from "@/components/ui/button";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import SqueezePage from "@/components/squeeze-form";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import VocabularyPanel from "./VocabularyPanel";

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

  const { isAuthenticated } = useKindeBrowserClient();

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
        console.log(err);
      }

      if (words.length > 0) {
        // setError("No words to store.");

        // Attempt to insert the words into the database.
        const insertSuccess = await addToCollectedVocab(words);

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

  const handlePractice = () => {
    setWordFrequency({})
  }

  if (isLoading) {
    return (
      <div className="min-h-dvh flex justify-center items-center gap-2 text-white bg-slate-800">
        <Loader2 className="h-8 w-8 animate-spin" />
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
    <>
      {!isAuthenticated ? (
        <SqueezePage redirectURL="/vocab" />
      ) : (
        <div>
          <header className="bg-white shadow-sm">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex-shrink-0">
                  <Link
                    href="/"
                    className="flex gap-2 items-center text-2xl font-bold text-indigo-600"
                  >
                    <ChevronLeft className="scale-150" />
                    <span>Vocabulary</span>
                  </Link>
                </div>
                <div>
                  {Object.entries(wordFrequency).length === 0 ? (
                    <Button
                      variant="outline"
                      className="border-2 hover:bg-red-400 hover:text-white border-red-400 font-bold"
                      onClick={handleStoreExposureWords}
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "My HF Vocabulary"}
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      className="border-2 border-blue-700 bg-blue-700 hover:text-blue-700 hover:bg-white font-bold"
                      onClick={handlePractice}
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Practice"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </header>
          <div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {Object.entries(wordFrequency).length !== 0 && (
              <div className="max-w-2xl mx-auto">
                <WordFrequencyGrid data={wordFrequency} />
              </div>
            )}
          </div>
          <div>
            <VocabularyPanel />
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import VocabularyCard from "../../VocabularyCard";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  // fetchVocabularyItems,
  fetchReviewItems,
  acquireItem,
  reviewMoreItem,
} from "@/app/actions/vocab";

export const runtime = 'edge';

interface GoldlistItem {
  id: number;
  created_at: string;
  sentence: string;
  original_chunk: string;
  new_chunk: string;
  lesson_slug: string;
  is_acquired: boolean;
  last_review_at: string | null;
  start_time: number;
}

export default function DateVocabularyPage() {
  const params = useParams();
  const date = decodeURIComponent(params.date as string);
  const [vocabularyItems, setVocabularyItems] = useState<GoldlistItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        setIsLoading(true);
        setError(null);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const data = await fetchReviewItems(
          startOfDay.toISOString(),
          endOfDay.toISOString()
        );
        setVocabularyItems(shuffleArray(data));
        setCurrentIndex(0);
      } catch (err) {
        console.error("Error fetching vocabulary items:", err);
        setError("Failed to fetch vocabulary items. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchItems();
  }, [date]);

  function shuffleArray(array: GoldlistItem[]): GoldlistItem[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  function showNextCard() {
    if (currentIndex < vocabularyItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast({
        title: "All cards reviewed!",
        description: "You've gone through all the vocabulary items.",
      });
    }
  }

  async function handleAcquire(id: number) {
    try {
      await acquireItem(id);
      setVocabularyItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, is_acquired: true } : item
        )
      );
      toast({
        title: "Marked as acquired!",
        description: "This item has been marked as acquired.",
      });
      showNextCard();
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Error",
        description: "Failed to mark item as acquired. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleReviewMore(id: number) {
    try {
      await reviewMoreItem(id);
      const today = new Date().toISOString().split("T")[0];
      setVocabularyItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, last_review_at: today } : item
        )
      );
      toast({
        title: "Marked for review!",
        description: "This item has been marked for further review.",
      });
      showNextCard();
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Error",
        description: "Failed to mark item for review. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vocabulary for {date}</h1>
        <Link href="/vocab" className="text-blue-500 hover:underline">
          Back to all vocabulary 
        </Link>
      </div>
      {vocabularyItems.length === 0 ? (
        <p className="text-center text-gray-500">
          No vocabulary items for this date.
        </p>
      ) : (
        <div className="flex flex-col items-center">
          <VocabularyCard item={vocabularyItems[currentIndex]} />
          <div className="mt-4 flex justify-between w-full max-w-md">
            <Button
              onClick={() => handleAcquire(vocabularyItems[currentIndex].id)}
              disabled={vocabularyItems[currentIndex].is_acquired}
              className="w-[48%]"
            >
              {vocabularyItems[currentIndex].is_acquired
                ? "Acquired"
                : "Acquire it"}
            </Button>
            <Button
              onClick={() => handleReviewMore(vocabularyItems[currentIndex].id)}
              variant="outline"
              className="w-[48%]"
            >
              Need to Review More
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Card {currentIndex + 1} of {vocabularyItems.length}
          </p>
        </div>
      )}
      <Toaster />
    </div>
  );
}

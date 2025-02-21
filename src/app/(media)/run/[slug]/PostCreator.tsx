"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { createPost } from "@/app/actions/posts";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function CreatePost({
  slugText,
  sentenceIndexNumber,
}: {
  slugText: string;
  sentenceIndexNumber: number;
}) {
  const [content, setContent] = useState("");
  //   const [slug, setSlug] = useState("");
  //   const [sentenceIndex, setSentenceIndex] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const MAX_CHARS = 280; // Maximum characters allowed
  const COOLDOWN_TIME = 10; // Cooldown time in seconds

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSubmitDisabled && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((time) => time - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      setIsSubmitDisabled(false);
    }
    return () => clearInterval(timer);
  }, [isSubmitDisabled, remainingTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isSubmitDisabled) {
      //   await createPost(content, slug, Number.parseInt(sentenceIndex));
      await createPost(content, slugText, sentenceIndexNumber);
      setContent("");
      //   setSlug("");
      //   setSentenceIndex("");
      setIsSubmitDisabled(true);
      setRemainingTime(COOLDOWN_TIME);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="content">Post Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
          placeholder="What's on your mind? (Max 280 characters)"
          rows={3}
          maxLength={MAX_CHARS}
        />
        <p className="text-sm text-gray-500 mt-1">
          {MAX_CHARS - content.length} characters remaining
        </p>
      </div>
      {/* <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Enter a slug for your post"
        />
      </div>
      <div>
        <Label htmlFor="sentenceIndex">Sentence Index</Label>
        <Input
          id="sentenceIndex"
          type="number"
          value={sentenceIndex}
          onChange={(e) => setSentenceIndex(e.target.value)}
          placeholder="Enter the sentence index"
        />
      </div> */}
      <Button
        type="submit"
        disabled={isSubmitDisabled || content.trim().length === 0}
        className={isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""}
      >
        {isSubmitDisabled ? `Wait ${remainingTime}s to post again` : "Post"}
      </Button>
    </form>
  );
}

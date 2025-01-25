"use client";

import { useParams, useSearchParams } from "next/navigation";

export default function GoPage() {
  const params = useParams<{ slug: string }>();
  const lessonSlug = params.slug

  const searchParams = useSearchParams();
  const lineIndex = searchParams.get("i");

  console.log("Lesson Slug:", lessonSlug);
  console.log("Line Index:", lineIndex);
  return "Go";
}

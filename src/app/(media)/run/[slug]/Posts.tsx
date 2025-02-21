import CreatePost from "./PostCreator";

export default function Posts({
  slugText,
  sentenceIndexNumber,
}: {
  slugText: string;
  sentenceIndexNumber: number;
}) {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Posts</h1>
      <CreatePost
        slugText={slugText}
        sentenceIndexNumber={sentenceIndexNumber}
      />
    </main>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface VocabularyCardProps {
  item: {
    sentence: string;
    original_chunk: string;
    new_chunk: string;
    lesson_slug: string;
    created_at: string;
  };
}

export default function VocabularyCard({ item }: VocabularyCardProps) {
  const createdDate = new Date(item.created_at).toLocaleDateString();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {item.lesson_slug}
        </CardTitle>
        <CardDescription>Created on: {createdDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-2">
          <strong>Sentence:</strong> {item.sentence}
        </p>
        <p className="mb-2">
          <strong>Original:</strong> {item.original_chunk}
        </p>
        <p>
          <strong>New:</strong> {item.new_chunk}
        </p>
      </CardContent>
    </Card>
  );
}

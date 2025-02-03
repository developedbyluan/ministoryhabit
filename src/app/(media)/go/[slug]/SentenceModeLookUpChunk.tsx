import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type SentenceModeLookUpChunkProps = {
  text: string;
  definition: string;
};
export default function SentenceModeLookUpChunk({
  text,
  definition,
}: SentenceModeLookUpChunkProps) {
  return (
    <div className="flex border-t-2 p-1 pt-4 gap-3 items-start">
      <Button variant="outline" className="h-6 p-1 rounded-full">
        <Plus />
      </Button>
      <div>
        <p className="font-semibold">{text}</p>
        <p>{definition}</p>
      </div>
    </div>
  );
}

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ReadModeTextTranslationProps = {
  index: number;
  wordsElement: React.ReactElement[];
  translation: string;
};

export default function ReadModeTextTranslation({
  index,
  wordsElement,
  translation,
}: ReadModeTextTranslationProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex flex-wrap">{wordsElement}</div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <p className="font-semibold">Translation:</p>
          <p>{translation}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

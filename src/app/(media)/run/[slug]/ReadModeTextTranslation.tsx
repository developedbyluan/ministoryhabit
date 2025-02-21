import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Lyric = {
  start_time: number;
  end_time: number;
  text: string;
  ipa: string;
  translation: string;
};

type ReadModeTextTranslationProps = {
  index: number;
  wordsElement: React.ReactElement[];
  lyric: Lyric;
  handlePause: (startTime: number, index: number) => void;
};

export default function ReadModeTextTranslation({
  index,
  wordsElement,
  lyric,
  handlePause,
}: ReadModeTextTranslationProps) {
  return (
    <Popover>
      <PopoverTrigger
        onClick={() => handlePause(lyric.start_time, index)}
        asChild
      >
        <div className="flex flex-wrap">{wordsElement}</div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <p className="font-semibold">Translation:</p>
          <p>{lyric.translation === "" ? "<unavailable>" : lyric.translation}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

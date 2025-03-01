import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import EditableText from "./SentenceModeEditableText";

interface Translation {
  original: string;
  translation: string;
  isLoading: boolean;
}

interface SavedTranslationsProps {
  translations: Translation[];
  handleAddToGoldlist: (
    originalChunk: string,
    newChunk: string
  ) => Promise<boolean>;
}

export function SavedTranslations({
  translations,
  handleAddToGoldlist,
}: SavedTranslationsProps) {
  const [addedToGoldlist, setAddedToGoldlist] = useState<Set<number>>(
    new Set()
  );
  const [editedText, setEditedText] = useState<string>("");
  const [isTranslated, setIsTranslated] = useState<boolean>(false);

  const handleButtonClick = async (
    index: number,
    original: string,
    translation: string
  ) => {
    if (addedToGoldlist.has(index)) return;

    if (translation === "Translation failed") {
      setIsTranslated(false);
      return;
    }

    let result;

    if (editedText !== "") {
      result = await handleAddToGoldlist(original, editedText);
    } else {
      result = await handleAddToGoldlist(original, translation);
    }

    if (result) {
      setAddedToGoldlist((prev) => new Set(prev).add(index));
    }
  };

  const handleTextChange = (newText: string) => {
    setEditedText(newText);
  };

  return (
    <ScrollArea className="w-full rounded-md p-4">
      <div className="space-y-4">
        {translations.map((item, index) => (
          <div
            key={index}
            className="border-b pb-2 last:border-b-0 flex items-start gap-2"
          >
            <Button
              data-index={index}
              variant="outline"
              className={`h-6 p-1 rounded-full ${
                addedToGoldlist.has(index)
                  ? "bg-green-200 border border-green-500"
                  : ""
              }`}
              disabled={
                item.isLoading || addedToGoldlist.has(index) || isTranslated
              }
              onClick={() =>
                handleButtonClick(index, item.original, item.translation)
              }
            >
              {addedToGoldlist.has(index) ? (
                <Check stroke="green" strokeWidth={4} />
              ) : (
                <Plus />
              )}
            </Button>
            <div>
              <p className="font-medium">{item.original}</p>
              <div className="text-sm text-muted-foreground">
                {item.isLoading ? (
                  <span className="inline-flex items-center">
                    <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                    Translating...
                  </span>
                ) : (
                  <>
                    {item.translation === "Translation failed" ? (
                      item.translation
                    ) : (
                      <EditableText
                        isDisabled={false}
                        initialText={item.translation}
                        className="text-sm font-semibold"
                        onTextChange={(newText) => handleTextChange(newText)}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

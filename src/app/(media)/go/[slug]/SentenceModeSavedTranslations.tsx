import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Translation {
  original: string;
  translation: string;
  isLoading: boolean;
}

interface SavedTranslationsProps {
  translations: Translation[];
}

export function SavedTranslations({ translations }: SavedTranslationsProps) {
  return (
    <ScrollArea className="w-full rounded-md p-4">
      <div className="space-y-4">
        {translations.map((item, index) => (
          <div key={index} className="border-b pb-2 last:border-b-0 flex items-start gap-2">
            <Button variant="outline" className="h-6 p-1 rounded-full">
              <Plus />
            </Button>
            <div>
              <p className="font-medium">{item.original}</p>
              <p className="text-sm text-muted-foreground">
                {item.isLoading ? (
                  <span className="inline-flex items-center">
                    <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                    Translating...
                  </span>
                ) : (
                  item.translation
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

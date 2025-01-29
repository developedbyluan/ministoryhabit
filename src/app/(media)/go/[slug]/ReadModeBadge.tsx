import { idToSeriesText } from "@/utils/idToSeriesText";
import Image from "next/image";

type ReadModeBadgeProps = {
  imageUrl: string;
  title: string;
  seriesId: number;
};
export default function ReadModeBadge({
  imageUrl,
  title,
  seriesId,
}: ReadModeBadgeProps) {
  return (
    <div>
      <div className="flex gap-2 items-center">
        <Image
          className="rounded-lg w-16 h-16 object-cover"
          src={imageUrl}
          alt="lesson thumbnail"
          width={64}
          height={64}
        />
        <div className="max-w-[200px] space-y-1">
          <h2 className="truncate font-semibold">{title}</h2>
          <p className="truncate text-sm text-slate-600">{idToSeriesText(seriesId)}</p>
        </div>
      </div>
    </div>
  );
}

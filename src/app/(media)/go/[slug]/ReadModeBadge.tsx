import Image from "next/image";

type ReadModeBadgeProps = {
  imageUrl: string;
  title: string;
  playlistName: string;
};
export default function ReadModeBadge({
  imageUrl,
  title,
  playlistName,
}: ReadModeBadgeProps) {
  return (
    <div>
      <div className="flex gap-2 items-center">
        {imageUrl && (
          <Image
            className="rounded-lg w-16 h-16 object-cover"
            src={imageUrl}
            alt="lesson thumbnail"
            width={64}
            height={64}
          />
        )}
        <div className="max-w-[250px] space-y-1">
          <h2 className="truncate font-semibold">{title}</h2>
          <p className="truncate text-sm text-slate-600">{playlistName}</p>
        </div>
      </div>
    </div>
  );
}

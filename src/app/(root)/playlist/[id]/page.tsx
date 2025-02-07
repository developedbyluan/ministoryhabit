import supabase from "@/utils/supabase";
import Link from "next/link";
import { Playlist, Song } from "@/types";

export const runtime = "edge";

async function fetchPlaylist(id: string): Promise<Playlist | null> {
  const { data: playlist, error } = await supabase
    .from("playlists")
    .select("*, songs(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching playlist:", error);
    return null;
  }

  return playlist as Playlist;
}

type Params = Promise<{ id: string }>;

interface PlaylistPageProps {
  params: Params;
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const { id } = await params;
  const playlist = await fetchPlaylist(id);

  if (!playlist) {
    return <div>Playlist not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to all playlists
        </Link>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">
              {playlist.name}
            </h1>
            <p className="text-gray-600 mb-6">
              Total songs: {playlist.songs.length}
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {playlist.songs.map((song: Song) => (
                <Link
                  key={song.id}
                  href={`/go/${song.slug}`}
                  className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">
                    {song.title}
                  </h2>
                  <p className="text-gray-600">{song.artist}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

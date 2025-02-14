"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchGenresData } from "@/app/actions/actions";
import { Genre, Playlist } from "@/types";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

export const runtime = "edge";

export default function CoursesPage() {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    fetchGenresData()
      .then((fetchedGenres) => {
        const genresWithTabs = fetchedGenres.map((genre) => ({
          ...genre,
          activeTab: "playlists" as const,
        }));
        setGenres(genresWithTabs);
      })
      .catch((error) => {
        console.error("Failed to fetch genres:", error);
      });
  }, []);

  const setGenreActiveTab = (genreId: string, tab: "playlists" | "songs") => {
    setGenres((prevGenres) =>
      prevGenres.map((genre) =>
        genre.id === genreId ? { ...genre, activeTab: tab } : genre
      )
    );
  };

  return (
    <>
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="flex gap-2 items-center text-2xl font-bold text-indigo-600"
              >
                <ChevronLeft className="scale-150" />
                <span>Courses</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="mt-2 max-w-3xl bg-white container mx-auto px-4 py-4">
        {genres.map((genre) => (
          <div key={genre.id} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 sticky top-0 bg-white z-10 py-2 border-b-2">
              🔴 {genre.name}
            </h2>
            <div className="mb-4">
              <button
                className={`mr-4 px-4 py-2 rounded ${
                  genre.activeTab === "playlists"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setGenreActiveTab(genre.id, "playlists")}
              >
                Playlists
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  genre.activeTab === "songs"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setGenreActiveTab(genre.id, "songs")}
              >
               Lessons 
              </button>
            </div>
            {genre.activeTab === "playlists" ? (
              <PlaylistsTab playlists={genre.playlists} />
            ) : (
              <SongsTab playlists={genre.playlists} />
            )}
          </div>
        ))}
      </div>
    </>
  );
}

interface PlaylistsTabProps {
  playlists: Playlist[];
}

function PlaylistsTab({ playlists }: PlaylistsTabProps) {
  return (
    <>
      {playlists.map((playlist) => (
        <div key={playlist.id} className="mb-6 border-2 border-gray-50 p-4">
          <h3 className="text-xl font-medium mb-2">
            <Link
              href={`/playlist/${playlist.id}`}
              className="text-blue-600 hover:underline"
            >
              {playlist.name}
            </Link>
          </h3>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-4">
              {playlist.songs.map((song) => (
                <Link
                  key={song.id}
                  href={`/go/${song.slug}`}
                  className="flex-shrink-0 w-64 p-4 bg-white rounded shadow hover:shadow-md transition-shadow duration-200 space-y-2"
                >
                  <Image
                    src={song.thumbnail_url}
                    width={300}
                    height={200}
                    alt="thumbnail"
                    className="rounded-md"
                  />
                  <p className="font-semibold">{song.title}</p>
                  <p className="text-gray-600">{song.artist}</p>
                  <p>
                    {song.paid && (
                      <span className="text-red-700 text-sm font-semibold px-2 py-1 rounded-md border">
                        VIP only
                      </span>
                    )}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

interface SongsTabProps {
  playlists: Playlist[];
}

function SongsTab({ playlists }: SongsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {playlists.flatMap((playlist) =>
        playlist.songs.map((song) => (
          <Link
            key={song.id}
            href={`/go/${song.slug}`}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <div className="p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                {song.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">{song.artist}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {playlist.name}
                </span>
                {song.paid && (
                  <span className="text-red-700 text-sm font-semibold px-2 py-1 rounded-md border">
                    VIP only
                  </span>
                )}
                <button className="text-blue-500 hover:text-blue-700 transition-colors duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

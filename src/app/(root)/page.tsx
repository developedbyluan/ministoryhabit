"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchGenresData } from "@/app/actions/actions";

export const runtime = 'edge';

export interface Song {
  id: string
  title: string
  artist: string
}

export interface Playlist {
  id: string
  name: string
  songs: Song[]
}

export interface Genre {
  id: string
  name: string
  playlists: Playlist[]
  activeTab: "playlists" | "songs"
}

export default function FavoriteSongs() {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Favorite Songs</h1>
      {genres.map((genre) => (
        <div key={genre.id} className="mb-8 h-screen overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 sticky top-0 bg-white z-10 py-2">
            {genre.name}
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
              Songs
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
  );
}

interface PlaylistsTabProps {
  playlists: Playlist[];
}

function PlaylistsTab({ playlists }: PlaylistsTabProps) {
  return (
    <>
      {playlists.map((playlist) => (
        <div key={playlist.id} className="mb-6">
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
                <div
                  key={song.id}
                  className="flex-shrink-0 w-64 p-4 bg-white rounded shadow"
                >
                  <p className="font-semibold">{song.title}</p>
                  <p className="text-gray-600">{song.artist}</p>
                </div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {playlists.flatMap((playlist) =>
        playlist.songs.map((song) => (
          <div
            key={song.id}
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
          </div>
        ))
      )}
    </div>
  );
}

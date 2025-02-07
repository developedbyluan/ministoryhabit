export interface Song {
  id: string;
  title: string;
  artist: string;
  slug: string;
  thumbnail_url: string
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

export interface Genre {
  id: string;
  name: string;
  playlists: Playlist[];
  activeTab: "playlists" | "songs";
}
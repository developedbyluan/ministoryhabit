export interface Song {
  id: string;
  title: string;
  artist: string;
  slug: string;
  thumbnail_url: string;
  paid: boolean;
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

export type LessonData = {
  id: string;
  media_url: string;
  paid: boolean;
  title: string;
  type: "video" | "audio";
  body: string;
  thumbnail_url: string;
  playlists: {
    id: string;
    name: string;
  }
};

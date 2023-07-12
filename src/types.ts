export type Track = {
  id: number;
  title: string;
  artist: string;
  isDuplicated: boolean;
  duration: number;
}

export type Playlist = {
  tracks: Track[];
}

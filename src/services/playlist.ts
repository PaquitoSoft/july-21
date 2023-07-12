import path from 'path';
import { promises as fs } from 'fs';
import { Playlist } from '@/types';
import { client } from '../supabase-client';

const DATA_FILE_PATH = path.join(process.cwd(), 'json', 'data.json');

// export async function getPlaylist(): Promise<Playlist> {
//   const dataContents = await fs.readFile(DATA_FILE_PATH, 'utf-8');
//   return JSON.parse(dataContents);
// }

export async function getPlaylist(): Promise<Playlist> {
  const { data } = await client
    .from('tracks')
    .select()
    .order('id', { ascending: true });

  return { tracks: data?.map(dbTrack => ({
    id: dbTrack.id,
    artist: dbTrack.artist,
    title: dbTrack.title,
    isDuplicated: dbTrack.is_duplicated,
    duration: dbTrack.length!
  })) || [] };
}

// export async function updatePlaylist(playlist: Playlist): Promise<Playlist> {
//   await fs.writeFile(DATA_FILE_PATH, JSON.stringify(playlist), { encoding: 'utf-8' });
//   return playlist;
// }

export async function updateTrackStatus(trackId: number, newStatus: boolean): Promise<void> {
  const { error } = await client
    .from('tracks')
    .update({ is_duplicated: newStatus })
    .eq('id', trackId)

  if (error) {
    throw error;
  }
}

'use client';

import cx from 'classnames';
import { getPlaylist, updateTrackStatus } from "@/services/playlist";
import { useCallback, useEffect, useState } from 'react';
import { Playlist, Track } from '@/types';
import { useSubscription } from '@/supabase-client';

type TTracksGridProps = {
  tracks: Track[];
  onToggleClick: (track: Track) => void;
}

function TracksGrid({ tracks, onToggleClick }: TTracksGridProps) {
  return (
    <div className="grid grid-cols-1 md:lg:xl:grid-cols-3 gap-4">
      {
        tracks.map(track => (
          <div
            key={track.id}
            className={cx(
              "p-4 md:p-8 flex flex-col items-center text-center group border cursor-pointer",
              { "hover:bg-slate-50": !track.isDuplicated },
              { "bg-red-200": track.isDuplicated },
            )}>
            <p className="text-xl font-medium text-slate-700 mt-3">{track.title}</p>
            <p className="mt-2 text-sm text-slate-500">{track.artist}</p>
            <button
              className="mt-4 rounded-md bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              type="button"
              onClick={() => onToggleClick(track) }
            >
              Toggle
            </button>
          </div>
        ))
      }
    </div>
  );
}

export default function Home() {
  const [playlist, setPlaylist] = useState<Playlist>();

  useEffect(() => {
    const loadData = async () => {
      const _playlist = await getPlaylist();
      setPlaylist(_playlist);
    }
    loadData();
  }, []);

  useSubscription([
    {
      entity: 'tracks',
      onDataUpdated: async (data: unknown) => {
        const updatedPlaylist = await getPlaylist();
        setPlaylist(updatedPlaylist);
      }
    }
  ]);

  const handleToggleTrackClick = useCallback((track: Track) => {
    updateTrackStatus(track.id, !track.isDuplicated);
  }, []);

  if (!playlist) {
    return (<p>Loading data...</p>);
  }

  return (
    <main className="min-h-screen py-4 md:py-8 px-8 md:px-24">
      <TracksGrid tracks={playlist.tracks} onToggleClick={handleToggleTrackClick} />
    </main>
  );
}

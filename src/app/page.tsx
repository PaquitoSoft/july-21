'use client';

import cx from 'classnames';
import { getPlaylist, updateTrackStatus } from "@/services/playlist";
import { useCallback, useEffect, useState } from 'react';
import { Playlist } from '@/types';
import { useSubscription } from '@/supabase-client';

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

  const handleToggleTrackClick = useCallback((trackId: number, isDuplcated: boolean) => {
    updateTrackStatus(trackId, isDuplcated);
  }, []);

  if (!playlist) {
    return (<p>Loading data...</p>);
  }

  return (
    <main className="min-h-screen py-8 px-24">
      <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-4">#</th>
            <th className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">Title</th>
            <th className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">Artist/s</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {playlist.tracks.map((track, index) => (
            <tr key={index} className={cx(
              { "bg-red-200": track.isDuplicated },
              { "hover:bg-slate-100 dark:hover:bg-gray-500": !track.isDuplicated }
            )}>
              <td className="p-4 w-4">{index + 1}</td>
              <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <a
                  className="underline"
                  href={`https://www.youtube.com/results?search_query=${track.artist}-${track.title}`}
                  target='_blank'
                >
                  {track.title}
                </a>
              </td>
              <td className="py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-white">{track.artist}</td>
              <td className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
                <button
                  className="rounded-md bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  type="button"
                  onClick={() => {
                    handleToggleTrackClick(track.id, !track.isDuplicated);
                  }}
                >
                  Toggle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

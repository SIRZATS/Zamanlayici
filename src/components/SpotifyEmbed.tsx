import React from 'react';
import { getSpotifyEmbedUrl } from '../../lib/spotify';
import { Music } from 'lucide-react';

interface SpotifyEmbedProps {
  url?: string | null;
}

export const SpotifyEmbed: React.FC<SpotifyEmbedProps> = ({ url }) => {
  const embedUrl = getSpotifyEmbedUrl(url);

  if (!embedUrl) {
    return null;
  }

  return (
    <div className="my-4 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 shadow-lg shadow-sky-950/20">
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-emerald-400 mb-1">
        <Music className="w-4 h-4 animate-bounce" />
        <span>Arka Plan Şarkısı</span>
      </div>
      <iframe
        src={embedUrl}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-xl"
      ></iframe>
    </div>
  );
};

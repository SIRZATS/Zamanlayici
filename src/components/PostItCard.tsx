import React from 'react';
import { Memory, User } from '../types';
import { SpotifyEmbed } from './SpotifyEmbed';
import { Heart, MessageCircle, MapPin, Calendar, Lock } from 'lucide-react';

interface PostItCardProps {
  memory: Memory;
  currentUser: User;
  onSelect: (memory: Memory) => void;
  onLikeToggle: (memoryId: string) => void;
  rotationIndex?: number;
}

export const PostItCard: React.FC<PostItCardProps> = ({
  memory,
  currentUser,
  onSelect,
  onLikeToggle,
  rotationIndex = 0,
}) => {
  const isLiked = memory.likes.includes(currentUser.id);
  const isEren = memory.authorId === 'eren';

  // Rotation variations for organic clothesline feel
  const rotations = ['rotate-1', '-rotate-2', 'rotate-2', '-rotate-1'];
  const rotationClass = rotations[rotationIndex % rotations.length];

  return (
    <div
      className={`relative w-72 md:w-80 flex-shrink-0 bg-zinc-900 text-zinc-100 rounded-2xl p-5 shadow-2xl border border-zinc-800 transition-all duration-300 hover:scale-105 hover:rotate-0 hover:z-20 ${rotationClass}`}
    >
      {/* Wooden Clothespeg / Clip Graphic at Top Center */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
        <div className="w-4 h-7 bg-amber-700 border border-amber-900 rounded-sm shadow-md flex items-center justify-center relative">
          <div className="w-3 h-1 bg-zinc-400 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full absolute -bottom-1"></div>
        </div>
      </div>

      {/* 1. Top Header: Date & Author Badge */}
      <div className="flex items-center justify-between gap-2 mb-3 pt-1">
        <span className="text-[11px] font-mono font-medium text-zinc-400 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-zinc-500" />
          {memory.date}
        </span>

        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
            isEren
              ? 'bg-blue-950/80 text-sky-400 border-blue-800'
              : 'bg-purple-950/80 text-purple-300 border-purple-800'
          }`}
        >
          {isEren ? 'Eren 💙' : 'Özlem 💖'}
        </span>
      </div>

      {/* 2. Optional Image */}
      {memory.coverImage && (
        <div
          onClick={() => onSelect(memory)}
          className="w-full h-44 rounded-xl overflow-hidden mb-3 bg-zinc-950 border border-zinc-800/80 cursor-pointer shadow-inner relative group"
        >
          <img
            src={memory.coverImage}
            alt={memory.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {memory.privacy === 'private_locked' && (
            <div className="absolute top-2 right-2 bg-zinc-950/80 p-1.5 rounded-full text-rose-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      )}

      {/* 3. Note Title & Content */}
      <div onClick={() => onSelect(memory)} className="cursor-pointer">
        <h3 className="font-bold text-base text-white leading-tight mb-1 hover:text-rose-400 transition-colors">
          {memory.title}
        </h3>
        <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3 mb-3">
          {memory.content}
        </p>
      </div>

      {/* 4. Optional Mini Spotify Embed */}
      {memory.spotifyUrl && (
        <div className="mb-3 rounded-lg overflow-hidden border border-zinc-800 shadow-sm">
          <SpotifyEmbed spotifyUrl={memory.spotifyUrl} height={80} />
        </div>
      )}

      {/* 5. Bottom Actions (Likes & Comments) */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
        {memory.location ? (
          <span className="flex items-center gap-1 text-[11px] text-zinc-400 truncate max-w-[140px]">
            <MapPin className="w-3 h-3 text-rose-400" />
            {memory.location}
          </span>
        ) : (
          <span className="text-[10px] text-zinc-500">Ortak Anı</span>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLikeToggle(memory.id);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-800/60 hover:bg-rose-950/40 text-zinc-300 hover:text-rose-400 transition-all text-xs font-semibold"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isLiked ? 'fill-rose-500 text-rose-500' : 'text-zinc-400'
              }`}
            />
            <span>{memory.likes.length}</span>
          </button>

          <button
            onClick={() => onSelect(memory)}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-800/60 hover:bg-blue-950/40 text-zinc-300 hover:text-blue-400 transition-all text-xs font-semibold"
          >
            <MessageCircle className="w-3.5 h-3.5 text-zinc-400" />
            <span>{memory.comments.length}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

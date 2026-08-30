import React from 'react';
import { Memory, User } from '../types';
import { SpotifyEmbed } from './SpotifyEmbed';
import { Heart, MessageCircle, MapPin, Calendar, Lock } from 'lucide-react';

interface PolaroidCardProps {
  memory: Memory;
  currentUser: User;
  onSelect: (memory: Memory) => void;
  onLikeToggle: (memoryId: string) => void;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({
  memory,
  currentUser,
  onSelect,
  onLikeToggle,
}) => {
  const isLiked = memory.likes.includes(currentUser.id);
  const coverImg = memory.coverImage || '/images/beach_vacation_memory.png';

  return (
    <div className="polaroid-card group">
      
      {/* Square Photo Aspect Ratio */}
      <div onClick={() => onSelect(memory)} className="polaroid-img-wrapper cursor-pointer">
        <img
          src={coverImg}
          alt={memory.title}
          className="polaroid-img transition-transform duration-500 group-hover:scale-105"
        />
        {memory.privacy === 'private_locked' && (
          <div className="absolute top-3 right-3 bg-zinc-950/80 p-2 rounded-full text-rose-400">
            <Lock size={14} />
          </div>
        )}
      </div>

      {/* Polaroid Handwritten Caption & Metadata */}
      <div>
        <h3
          onClick={() => onSelect(memory)}
          className="polaroid-title cursor-pointer hover:text-rose-600 transition-colors"
        >
          {memory.title}
        </h3>

        {/* Date & Location */}
        <div className="polaroid-meta">
          <span className="flex items-center gap-1">
            <Calendar size={13} className="text-zinc-400" />
            {memory.date}
          </span>
          {memory.location && (
            <span className="flex items-center gap-1 truncate">
              <MapPin size={13} className="text-rose-500" />
              {memory.location}
            </span>
          )}
        </div>

        {/* Embedded Mini Spotify Player if present */}
        {memory.spotifyUrl && (
          <div className="mb-3 rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
            <SpotifyEmbed spotifyUrl={memory.spotifyUrl} height={80} />
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-xs">
          <div className="flex items-center gap-2">
            <img
              src={memory.authorAvatar}
              alt={memory.authorName}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-zinc-300"
            />
            <span className="font-bold text-zinc-800">{memory.authorName}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLikeToggle(memory.id);
              }}
              className="flex items-center gap-1 text-zinc-600 hover:text-rose-600 font-semibold transition-colors"
            >
              <Heart
                size={15}
                className={isLiked ? 'fill-rose-500 text-rose-500' : 'text-zinc-400'}
              />
              <span>{memory.likes.length}</span>
            </button>

            <button
              onClick={() => onSelect(memory)}
              className="flex items-center gap-1 text-zinc-600 hover:text-blue-600 font-semibold transition-colors"
            >
              <MessageCircle size={15} className="text-zinc-400" />
              <span>{memory.comments.length}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

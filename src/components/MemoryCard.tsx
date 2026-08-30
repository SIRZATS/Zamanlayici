import React from 'react';
import { Memory, User, SharedBoard } from '../types';
import { Lock, Eye, Users, Heart, MessageSquare, MapPin, Calendar, ShieldCheck } from 'lucide-react';

interface MemoryCardProps {
  memory: Memory;
  currentUser: User;
  sharedBoards: SharedBoard[];
  onSelect: (memory: Memory) => void;
  onLikeToggle: (memoryId: string) => void;
  unlockedMemoryIds: string[];
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  currentUser,
  sharedBoards,
  onSelect,
  onLikeToggle,
  unlockedMemoryIds,
}) => {
  const isAuthor = memory.authorId === currentUser.id;
  const isLocked = memory.privacy === 'private_locked';
  const isUnlockedBySession = unlockedMemoryIds.includes(memory.id);

  const board = sharedBoards.find((b) => b.id === memory.sharedBoardId);
  const isLiked = memory.likes.includes(currentUser.id);

  return (
    <div
      onClick={() => onSelect(memory)}
      className="memory-card group cursor-pointer border border-slate-800 hover:border-sky-400/80 bg-slate-900/90 rounded-2xl shadow-md hover:shadow-2xl hover:shadow-sky-950/40 transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Cover Photo / Locked Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          {memory.coverImage ? (
            <img
              src={memory.coverImage}
              alt={memory.title}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                isLocked && !isUnlockedBySession && !isAuthor ? 'blur-md brightness-50 scale-110' : ''
              }`}
            />
          ) : (
            <div className="w-full h-full journal-paper flex items-center justify-center p-6 text-center border-b border-slate-800">
              <span className="font-handwriting text-2xl text-slate-400 line-clamp-3">
                "{memory.content.substring(0, 100)}..."
              </span>
            </div>
          )}

          {/* Privacy Badge Overlay */}
          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
            {memory.privacy === 'private_locked' && (
              <span className="badge badge-locked shadow-lg backdrop-blur-md">
                <Lock className="w-3 h-3" />
                {isUnlockedBySession || isAuthor ? 'PIN Doğrulandı' : 'Kilitli Günlük'}
              </span>
            )}
            {memory.privacy === 'selective_friends' && (
              <span className="badge badge-selective shadow-lg backdrop-blur-md">
                <Users className="w-3 h-3" />
                Özel İzinli ({memory.allowedUserIds.length} Kişi)
              </span>
            )}
            {memory.privacy === 'shared_space' && (
              <span className="badge badge-shared shadow-lg backdrop-blur-md">
                <Users className="w-3 h-3" />
                {board ? board.title : 'Ortak Pano'}
              </span>
            )}
            {memory.privacy === 'private_me' && (
              <span className="badge badge-private shadow-lg backdrop-blur-md">
                <ShieldCheck className="w-3 h-3" />
                Sadece Ben
              </span>
            )}
          </div>

          {/* Mood Badge */}
          {memory.mood && (
            <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 px-2.5 py-1 rounded-full text-xs font-semibold text-sky-300 shadow-sm">
              {memory.mood}
            </div>
          )}

          {/* Locked Visual Mask */}
          {isLocked && !isUnlockedBySession && !isAuthor && (
            <div className="absolute inset-0 bg-[#070d1e]/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center mb-2 animate-bounce">
                <Lock className="w-6 h-6 text-rose-400" />
              </div>
              <p className="font-serif font-bold text-lg text-rose-200">Kilitli Sayfa</p>
              <p className="text-xs text-slate-300 mt-1 max-w-[200px]">
                Açmak için tıklayıp PIN kodunu giriniz.
              </p>
            </div>
          )}
        </div>

        {/* Card Main Body */}
        <div className="p-5">
          {/* Date & Location */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              {memory.date}
            </span>
            {memory.location && (
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                {memory.location}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif font-bold text-lg text-slate-100 line-clamp-1 group-hover:text-sky-300 transition-colors">
            {memory.title}
          </h3>

          {/* Content Snippet */}
          <p className="text-slate-400 text-sm mt-2 line-clamp-2 leading-relaxed">
            {isLocked && !isUnlockedBySession && !isAuthor
              ? '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
              : memory.content}
          </p>

          {/* Tags */}
          {memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {memory.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-semibold text-sky-300 bg-sky-950/60 border border-sky-900/60 px-2 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Author & Social Actions */}
      <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
        {/* Author Info */}
        <div className="flex items-center gap-2">
          <img
            src={memory.authorAvatar}
            alt={memory.authorName}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
          />
          <span className="text-xs font-semibold text-slate-300 truncate max-w-[110px]">
            {memory.authorName}
          </span>
        </div>

        {/* Social Interactions */}
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLikeToggle(memory.id);
            }}
            className={`flex items-center gap-1 text-xs font-semibold transition-transform active:scale-125 ${
              isLiked ? 'text-rose-400' : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{memory.likes.length}</span>
          </button>

          <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
            <MessageSquare className="w-4 h-4" />
            <span>{memory.comments.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Memory, User, SharedBoard } from '../types';
import { Calendar, MapPin, Lock, Heart, MessageSquare } from 'lucide-react';

interface TimelineViewProps {
  memories: Memory[];
  currentUser: User;
  sharedBoards: SharedBoard[];
  onSelectMemory: (memory: Memory) => void;
  unlockedMemoryIds: string[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  memories,
  currentUser,
  sharedBoards,
  onSelectMemory,
  unlockedMemoryIds,
}) => {
  const sortedMemories = [...memories].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold text-sky-400 uppercase tracking-widest bg-sky-950/80 border border-sky-800 px-3 py-1 rounded-full">
          Zaman Yolculuğu
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mt-2">
          Anı Zaman Tüneli
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Tüm günlük sayfalarınız ve ortak hatıralarınız kronolojik sıra ile dizilmiştir.
        </p>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-sky-500/40 ml-4 md:ml-32 space-y-8 pl-6 md:pl-8">
        {sortedMemories.map((memory) => {
          const isAuthor = memory.authorId === currentUser.id;
          const isLocked = memory.privacy === 'private_locked';
          const isUnlockedBySession = unlockedMemoryIds.includes(memory.id);

          const isLiked = memory.likes.includes(currentUser.id);

          return (
            <div key={memory.id} className="relative group">
              {/* Timeline Dot Marker */}
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-[#070d1e] border-4 border-sky-400 group-hover:scale-125 transition-transform shadow-lg shadow-sky-500/50"></div>

              {/* Date Badge on Desktop Left Side */}
              <div className="hidden md:block absolute -left-36 top-1 text-right w-28">
                <span className="text-xs font-bold text-slate-200 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg shadow-sm">
                  {memory.date}
                </span>
              </div>

              {/* Timeline Item Content Card */}
              <div
                onClick={() => onSelectMemory(memory)}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-md hover:shadow-2xl hover:border-sky-400/80 cursor-pointer transition-all duration-300"
              >
                {/* Mobile Date Header */}
                <div className="md:hidden flex items-center gap-1.5 text-xs font-bold text-sky-400 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{memory.date}</span>
                </div>

                {/* Privacy Badge & Mood */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={memory.authorAvatar}
                      alt={memory.authorName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-slate-200">{memory.authorName}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {memory.privacy === 'private_locked' && (
                      <span className="badge badge-locked">
                        <Lock className="w-3 h-3" />
                        {isUnlockedBySession || isAuthor ? 'Açık' : 'Kilitli'}
                      </span>
                    )}
                    {memory.privacy === 'selective_friends' && (
                      <span className="badge badge-selective">👥 Özel İzinli</span>
                    )}
                    {memory.privacy === 'shared_space' && (
                      <span className="badge badge-shared">🌍 Ortak Pano</span>
                    )}
                    {memory.privacy === 'private_me' && (
                      <span className="badge badge-private">👤 Sadece Ben</span>
                    )}
                  </div>
                </div>

                {/* Cover Image */}
                {memory.coverImage && (
                  <div className="relative h-44 w-full rounded-xl overflow-hidden mb-3 bg-slate-950">
                    <img
                      src={memory.coverImage}
                      alt={memory.title}
                      className={`w-full h-full object-cover ${
                        isLocked && !isUnlockedBySession && !isAuthor ? 'blur-md brightness-50' : ''
                      }`}
                    />
                    {isLocked && !isUnlockedBySession && !isAuthor && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-rose-300 text-xs font-bold gap-1">
                        <Lock className="w-4 h-4 text-rose-400" />
                        <span>Kilitli Görsel (PIN Gerekli)</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Title & Snippet */}
                <h3 className="font-serif font-bold text-lg text-white group-hover:text-sky-300 transition-colors">
                  {memory.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {isLocked && !isUnlockedBySession && !isAuthor
                    ? '••••••••••••••••••••••••••••••••••••••••••••••••'
                    : memory.content}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
                  {memory.location ? (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      {memory.location}
                    </span>
                  ) : (
                    <span></span>
                  )}

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-slate-400">
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      {memory.likes.length}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-400">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {memory.comments.length}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

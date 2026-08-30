import React, { useRef } from 'react';
import { Memory, User } from '../types';
import { PostItCard } from './PostItCard';
import { Plus, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface ClotheslineTimelineProps {
  memories: Memory[];
  currentUser: User;
  onSelectMemory: (memory: Memory) => void;
  onLikeToggle: (memoryId: string) => void;
  onOpenCreateModal: () => void;
}

export const ClotheslineTimeline: React.FC<ClotheslineTimelineProps> = ({
  memories,
  currentUser,
  onSelectMemory,
  onLikeToggle,
  onOpenCreateModal,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative my-6">
      
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            İpe Asılı Anılar Zaman Tüneli
          </h2>
          <p className="text-xs text-zinc-400">
            Eren & Özlem ortak anıları ve post-it notları (Sağa/sola kaydırabilirsiniz)
          </p>
        </div>

        {/* Carousel Arrow Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors shadow-md"
            title="Sola Kaydır"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors shadow-md"
            title="Sağa Kaydır"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CLOTHESLINE ROPE LINE */}
      <div className="relative pt-6 pb-4">
        {/* Dashed Clothesline Rope Line across the top */}
        <div className="absolute top-12 left-0 right-0 border-t-2 border-dashed border-amber-800/60 z-10 pointer-events-none"></div>

        {/* Horizontal Scrollable Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex flex-row overflow-x-auto gap-8 py-10 px-6 scrollbar-thin scroll-smooth select-none"
        >
          {/* 1. Trigger Card: "İpe Yeni Anı As" */}
          <div
            onClick={onOpenCreateModal}
            className="relative w-72 md:w-80 flex-shrink-0 bg-transparent border-2 border-dashed border-zinc-700 hover:border-rose-500/70 hover:bg-zinc-900/40 text-zinc-400 hover:text-white rounded-2xl p-6 shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[320px] group"
          >
            {/* Wooden Clothespeg Graphic */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
              <div className="w-4 h-7 bg-amber-700 border border-amber-900 rounded-sm shadow-md flex items-center justify-center relative">
                <div className="w-3 h-1 bg-zinc-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full absolute -bottom-1"></div>
              </div>
            </div>

            <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">İpe Yeni Anı As</h3>
            <p className="text-xs text-zinc-500 max-w-[180px]">
              Fotoğraf, not veya şarkı ekleyerek ipe yeni bir post-it tutturun.
            </p>
          </div>

          {/* 2. Clothesline Post-it Cards Stream */}
          {memories.map((mem, index) => (
            <PostItCard
              key={mem.id}
              memory={mem}
              currentUser={currentUser}
              onSelect={onSelectMemory}
              onLikeToggle={onLikeToggle}
              rotationIndex={index}
            />
          ))}

        </div>
      </div>

    </div>
  );
};

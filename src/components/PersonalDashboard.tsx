import React, { useState } from 'react';
import { Memory, User } from '../types';
import { SpotifyEmbed } from './SpotifyEmbed';
import { PolaroidCard } from './PolaroidCard';
import confetti from 'canvas-confetti';
import { Sparkles, Music, Heart, Lock, Smile, Coffee, Moon, BookOpen, PlusCircle } from 'lucide-react';

interface PersonalDashboardProps {
  ownerUser: User;
  currentUser: User;
  memories: Memory[];
  onAddMemory: (memory: Omit<Memory, 'id' | 'createdAt' | 'likes' | 'comments'>) => void;
  onLikeToggle: (memoryId: string) => void;
  onSelectMemory: (memory: Memory) => void;
}

export const PersonalDashboard: React.FC<PersonalDashboardProps> = ({
  ownerUser,
  currentUser,
  memories,
  onAddMemory,
  onLikeToggle,
  onSelectMemory,
}) => {
  const isOwner = currentUser.id === ownerUser.id;
  const isOzlem = ownerUser.username.toLowerCase() === 'özlem' || ownerUser.username.toLowerCase() === 'ozlem';

  // Default favorite songs
  const favoriteSongUrl = isOzlem
    ? 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT'
    : 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b';

  // Filter memories owned by this profile
  const userEntries = memories.filter((m) => m.authorId === ownerUser.id);

  const handlePokeClick = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#a855f7', '#c084fc', '#e9d5ff'],
    });
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Rich Header Profile Card */}
      <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <img
            src={ownerUser.avatar}
            alt={ownerUser.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-500/50 shadow-xl"
          />
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h2 className="text-2xl font-bold tracking-tight text-white">{ownerUser.name}'in Günlüğü</h2>
              <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20 text-xs font-semibold">
                😊 Keyifli & Aşık
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              @{ownerUser.username} • {isOwner ? 'Kişisel Özel Not ve Düşüncelerim' : 'Eşinin Günlük Notları (Salt-Okunur)'}
            </p>
          </div>
        </div>

        {!isOwner && (
          <button
            onClick={handlePokeClick}
            className="px-4 py-2 rounded-full text-xs font-bold bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all flex items-center gap-1.5"
          >
            <Heart className="w-4 h-4 fill-purple-400 text-purple-400" />
            <span>{ownerUser.name}'i Dürt 🐾</span>
          </button>
        )}
      </div>

      {/* 2. Top Spotify Favorite Track Card */}
      <div className="glass-card rounded-2xl p-5 border border-zinc-800/80">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
          <Music className="w-4 h-4 text-emerald-400" />
          <span>{ownerUser.name}'in Favori Şarkısı</span>
        </div>
        <SpotifyEmbed spotifyUrl={favoriteSongUrl} height={80} />
      </div>

      {/* 3. Thought Stream / Entries */}
      {userEntries.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center max-w-lg mx-auto my-8 border border-zinc-800">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4 text-purple-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            {ownerUser.name} henüz bir düşünce bırakmadı...
          </h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto mb-6">
            Ona bir not bırakması veya yeni bir anı paylaşması için sevimli bir dürtme yolla!
          </p>
          {!isOwner && (
            <button
              onClick={handlePokeClick}
              className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-lg shadow-purple-600/20 transition-all"
            >
              {ownerUser.name}'i Dürt 🐾
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userEntries.map((mem) => (
            <PolaroidCard
              key={mem.id}
              memory={mem}
              currentUser={currentUser}
              onSelect={onSelectMemory}
              onLikeToggle={onLikeToggle}
            />
          ))}
        </div>
      )}

    </div>
  );
};

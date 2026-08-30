import React, { useState } from 'react';
import { User, Memory } from '../types';
import { SpotifyEmbed } from './SpotifyEmbed';
import { BookOpen, PlusCircle, Lock, Eye, Calendar, MapPin, Smile, Music, Tag, Heart } from 'lucide-react';

interface PersonalSpaceProps {
  ownerUser: User;
  currentUser: User;
  memories: Memory[];
  onAddMemory: (memory: Omit<Memory, 'id' | 'createdAt' | 'likes' | 'comments'>) => void;
  onLikeToggle: (memoryId: string) => void;
  onSelectMemory: (memory: Memory) => void;
}

const MOODS = ['🔮 Umutlu', '💖 Sevgi Dolu', '☕ Keyifli', '🌅 Huzurlu', '🍀 Mutlu', '🌙 Nostaljik', '✨ Heyecanlı'];

export const PersonalSpace: React.FC<PersonalSpaceProps> = ({
  ownerUser,
  currentUser,
  memories,
  onAddMemory,
  onLikeToggle,
  onSelectMemory,
}) => {
  const isOwner = ownerUser.id === currentUser.id;

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(MOODS[0]);
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [location, setLocation] = useState('');

  // Filter memories owned by this space owner
  const ownerMemories = memories.filter(
    (m) => m.authorId === ownerUser.id && (m.privacy === 'private_me' || m.privacy === 'private_locked' || m.privacy === 'selective_friends')
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddMemory({
      title,
      content,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      date: new Date().toISOString().split('T')[0],
      location: location.trim() || undefined,
      mood,
      privacy: 'private_me',
      tags: [mood.replace(/[^a-zA-Z0-9-çğıöşüÇĞİÖŞÜ]/g, '')],
      allowedUserIds: ['eren', 'özlem'],
    });

    setTitle('');
    setContent('');
    setSpotifyUrl('');
    setLocation('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={ownerUser.avatar}
            alt={ownerUser.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-sky-400/50 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
                {ownerUser.name}'in Kişisel Günlük Alanı
              </h2>
              {!isOwner && (
                <span className="bg-sky-950 text-sky-300 border border-sky-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Eye size={12} /> Salt Okunur Görünüm
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isOwner
                ? 'Kendi notlarınızı, hislerinizi ve arka plan şarkılarınızı ekleyebilirsiniz.'
                : `${ownerUser.name} tarafından kaleme alınan günlüklere göz atmaktasınız.`}
            </p>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary shadow-lg shadow-sky-600/30 flex items-center gap-2 self-stretch sm:self-auto"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Yeni Günlük / Not Ekle</span>
          </button>
        )}
      </div>

      {/* Entry List Grid */}
      {ownerMemories.length === 0 ? (
        <div className="text-center py-16 journal-paper rounded-3xl p-8 border border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-xl text-white">Henüz Not Eklenmemiş</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            {isOwner
              ? 'Bu alana ilk günlük yazınızı veya özel hislerinizi yazarak başlayabilirsiniz.'
              : `${ownerUser.name} henüz kişisel not paylaşmamış.`}
          </p>
          {isOwner && (
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
              İlk Notu Yaz
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ownerMemories.map((entry) => {
            const isLiked = entry.likes.includes(currentUser.id);

            return (
              <div
                key={entry.id}
                onClick={() => onSelectMemory(entry)}
                className="bg-slate-900/90 border border-slate-800 hover:border-sky-400/70 rounded-2xl p-6 shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{entry.date}</span>
                      {entry.location && (
                        <>
                          <span>•</span>
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{entry.location}</span>
                        </>
                      )}
                    </div>

                    {entry.mood && (
                      <span className="bg-sky-950 border border-sky-800 text-sky-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {entry.mood}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-xl text-white mb-2">{entry.title}</h3>
                  <p className="text-slate-300 text-sm journal-paper p-4 rounded-xl leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>

                  {/* Spotify Embed Player */}
                  {entry.spotify_url && <SpotifyEmbed url={entry.spotify_url} />}
                </div>

                <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={entry.authorAvatar}
                      alt={entry.authorName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-semibold text-slate-300">{entry.authorName}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLikeToggle(entry.id);
                    }}
                    className={`flex items-center gap-1 font-bold ${
                      isLiked ? 'text-rose-400' : 'text-slate-400 hover:text-rose-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{entry.likes.length}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content p-6 md:p-8 max-w-lg bg-[#0c1633] text-slate-100 border border-slate-800 rounded-3xl shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-white mb-1">
              Kişisel Not / Günlük Ekle
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Duygularınızı kaydedin ve dilerseniz Spotify şarkı linki ekleyin.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Başlık *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Bugün aklımdan geçenler..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">İçerik *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Sevgili günlük..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none text-sm journal-paper"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Ruh Hali (Mood)</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-semibold"
                  >
                    {MOODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Konum</label>
                  <input
                    type="text"
                    placeholder="Örn: Evim, Kadıköy"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                  <Music className="w-3.5 h-3.5 text-emerald-400" /> Spotify Şarkı Linki (İsteğe Bağlı)
                </label>
                <input
                  type="text"
                  placeholder="https://open.spotify.com/track/..."
                  value={spotifyUrl}
                  onChange={(e) => setSpotifyUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-emerald-300 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">
                  İptal
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

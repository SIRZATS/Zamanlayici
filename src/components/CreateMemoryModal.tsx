import React, { useState } from 'react';
import { Memory, User } from '../types';
import { X, Music, MapPin, Smile, Image as ImageIcon, Users, BookOpen } from 'lucide-react';

interface CreateMemoryModalProps {
  currentUser: User;
  onClose: () => void;
  onSubmit: (memory: Omit<Memory, 'id' | 'createdAt' | 'likes' | 'comments'>) => void;
}

export const CreateMemoryModal: React.FC<CreateMemoryModalProps> = ({
  currentUser,
  onClose,
  onSubmit,
}) => {
  const [entryType, setEntryType] = useState<'shared_space' | 'personal'>('shared_space');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState('💖 Aşık');
  const [coverImage, setCoverImage] = useState('/images/beach_vacation_memory.png');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSubmit({
      title,
      content,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      date: new Date().toISOString().split('T')[0],
      location: location.trim() || undefined,
      spotifyUrl: spotifyUrl.trim() || undefined,
      coverImage,
      privacy: entryType === 'shared_space' ? 'shared_space' : 'selective_friends',
      tags: entryType === 'shared_space' ? ['OrtakAnı'] : ['Günlük'],
      allowedUserIds: ['eren', 'özlem'],
    });

    onClose();
  };

  return (
    <div className="modal-fixed-overlay" onClick={onClose}>
      <div className="modal-card-box" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <h3 className="text-xl font-bold text-white mb-1">Yeni Anı / Not Ekle</h3>
        <p className="text-xs text-zinc-400 mb-5">
          Eren & Özlem özel hafıza panosuna yeni bir anı veya not ekleyin.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. Type Selector Tabs ([ Ortak Anı ] veya [ Kişisel Günlük ]) */}
          <div className="modal-tab-selector">
            <button
              type="button"
              onClick={() => setEntryType('shared_space')}
              className={`modal-tab-btn ${entryType === 'shared_space' ? 'active-shared' : ''}`}
            >
              <Users size={14} />
              <span>Ortak Anı</span>
            </button>

            <button
              type="button"
              onClick={() => setEntryType('personal')}
              className={`modal-tab-btn ${entryType === 'personal' ? 'active-personal' : ''}`}
            >
              <BookOpen size={14} />
              <span>Kişisel Günlük</span>
            </button>
          </div>

          {/* 2. Title Input */}
          <div>
            <label className="form-label-title">Başlık *</label>
            <input
              type="text"
              required
              placeholder="Örn: Gün Batımında Sahil Yürüyüşümüz..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          {/* 3. Content Textarea */}
          <div>
            <label className="form-label-title">İçerik / Not *</label>
            <textarea
              required
              placeholder="O gün hissettiklerini buraya yaz..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-textarea"
            ></textarea>
          </div>

          {/* 4. Extra Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <div>
              <label className="form-label-title flex items-center gap-1">
                <Music size={12} className="text-emerald-400" /> Spotify Linki
              </label>
              <input
                type="url"
                placeholder="https://open.spotify.com/track/..."
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label-title flex items-center gap-1">
                <MapPin size={12} className="text-rose-400" /> Konum Ekle
              </label>
              <input
                type="text"
                placeholder="Örn: Kadıköy Sahil"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-input"
              />
            </div>

          </div>

          {/* Mood Picker & Photo Presets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            
            <div>
              <label className="form-label-title flex items-center gap-1">
                <Smile size={12} className="text-amber-400" /> Ruh Hali
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="form-input cursor-pointer"
              >
                <option value="💖 Aşık">💖 Aşık</option>
                <option value="😊 Mutlu">😊 Mutlu</option>
                <option value="☕ Dinleniyor">☕ Dinleniyor</option>
                <option value="🌙 Dalgın">🌙 Dalgın</option>
              </select>
            </div>

            <div>
              <label className="form-label-title flex items-center gap-1">
                <ImageIcon size={12} className="text-sky-400" /> Görsel Çerçeve
              </label>
              <div className="flex gap-2">
                {['/images/beach_vacation_memory.png', '/images/family_picnic_memory.png', '/images/cozy_coffee_journal.png'].map(
                  (img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="preset"
                      onClick={() => setCoverImage(img)}
                      className={`w-9 h-9 rounded-lg object-cover cursor-pointer border-2 transition-all ${
                        coverImage === img ? 'border-rose-500 scale-105 shadow-sm' : 'border-transparent opacity-50'
                      }`}
                    />
                  )
                )}
              </div>
            </div>

          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button type="button" onClick={onClose} className="btn-poke-quick">
              İptal
            </button>
            <button type="submit" className="btn-new-memory">
              Paylaş ✨
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

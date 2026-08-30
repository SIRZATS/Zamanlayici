import React, { useState } from 'react';
import { Memory, User } from '../types';
import { RelationshipCounter } from './RelationshipCounter';
import { PokeButton } from './PokeButton';
import { MemoryCard } from './MemoryCard';
import { Sparkles, PlusCircle, Users, Image as ImageIcon, Calendar } from 'lucide-react';

interface SharedTimelineProps {
  currentUser: User;
  partnerUser: User;
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  onLikeToggle: (memoryId: string) => void;
  onAddSharedMemory: (memory: Omit<Memory, 'id' | 'createdAt' | 'likes' | 'comments'>) => void;
}

export const SharedTimeline: React.FC<SharedTimelineProps> = ({
  currentUser,
  partnerUser,
  memories,
  onSelectMemory,
  onLikeToggle,
  onAddSharedMemory,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [coverImage, setCoverImage] = useState('/images/beach_vacation_memory.png');

  // Filter shared memories
  const sharedMemories = memories.filter((m) => m.privacy === 'shared_space');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddSharedMemory({
      title,
      content,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      date,
      location: location.trim() || undefined,
      coverImage,
      privacy: 'shared_space',
      tags: ['OrtakAnı', 'Aşk'],
      allowedUserIds: ['eren', 'özlem'],
    });

    setTitle('');
    setContent('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Box */}
      <div className="personal-space-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="badge badge-shared mb-2">
            <Users size={14} /> Ortak Anı Odası
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mt-1">
            Eren & Özlem Ortak Zaman Tüneli
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Birlikte biriktirdiğiniz fotoğraflar, anılar ve özel günler.
          </p>
        </div>

        {/* Realtime Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <PokeButton currentUser={currentUser} partnerUser={partnerUser} />
          
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Ortak Anı Ekle</span>
          </button>
        </div>
      </div>

      {/* Live Relationship Counter */}
      <RelationshipCounter startDateStr="2024-01-01" />

      {/* Shared Memories Timeline Grid */}
      {sharedMemories.length === 0 ? (
        <div className="text-center py-16 journal-paper rounded-3xl p-8 border border-slate-800">
          <Sparkles className="w-12 h-12 text-sky-400 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-xl text-white">Henüz Ortak Anı Eklenmemiş</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            Birlikte çekindiğiniz fotoğrafları veya unutulmaz anılarınızı ekleyerek başlatabilirsiniz!
          </p>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            İlk Ortak Anıyı Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sharedMemories.map((mem) => (
            <MemoryCard
              key={mem.id}
              memory={mem}
              currentUser={currentUser}
              sharedBoards={[]}
              onSelect={onSelectMemory}
              onLikeToggle={onLikeToggle}
              unlockedMemoryIds={['eren', 'özlem']}
            />
          ))}
        </div>
      )}

      {/* Add Shared Memory Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content p-6 md:p-8 max-w-lg bg-[#0c1633] text-slate-100 border border-slate-800 rounded-3xl shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-white mb-1">Ortak Anı Ekle</h3>
            <p className="text-xs text-slate-400 mb-6">
              İkinizin de zaman tünelinde yer alacak yeni bir fotoğraf veya anı kaydı oluşturun.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Başlık *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Birlikte Ege Tatilimiz..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Anı Notu *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="O gün yaşadığınız güzel anları yazın..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none text-sm journal-paper"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Tarih</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Konum</label>
                  <input
                    type="text"
                    placeholder="Örn: Bodrum, Sahil"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Görsel Seçimi</label>
                <div className="flex gap-2">
                  {['/images/beach_vacation_memory.png', '/images/family_picnic_memory.png', '/images/cozy_coffee_journal.png'].map(
                    (img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="preset"
                        onClick={() => setCoverImage(img)}
                        className={`w-14 h-14 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                          coverImage === img ? 'border-sky-400 scale-105 shadow-md' : 'border-transparent opacity-60'
                        }`}
                      />
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">
                  İptal
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Ortak Anıyı Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

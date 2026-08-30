import React, { useState } from 'react';
import { User, SharedBoard, PrivacyType, Memory } from '../types';
import { X, Lock, Users, ShieldCheck, Image, MapPin, PlusCircle, Check } from 'lucide-react';

interface NewMemoryModalProps {
  currentUser: User;
  users: User[];
  sharedBoards: SharedBoard[];
  onClose: () => void;
  onSubmit: (memory: Omit<Memory, 'id' | 'createdAt' | 'likes' | 'comments'>) => void;
  defaultBoardId?: string;
}

const MOOD_OPTIONS = ['🔮 Umutlu', '✨ Heyecanlı', '🌅 Huzurlu', '🍀 Mutlu', '☕ Keyifli', '💖 Sevgi Dolu', '🌙 Nostaljik'];

const PRESET_IMAGES = [
  '/images/cozy_coffee_journal.png',
  '/images/beach_vacation_memory.png',
  '/images/family_picnic_memory.png',
  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
];

export const NewMemoryModal: React.FC<NewMemoryModalProps> = ({
  currentUser,
  users,
  sharedBoards,
  onClose,
  onSubmit,
  defaultBoardId,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState(MOOD_OPTIONS[0]);
  const [coverImage, setCoverImage] = useState(PRESET_IMAGES[0]);
  
  const [privacy, setPrivacy] = useState<PrivacyType>(defaultBoardId ? 'shared_space' : 'private_locked');
  const [pinCode, setPinCode] = useState('1234');
  const [allowedUserIds, setAllowedUserIds] = useState<string[]>([currentUser.id]);
  const [sharedBoardId, setSharedBoardId] = useState<string>(defaultBoardId || sharedBoards[0]?.id || '');
  const [tagsInput, setTagsInput] = useState('Anılarım, Günlük');

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleAllowedUser = (userId: string) => {
    if (allowedUserIds.includes(userId)) {
      setAllowedUserIds(allowedUserIds.filter((id) => id !== userId));
    } else {
      setAllowedUserIds([...allowedUserIds, userId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    onSubmit({
      title,
      content,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      date,
      location: location.trim() || undefined,
      mood,
      coverImage: coverImage || undefined,
      privacy,
      pinCode: privacy === 'private_locked' ? pinCode : undefined,
      allowedUserIds:
        privacy === 'selective_friends'
          ? Array.from(new Set([...allowedUserIds, currentUser.id]))
          : [currentUser.id],
      sharedBoardId: privacy === 'shared_space' ? sharedBoardId : undefined,
      tags,
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 md:p-8 max-w-2xl bg-[#0f172a] text-slate-100 border border-slate-800 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-serif text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-sky-400" />
          Yeni Sayfa / Anı Yaz
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Duygularınızı kaydedin, kapak resmi ekleyin ve kilit/izin seviyesini belirleyin.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Başlık *
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Gece Yıldızların Altında..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 focus:border-sky-400 rounded-xl outline-none font-semibold text-white transition-all"
            />
          </div>

          {/* Privacy Level Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Gizlilik & Erişim İzinleri *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setPrivacy('private_locked')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  privacy === 'private_locked'
                    ? 'border-sky-500 bg-sky-950/60 shadow-sm'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
                  <Lock className="w-4 h-4 text-rose-400" />
                  <span>🔒 Kilitli Günlük (PIN)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Sayfa şifrelenir, sadece belirlediğiniz PIN ile açılır.
                </p>
              </div>

              <div
                onClick={() => setPrivacy('selective_friends')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  privacy === 'selective_friends'
                    ? 'border-indigo-500 bg-indigo-950/60 shadow-sm'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>👥 Özel İzinli Kişiler</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Sadece seçeceğiniz arkadaşlar görebilir.
                </p>
              </div>

              <div
                onClick={() => setPrivacy('shared_space')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  privacy === 'shared_space'
                    ? 'border-emerald-500 bg-emerald-950/60 shadow-sm'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>🌍 Ortak Paylaşılan Pano</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ortak anı panolarından birine gönderilir.
                </p>
              </div>

              <div
                onClick={() => setPrivacy('private_me')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  privacy === 'private_me'
                    ? 'border-amber-500 bg-amber-950/60 shadow-sm'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>👤 Sadece Ben</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Hiç kimseyle paylaşılmaz, tamamen özeldir.
                </p>
              </div>
            </div>
          </div>

          {privacy === 'private_locked' && (
            <div className="p-4 bg-sky-950/80 border border-sky-800 rounded-2xl animate-fadeIn">
              <label className="block text-xs font-bold text-sky-300 mb-1">
                Kilit Kodu / PIN (4 Hane)
              </label>
              <input
                type="text"
                maxLength={4}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                className="w-32 px-3 py-1.5 bg-slate-900 border border-sky-700 rounded-lg text-center font-mono font-bold text-lg text-sky-300 outline-none"
              />
              <p className="text-[11px] text-slate-300 mt-1">
                Bu sayfayı açmak isteyen kişi bu PIN'i girmek zorunda kalacaktır.
              </p>
            </div>
          )}

          {privacy === 'selective_friends' && (
            <div className="p-4 bg-indigo-950/80 border border-indigo-800 rounded-2xl animate-fadeIn">
              <label className="block text-xs font-bold text-indigo-300 mb-2">
                İzin Verilecek Kullanıcıları Seçin:
              </label>
              <div className="flex flex-wrap gap-2">
                {users
                  .filter((u) => u.id !== currentUser.id)
                  .map((u) => {
                    const isSelected = allowedUserIds.includes(u.id);
                    return (
                      <button
                        type="button"
                        key={u.id}
                        onClick={() => toggleAllowedUser(u.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-indigo-400'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full" />
                        <span>{u.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {privacy === 'shared_space' && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-2xl animate-fadeIn">
              <label className="block text-xs font-bold text-emerald-300 mb-1">
                Ortak Paylaşılan Pano Seçin:
              </label>
              <select
                value={sharedBoardId}
                onChange={(e) => setSharedBoardId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-emerald-700 rounded-xl text-xs font-bold text-emerald-300 outline-none"
              >
                {sharedBoards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.title} ({board.category})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Content Body */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Günlük / Anı İçeriği *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Sevgili günlük..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 focus:border-sky-400 rounded-2xl outline-none text-slate-100 text-sm leading-relaxed journal-paper"
            ></textarea>
          </div>

          {/* Date, Location, Mood */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                placeholder="Örn: İstanbul, Sahil"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Duygu Durumu</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white"
              >
                {MOOD_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Kapak Fotoğrafı
            </label>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              {PRESET_IMAGES.map((imgUrl, i) => (
                <img
                  key={i}
                  src={imgUrl}
                  alt={`preset-${i}`}
                  onClick={() => setCoverImage(imgUrl)}
                  className={`w-14 h-14 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                    coverImage === imgUrl ? 'border-sky-400 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                />
              ))}

              <label className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-700 hover:border-sky-400 flex flex-col items-center justify-center cursor-pointer bg-slate-900 text-slate-400 text-[10px] font-semibold text-center p-1">
                <Image className="w-4 h-4 mb-0.5 text-sky-400" />
                <span>Yükle</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Etiketler (Virgülle ayırın)
            </label>
            <input
              type="text"
              placeholder="Örn: Tatil, Arkadaşlar, Huzur"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              İptal
            </button>
            <button type="submit" className="btn btn-primary shadow-lg shadow-sky-600/30">
              Kaydet & Yayınla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

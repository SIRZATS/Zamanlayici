import React, { useState } from 'react';
import { Memory, User, SharedBoard } from '../types';
import { X, Lock, KeyRound, Heart, MessageSquare, Send, Calendar, MapPin, ShieldAlert, Trash2, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MemoryModalProps {
  memory: Memory | null;
  currentUser: User;
  users: User[];
  sharedBoards: SharedBoard[];
  onClose: () => void;
  onUnlockMemory: (memoryId: string) => void;
  unlockedMemoryIds: string[];
  onAddComment: (memoryId: string, content: string) => void;
  onLikeToggle: (memoryId: string) => void;
  onDeleteMemory: (memoryId: string) => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  memory,
  currentUser,
  users,
  sharedBoards,
  onClose,
  onUnlockMemory,
  unlockedMemoryIds,
  onAddComment,
  onLikeToggle,
  onDeleteMemory,
}) => {
  if (!memory) return null;

  const isAuthor = memory.authorId === currentUser.id;
  const isLocked = memory.privacy === 'private_locked';
  const isUnlockedBySession = unlockedMemoryIds.includes(memory.id);

  const hasAccess =
    isAuthor ||
    memory.privacy === 'shared_space' ||
    (memory.privacy === 'selective_friends' && memory.allowedUserIds.includes(currentUser.id)) ||
    (isLocked && (isAuthor || isUnlockedBySession));

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handlePinClick = (num: string) => {
    if (pinInput.length < 4) {
      const nextPin = pinInput + num;
      setPinInput(nextPin);
      setPinError(false);

      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handlePinDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setPinError(false);
  };

  const verifyPin = (code: string) => {
    const targetPin = memory.pinCode || '1234';
    if (code === targetPin) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      onUnlockMemory(memory.id);
    } else {
      setPinError(true);
      setTimeout(() => {
        setPinInput('');
      }, 500);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(memory.id, commentText);
    setCommentText('');
  };

  const isLiked = memory.likes.includes(currentUser.id);
  const board = sharedBoards.find((b) => b.id === memory.sharedBoardId);

  return (
    <div className="modal-overlay">
      <div className="modal-content overflow-hidden max-w-2xl bg-[#0f172a] text-slate-100 border border-slate-800 rounded-3xl shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur-md flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* CASE 1: LOCKED & NOT UNLOCKED */}
        {isLocked && !isUnlockedBySession && !isAuthor ? (
          <div className="p-8 text-center bg-[#070d1e] text-white min-h-[480px] flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center mb-4 text-sky-400 animate-pulse">
              <KeyRound className="w-8 h-8" />
            </div>

            <h2 className="font-serif text-2xl font-bold mb-1">{memory.title}</h2>
            <p className="text-slate-400 text-xs mb-6 max-w-xs">
              Bu sayfa kilitlenmiştir. Açmak için 4 haneli PIN kodunu giriniz. <br />
              <span className="text-sky-400 font-semibold">(Varsayılan Demo PIN: {memory.pinCode || '1234'})</span>
            </p>

            {/* PIN Dots Display */}
            <div className={`pin-dots ${pinError ? 'shake-animation' : ''}`}>
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`pin-dot ${idx < pinInput.length ? 'filled' : ''}`}
                ></div>
              ))}
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 font-semibold mb-4 animate-bounce">
                ❌ Hatalı PIN Kodu! Lütfen tekrar deneyin.
              </p>
            )}

            {/* Numeric Keypad */}
            <div className="pin-pad my-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePinClick(num)}
                  className="pin-btn border-slate-700 bg-slate-800 text-slate-100 hover:bg-sky-600 hover:text-white hover:border-sky-400"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handlePinDelete}
                className="pin-btn border-slate-700 bg-slate-800 text-rose-400 hover:bg-rose-600 hover:text-white text-xs font-bold"
              >
                Sil
              </button>
              <button
                onClick={() => handlePinClick('0')}
                className="pin-btn border-slate-700 bg-slate-800 text-slate-100 hover:bg-sky-600 hover:text-white"
              >
                0
              </button>
              <button
                onClick={() => verifyPin(pinInput)}
                className="pin-btn border-slate-700 bg-sky-600 text-white hover:bg-sky-500 text-xs font-bold"
              >
                Tamam
              </button>
            </div>
          </div>
        ) : !hasAccess ? (
          /* CASE 2: NO ACCESS */
          <div className="p-8 text-center bg-[#070d1e] text-slate-100 min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-4 text-rose-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold mb-2">Erişim Kısıtlı</h2>
            <p className="text-slate-400 text-sm max-w-sm mb-6">
              Bu anı <span className="font-bold text-white">{memory.authorName}</span> tarafından özel olarak paylaşılmıştır. Şu anki kullanıcınız (<b>{currentUser.name}</b>) bu anının izin verilenler listesinde yer almamaktadır.
            </p>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 max-w-xs text-xs text-slate-300">
              💡 <b>İpucu:</b> Üst menüdeki "Kullanıcı Değiştir" alanından izin verilen kullanıcıya geçiş yapabilirsiniz!
            </div>
          </div>
        ) : (
          /* CASE 3: UNLOCKED VIEW */
          <div>
            {memory.coverImage && (
              <div className="relative h-64 w-full bg-slate-950">
                <img
                  src={memory.coverImage}
                  alt={memory.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-black/30"></div>
                
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 text-xs font-medium text-sky-400 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{memory.date}</span>
                    {memory.location && (
                      <>
                        <span>•</span>
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{memory.location}</span>
                      </>
                    )}
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight">
                    {memory.title}
                  </h2>
                </div>
              </div>
            )}

            <div className="p-6 md:p-8 journal-paper">
              {!memory.coverImage && (
                <div className="mb-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-sky-400 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{memory.date}</span>
                    {memory.location && (
                      <>
                        <span>•</span>
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{memory.location}</span>
                      </>
                    )}
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-white">
                    {memory.title}
                  </h2>
                </div>
              )}

              {/* Author & Privacy Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={memory.authorAvatar}
                    alt={memory.authorName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-400"
                  />
                  <div>
                    <p className="text-sm font-bold text-white">{memory.authorName}</p>
                    <p className="text-xs text-slate-400">Yazar</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {memory.mood && (
                    <span className="bg-sky-950 border border-sky-800 text-sky-300 text-xs font-semibold px-3 py-1 rounded-full">
                      {memory.mood}
                    </span>
                  )}

                  {memory.privacy === 'private_locked' && (
                    <span className="badge badge-locked">
                      <Lock className="w-3 h-3" /> Kilitli (PIN: {memory.pinCode || '1234'})
                    </span>
                  )}
                  {memory.privacy === 'selective_friends' && (
                    <span className="badge badge-selective">
                      <UserCheck className="w-3 h-3" /> Özel İzinli
                    </span>
                  )}
                  {memory.privacy === 'shared_space' && (
                    <span className="badge badge-shared">
                      🌍 {board?.title || 'Ortak Pano'}
                    </span>
                  )}
                </div>
              </div>

              {/* Journal Text */}
              <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed font-sans text-base whitespace-pre-wrap">
                {memory.content}
              </div>

              {/* Tags */}
              {memory.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800">
                  {memory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold text-sky-300 bg-sky-950 border border-sky-800 px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => onLikeToggle(memory.id)}
                  className={`btn btn-sm ${
                    isLiked
                      ? 'bg-rose-950/60 text-rose-400 border border-rose-800'
                      : 'btn-secondary text-slate-300'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{memory.likes.length} Beğeni</span>
                </button>

                {isAuthor && (
                  <button
                    onClick={() => {
                      if (confirm('Bu anı sayfasını silmek istediğinize emin misiniz?')) {
                        onDeleteMemory(memory.id);
                        onClose();
                      }
                    }}
                    className="btn btn-sm btn-danger flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Sil</span>
                  </button>
                )}
              </div>

              {/* Comments Section */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <h3 className="font-serif font-bold text-lg text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-sky-400" />
                  Yorumlar ({memory.comments.length})
                </h3>

                <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-6">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Bir yorum yaz..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-full px-4 py-2 text-sm outline-none focus:border-sky-400"
                    />
                    <button type="submit" className="btn btn-primary btn-sm rounded-full">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {memory.comments.length === 0 ? (
                    <p className="text-xs text-slate-500 italic text-center py-4">
                      Henüz yorum yazılmadı.
                    </p>
                  ) : (
                    memory.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex gap-3 text-xs"
                      >
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="w-7 h-7 rounded-full object-cover mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-200">{comment.userName}</span>
                            <span className="text-[10px] text-slate-500">{comment.createdAt}</span>
                          </div>
                          <p className="text-slate-300 mt-1">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

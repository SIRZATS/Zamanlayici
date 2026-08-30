import React, { useState } from 'react';
import { SharedBoard, Memory, User } from '../types';
import { Users, PlusCircle, Sparkles, FolderPlus, ArrowRight, BookOpen } from 'lucide-react';
import { MemoryCard } from './MemoryCard';

interface SharedSpaceViewProps {
  boards: SharedBoard[];
  memories: Memory[];
  currentUser: User;
  users: User[];
  onSelectMemory: (memory: Memory) => void;
  onLikeToggle: (memoryId: string) => void;
  unlockedMemoryIds: string[];
  onOpenNewMemoryWithBoard: (boardId: string) => void;
  onCreateBoard: (board: Omit<SharedBoard, 'id' | 'createdAt' | 'members'>) => void;
}

export const SharedSpaceView: React.FC<SharedSpaceViewProps> = ({
  boards,
  memories,
  currentUser,
  users,
  onSelectMemory,
  onLikeToggle,
  unlockedMemoryIds,
  onOpenNewMemoryWithBoard,
  onCreateBoard,
}) => {
  const [selectedBoardId, setSelectedBoardId] = useState<string>(boards[0]?.id || '');
  const [showNewBoardModal, setShowNewBoardModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Tatil & Gezi');

  const selectedBoard = boards.find((b) => b.id === selectedBoardId) || boards[0];

  const boardMemories = memories.filter(
    (m) => m.privacy === 'shared_space' && m.sharedBoardId === selectedBoardId
  );

  const handleCreateBoardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreateBoard({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      coverImage: '/images/beach_vacation_memory.png',
      createdBy: currentUser.id,
    });

    setNewTitle('');
    setNewDesc('');
    setShowNewBoardModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-slate-700/80 p-8 text-white shadow-2xl overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-xs font-bold text-sky-300 mb-3">
            <Users className="w-3.5 h-3.5" />
            Ortak Paylaşılan Anı Odaları
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-2">
            Birlikte Anı Biriktirin, Hatıraları Yaşatın
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Arkadaşlarınız ve ailenizle ortak panolar oluşturun. Herkes kendi fotoğraf ve günlük yazılarını eklesin!
          </p>

          <button
            onClick={() => setShowNewBoardModal(true)}
            className="btn bg-sky-500 hover:bg-sky-400 text-white font-bold shadow-lg shadow-sky-600/30"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Yeni Ortak Pano Oluştur</span>
          </button>
        </div>

        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* Board Selector Tabs / Cards */}
      <div>
        <h3 className="font-serif text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-400" />
          Aktif Anı Panoları ({boards.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => {
            const isSelected = board.id === selectedBoardId;
            const count = memories.filter(
              (m) => m.privacy === 'shared_space' && m.sharedBoardId === board.id
            ).length;

            return (
              <div
                key={board.id}
                onClick={() => setSelectedBoardId(board.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-sky-400 bg-slate-900 shadow-xl ring-2 ring-sky-400/40'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-sky-300 bg-sky-950 px-2.5 py-0.5 rounded-full border border-sky-800">
                    {board.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {count} Anı Kaydı
                  </span>
                </div>

                <h4 className="font-serif font-bold text-lg text-white mb-1">{board.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">{board.description}</p>

                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <div className="flex -space-x-2">
                    {users.slice(0, 4).map((u) => (
                      <img
                        key={u.id}
                        src={u.avatar}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-900"
                        title={u.name}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-sky-400 flex items-center gap-1">
                    Görüntüle <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Board Detail & Memories Grid */}
      {selectedBoard && (
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Pano Detayı & Paylaşılanlar
              </span>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">
                {selectedBoard.title}
              </h3>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                {selectedBoard.description}
              </p>
            </div>

            <button
              onClick={() => onOpenNewMemoryWithBoard(selectedBoard.id)}
              className="btn btn-primary shadow-md flex items-center gap-2 self-start md:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Bu Panoya Anı Ekle</span>
            </button>
          </div>

          {boardMemories.length === 0 ? (
            <div className="text-center py-12 journal-paper rounded-2xl p-6 border border-slate-800">
              <Sparkles className="w-10 h-10 text-sky-400 mx-auto mb-2" />
              <p className="font-serif font-bold text-white text-lg">Henüz Anı Eklenmemiş</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 mb-4">
                Bu ortak panoya ilk fotoğraf veya günlük yazısını sen ekle!
              </p>
              <button
                onClick={() => onOpenNewMemoryWithBoard(selectedBoard.id)}
                className="btn btn-secondary btn-sm"
              >
                İlk Anıyı Yaz
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boardMemories.map((mem) => (
                <MemoryCard
                  key={mem.id}
                  memory={mem}
                  currentUser={currentUser}
                  sharedBoards={boards}
                  onSelect={onSelectMemory}
                  onLikeToggle={onLikeToggle}
                  unlockedMemoryIds={unlockedMemoryIds}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Board Modal */}
      {showNewBoardModal && (
        <div className="modal-overlay">
          <div className="modal-content p-6 md:p-8 max-w-md bg-[#0f172a] text-slate-100 border border-slate-800 rounded-3xl shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-white mb-1">
              Yeni Ortak Pano Oluştur
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Arkadaşlarınız veya ailenizle ortak anı toplayacağınız yeni bir alan açın.
            </p>

            <form onSubmit={handleCreateBoardSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Pano Adı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 2026 Yaz Gezileri"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl outline-none text-sm text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Kategori
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white"
                >
                  <option value="Tatil & Gezi">Tatil & Gezi</option>
                  <option value="Aile">Aile</option>
                  <option value="Arkadaşlar">Arkadaşlar</option>
                  <option value="Kutlama & Doğum Günü">Kutlama & Doğum Günü</option>
                  <option value="Hobi & Yaşam">Hobi & Yaşam</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Açıklama
                </label>
                <textarea
                  rows={3}
                  placeholder="Bu panoda ne tür anılar biriktireceksiniz?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl outline-none text-xs text-slate-300"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewBoardModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  İptal
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

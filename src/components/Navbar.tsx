import React from 'react';
import { User } from '../types';
import { BookOpen, Users, Clock, PlusCircle, Search, Sparkles, LogOut, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  activeTab: 'my_memories' | 'shared_spaces' | 'timeline';
  setActiveTab: (tab: 'my_memories' | 'shared_spaces' | 'timeline') => void;
  currentUser: User;
  users: User[];
  onSwitchUser: (user: User) => void;
  onLogout: () => void;
  onOpenNewMemory: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  users,
  onSwitchUser,
  onLogout,
  onOpenNewMemory,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="navbar-header">
      <div className="navbar-inner">
        
        {/* 1. BRAND LOGO & TITLE (AnıHane text-3xl font-bold, subtext text-sm text-slate-400) */}
        <div className="navbar-brand" onClick={() => setActiveTab('my_memories')}>
          <div className="brand-icon">
            <Sparkles size={26} />
          </div>
          <div>
            <h1 className="brand-title">
              Anı<span>Hane</span>
            </h1>
            <p className="brand-sub">
              Dijital Anı & Kilitli Günlük Platformu
            </p>
          </div>
        </div>

        {/* 2. SEARCH BAR (Centered, max-w-md, rounded-full, search icon inside) */}
        <div className="navbar-search">
          <Search className="search-icon-inside" />
          <input
            type="text"
            placeholder="Anılarda veya etiketlerde ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input-field"
          />
        </div>

        {/* 3. NAVIGATION TABS (Hizalanmış ikonlar, gap-2, p-1.5, hover states) */}
        <nav className="navbar-tabs">
          <button
            onClick={() => setActiveTab('my_memories')}
            className={`nav-tab-btn ${activeTab === 'my_memories' ? 'active' : ''}`}
          >
            <BookOpen size={16} />
            <span>Anılarım</span>
          </button>

          <button
            onClick={() => setActiveTab('shared_spaces')}
            className={`nav-tab-btn ${activeTab === 'shared_spaces' ? 'active' : ''}`}
          >
            <Users size={16} />
            <span>Ortak Alanlar</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`nav-tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
          >
            <Clock size={16} />
            <span>Zaman Tüneli</span>
          </button>
        </nav>

        {/* 4. ACTIONS: MAIN CTA "Yaz" & USER SWITCHER PROFILE */}
        <div className="navbar-actions">
          
          {/* Main CTA Button "Yaz" */}
          <button onClick={onOpenNewMemory} className="btn-cta-yaz">
            <PlusCircle size={18} />
            <span>Yaz</span>
          </button>

          {/* Circular Profile Avatar (w-10 h-10, clean typography hierarchy) */}
          <div className="navbar-profile-box">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="profile-avatar-img"
            />
            <div className="profile-text-group">
              <span className="profile-name-text">{currentUser.name} (Aktif)</span>
              <span className="profile-user-tag">@{currentUser.username}</span>
            </div>

            {/* Clean Dropdown Menu */}
            <div className="user-dropdown-menu">
              <div className="px-2 py-1 border-b border-slate-800 mb-1">
                <p className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert size={12} />
                  Kullanıcı Değiştir
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Farklı kullanıcı gözünden testi başlatın.
                </p>
              </div>

              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onSwitchUser(user)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-xs text-left transition-colors ${
                    user.id === currentUser.id
                      ? 'bg-sky-950 text-sky-300 font-bold border border-sky-800'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="user-dropdown-avatar"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-bold text-white text-xs">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">@{user.username}</p>
                  </div>
                  {user.id === currentUser.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                  )}
                </button>
              ))}

              <div className="border-t border-slate-800 mt-1 pt-1">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
                >
                  <LogOut size={13} />
                  <span>Oturumu Kapat</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};

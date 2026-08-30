import React from 'react';
import { User } from '../types';
import confetti from 'canvas-confetti';
import { Sparkles, Plus, Heart, BookOpen, Users, LogOut } from 'lucide-react';

interface HeaderProps {
  activeTab: 'timeline' | 'eren' | 'ozlem';
  setActiveTab: (tab: 'timeline' | 'eren' | 'ozlem') => void;
  currentUser: User;
  partnerUser: User;
  onOpenCreateModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  partnerUser,
  onOpenCreateModal,
  onLogout,
}) => {
  const triggerPokeAnimation = () => {
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.2 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#e11d48'],
    });
  };

  return (
    <header className="header-bar">
      <div className="header-inner">
        
        {/* Left: Logo & Partner Status */}
        <div className="logo-group" onClick={() => setActiveTab('timeline')}>
          <div className="logo-icon-box">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="logo-title">
              AnıHane <span className="text-rose-400">✨</span>
            </h1>
            <p className="logo-sub">
              Özlem ile Eren
            </p>
          </div>
        </div>

        {/* Center: Sliding Tab Bar ([ Ortak Zaman Tüneli ], [ Eren'in Günlüğü ], [ Özlem'in Günlüğü ]) */}
        <nav className="nav-tabs-bar">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`nav-tab-item ${activeTab === 'timeline' ? 'active-timeline' : ''}`}
          >
            <Users size={14} />
            <span>Ortak Zaman Tüneli</span>
          </button>

          <button
            onClick={() => setActiveTab('eren')}
            className={`nav-tab-item ${activeTab === 'eren' ? 'active-eren' : ''}`}
          >
            <BookOpen size={14} />
            <span>Eren'in Günlüğü</span>
          </button>

          <button
            onClick={() => setActiveTab('ozlem')}
            className={`nav-tab-item ${activeTab === 'ozlem' ? 'active-ozlem' : ''}`}
          >
            <BookOpen size={14} />
            <span>Özlem'in Günlüğü</span>
          </button>
        </nav>

        {/* Right: Quick Action Poke Button & "+ Yeni Anı Ekle" CTA */}
        <div className="header-actions">
          <button onClick={triggerPokeAnimation} className="btn-poke-quick">
            <Heart size={14} className="fill-rose-500 text-rose-500" />
            <span>{partnerUser.name}'i Dürt 💌</span>
          </button>

          <button onClick={onOpenCreateModal} className="btn-new-memory">
            <Plus size={16} />
            <span>Yeni Anı Ekle</span>
          </button>

          <button onClick={onLogout} title="Oturumu Kapat" className="btn-poke-quick">
            <LogOut size={14} />
          </button>
        </div>

      </div>
    </header>
  );
};

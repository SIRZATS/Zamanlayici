import React, { useState } from 'react';
import { User } from '../types';
import { Lock, User as UserIcon, ArrowRight, AlertCircle } from 'lucide-react';
import { SiriusStar } from './SiriusStar';

// Özel olarak tanımlanan 2 yetkili hesap
export const ALLOWED_ACCOUNTS = [
  {
    username: 'eren',
    password: 'joker',
    name: 'Eren',
    avatar: '/eren_avatar.jpg',
  },
  {
    username: 'özlem',
    password: 'kedi',
    name: 'Özlem',
    avatar: '/ozlem_avatar.jpg',
  },
];

interface LoginScreenProps {
  onLogin: (user: User) => void;
  allowedAccounts?: typeof ALLOWED_ACCOUNTS;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, allowedAccounts = ALLOWED_ACCOUNTS }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    const matchedAccount = allowedAccounts.find(
      (acc) =>
        (acc.username.toLowerCase() === cleanUsername ||
          (acc.username === 'özlem' && (cleanUsername === 'ozlem' || cleanUsername === 'özlem'))) &&
        acc.password === cleanPassword
    );

    if (matchedAccount) {
      onLogin({
        id: matchedAccount.username,
        name: matchedAccount.name,
        username: matchedAccount.username,
        avatar: matchedAccount.avatar,
        color: '#38BDF8',
      });
    } else {
      setError('Hatalı kullanıcı adı veya şifre!');
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Background Soft Glow Orbs */}
      <div className="login-glow-orb-1"></div>
      <div className="login-glow-orb-2"></div>

      {/* CENTERED MODERN BUBBLE CARD */}
      <div className="login-bubble-card">
        
        {/* Header Icon & Branding */}
        <div style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.25), rgba(2,132,199,0.08))', border: '1px solid rgba(56,189,248,0.4)', borderRadius: '50%', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 0 20px rgba(56,189,248,0.4)' }}>
          <SiriusStar size={34} />
        </div>

        <h1 className="login-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          Anı<span>Hane</span> <SiriusStar size={22} />
        </h1>
        <p className="login-subtitle">
          Sirius 🌌 Eren &amp; Özlem Dijital Anı Portalı
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="login-error-badge">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Username Input */}
          <div className="login-field">
            <label className="login-label">Kullanıcı Adı</label>
            <div className="login-input-wrapper">
              <UserIcon className="login-input-icon" />
              <input
                type="text"
                required
                placeholder="Kullanıcı adınız"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="login-field">
            <label className="login-label">Şifre</label>
            <div className="login-input-wrapper">
              <Lock className="login-input-icon" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-btn-submit">
            <span>Giriş Yap</span>
            <ArrowRight size={20} />
          </button>
        </form>

      </div>
    </div>
  );
};

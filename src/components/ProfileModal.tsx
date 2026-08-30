import React, { useState } from 'react';
import { X, Camera, Save, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProfileModalProps {
  username: 'eren' | 'özlem' | 'ozlem';
  name: string;
  currentAvatar: string;
  isOwner: boolean;
  onClose: () => void;
  onUpdateAvatar: (username: string, newAvatarUrl: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  username,
  name,
  currentAvatar,
  isOwner,
  onClose,
  onUpdateAvatar,
}) => {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar);
  const [isUploading, setIsUploading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Supabase storage upload
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `avatar-${username.toLowerCase()}-${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('anihane')
        .upload(fileName, file, { upsert: true });

      if (!uploadErr) {
        const { data } = supabase.storage.from('anihane').getPublicUrl(fileName);
        if (data?.publicUrl) {
          setAvatarUrl(data.publicUrl);
          setIsUploading(false);
          return;
        }
      }

      // Fallback: Read as base64 data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Fotoğraf yükleme hatası:', err);
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    onUpdateAvatar(username, avatarUrl);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '92%',
          maxWidth: 420,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#121215',
          border: '1px solid #27272a',
          borderRadius: 24,
          padding: 24,
          boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Kapat butonu */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: '#27272a',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#a1a1aa',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        {/* Başlık */}
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: 20 }}>
          {name}
        </h3>

        {/* Büyük Resim Gösterimi */}
        <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto 24px' }}>
          <img
            src={avatarUrl}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid #f43f5e',
              boxShadow: '0 8px 30px rgba(244, 63, 94, 0.4)',
            }}
          />
          {isUploading && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.85rem', fontWeight: 700
            }}>
              Yükleniyor...
            </div>
          )}
        </div>

        {/* Değiştirme Butonları */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '11px 20px',
                borderRadius: 14,
                background: '#27272a',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                border: '1px solid #3f3f46',
                transition: 'all 0.2s',
              }}
            >
              <Camera size={16} /> Fotoğraf Değiştir
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>

            {/* URL Input */}
            <input
              type="text"
              placeholder="Veya resim URL'si yapıştır..."
              value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: 12,
                background: '#18181b',
                border: '1px solid #27272a',
                color: '#fff',
                fontSize: '0.8rem',
                outline: 'none',
              }}
            />

            {/* Kaydet */}
            <button
              onClick={handleSave}
              style={{
                padding: '12px',
                borderRadius: 14,
                background: savedSuccess ? '#22c55e' : 'linear-gradient(135deg, #f43f5e, #ec4899)',
                border: 'none',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(244, 63, 94, 0.4)',
                marginTop: 6,
              }}
            >
              {savedSuccess ? (
                <>
                  <Check size={18} /> Kaydedildi!
                </>
              ) : (
                <>
                  <Save size={18} /> Fotoğrafı Kaydet
                </>
              )}
            </button>
          </div>
      </div>
    </div>
  );
};

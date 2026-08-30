export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

// Her kartın tipi: fotoğraf, yazı notu, müzik, mektup veya ses
export type CardType = 'photo' | 'text' | 'music' | 'letter' | 'audio';

// İpe asılı her bir anı kartı
export interface MemoryCard {
  id: string;
  type: CardType;
  tab: 'timeline' | 'eren' | 'ozlem'; // hangi ipe ait
  title?: string;         // opsiyonel başlık / alt yazı
  content?: string;       // yazı içeriği (type === 'text')
  imageDataUrl?: string;  // base64 fotoğraf (type === 'photo')
  spotifyUrl?: string;    // spotify embed linki (type === 'music')
  audioDataUrl?: string;  // base64 veya url ses dosyası (type === 'audio')
  // Mektup tipi için ek alanlar
  letterFrom?: string;
  letterTo?: string;
  letterContent?: string;
  date: string;           // ekleme tarihi
  location?: string;
  authorId: string;
  authorName: string;
  pinColor: string;       // mandal rengi (her kart farklı)
  rotation: number;       // hafif eğim açısı (-3 ile 3 arası)
  createdAt: string;
}

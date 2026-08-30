import { CatActionType } from './PixelCatSprite';

export interface InactivityStage {
  day: number;
  name: string;
  badge: string;
  badgeColor: string;
  action: CatActionType;
  quote: string;
  webIntensity: number; // 0 to 100 (% cobweb coverage)
  darknessFilter: string; // filter applied to room
  lockCareButtons: boolean; // if true, Sev & Okşa and Oyna are locked!
  refuseMessage: string; // shown when trying to pet or play
  ambientEmoji?: string;
}

export const INACTIVITY_STAGES: Record<number, InactivityStage> = {
  0: {
    day: 0,
    name: 'Pırıl Pırıl & Çiçek Gibi',
    badge: '🌸 Neşeli & Mutlu',
    badgeColor: '#ec4899',
    action: 'idle',
    quote: 'Mırrr! Bugün de benimlesin, kalbim pıt pıt atıyor seni çok seviyorum! 💖',
    webIntensity: 0,
    darknessFilter: 'none',
    lockCareButtons: false,
    refuseMessage: '',
  },
  1: {
    day: 1,
    name: 'Hafif Boynu Bükük',
    badge: '🥺 Özlemiş (1 Gün)',
    badgeColor: '#38bdf8',
    action: 'waiting',
    quote: '1 gündür neredesin miyav?! Dün hiç gelmedin, kapıda yolunu gözlemekten patilerim yoruldu... 🥺🐾',
    webIntensity: 12,
    darknessFilter: 'brightness(0.96)',
    lockCareButtons: false,
    refuseMessage: '',
    ambientEmoji: '🍂',
  },
  2: {
    day: 2,
    name: 'Aç ve Kırgın',
    badge: '🥀 Kırgın (2 Gün)',
    badgeColor: '#f59e0b',
    action: 'despite',
    quote: '2 gündür nerdesin miyav?! Ben burada meraktan ölecektim, beni unuttun sandım! 😿💔',
    webIntensity: 28,
    darknessFilter: 'brightness(0.9) saturate(0.85)',
    lockCareButtons: false,
    refuseMessage: '',
    ambientEmoji: '🍂',
  },
  3: {
    day: 3,
    name: 'Küs & Sevgi Kilitli',
    badge: '😾 Küs (3 Gün)',
    badgeColor: '#ef4444',
    action: 'refusing',
    quote: '3 gündür neredesin sen?! Açlıktan ve yalnızlıktan öldüm bittim burada! Sana çok küstüm, sevmene izin vermem! 😾💢',
    webIntensity: 45,
    darknessFilter: 'brightness(0.85) saturate(0.75)',
    lockCareButtons: true,
    refuseMessage: '3 gündür beni ziyarete gelmedin! Şimdi sevemezsin, gönlümü 3 gün daha gelerek alman gerek! 😾💢',
    ambientEmoji: '🕸️',
  },
  4: {
    day: 4,
    name: 'Ateşli Hasta',
    badge: '🌡️ Ateşli Hasta (4 Gün)',
    badgeColor: '#f97316',
    action: 'sick2',
    quote: 'Tam 4 gündür yoksun miyav! Soğukta tek başıma kaldım, ateşim 39 derece çıktı hasta oldum... Neredesin sen?! 🌡️🤒',
    webIntensity: 60,
    darknessFilter: 'brightness(0.8) saturate(0.65)',
    lockCareButtons: true,
    refuseMessage: 'Ateşim çok yüksek 39 derece miyav... Önce bir alışkanlık tamamlayıp bana şifa getirmelisin! 🤒🥀',
    ambientEmoji: '🕸️',
  },
  5: {
    day: 5,
    name: 'Serum Bağlı Ağır Hasta',
    badge: '💉 Ağır Hasta (5 Gün)',
    badgeColor: '#dc2626',
    action: 'sick1',
    quote: '5 gündür neredesin?! Ben burada tek başıma ölecektim, veteriner serum bağladı bana miyav! 💉😿',
    webIntensity: 72,
    darknessFilter: 'brightness(0.72) saturate(0.5)',
    lockCareButtons: true,
    refuseMessage: 'Pofuduk patime serum bağlı miyav, kalkamıyorum... Görevlerini yap ki serumdan kurtulayım! 💉😿',
    ambientEmoji: '🕸️',
  },
  6: {
    day: 6,
    name: 'Kutuya Saklanmış',
    badge: '📦 Terk Edilmiş (6 Gün)',
    badgeColor: '#a855f7',
    action: 'box3',
    quote: '6 koca gündür hiç gelmedin! Beni terk ettin sanıp kutuma saklandım, günlerce ağladım miyav... 📦😭',
    webIntensity: 82,
    darknessFilter: 'brightness(0.68) saturate(0.4)',
    lockCareButtons: true,
    refuseMessage: 'Kutuma saklandım, dışarı çıkmak istemiyorum... Beni sevmek istiyorsan her gün gelmelisin 📦💔',
    ambientEmoji: '🕸️',
  },
  7: {
    day: 7,
    name: 'Harabe & Örümcek Ağları',
    badge: '🕸️ Harabe Oda (7 Gün)',
    badgeColor: '#71717a',
    action: 'laydown',
    quote: '7 gündür neredesin sen?! Odamı boydan boya örümcek ağları sardı, soğuktan donup ölecektim neredeyse! 🕸️😿',
    webIntensity: 90,
    darknessFilter: 'brightness(0.6) saturate(0.3)',
    lockCareButtons: true,
    refuseMessage: 'Her yer örümcek ağı oldu... Beni burada yapayalnız bıraktın miyav 🕸️🥀',
    ambientEmoji: '🕸️',
  },
  8: {
    day: 8,
    name: 'Hayalet Kediye Dönüşüm',
    badge: '👻 Hayaletleşiyor (8 Gün)',
    badgeColor: '#9333ea',
    action: 'dead1',
    quote: '8 gündür tek bir pati sesi bile duymadım miyav... Tüylerim döküldü, açlıktan nefesim kesildi! 🥀🖤',
    webIntensity: 96,
    darknessFilter: 'brightness(0.52) saturate(0.2) contrast(1.1)',
    lockCareButtons: true,
    refuseMessage: 'Hayalete dönüşüyorum miyav, patilerim şeffaflaştı... Bana hayat vermelisin 👻🖤',
    ambientEmoji: '👻',
  },
  9: {
    day: 9,
    name: 'Kritik Solgunluk',
    badge: '🌌 Zayıf Nabız (9 Gün)',
    badgeColor: '#475569',
    action: 'crying',
    quote: '9 gündür yoksun! Ruhum neredeyse bedenimden ayrılacaktı miyav, öldüm öldüm dirildim burada! 👻💔',
    webIntensity: 100,
    darknessFilter: 'brightness(0.46) saturate(0.1)',
    lockCareButtons: true,
    refuseMessage: 'Nefesim çok zayıfladı miyav... Bir an önce görevini tamamlayıp beni hayata döndür! 🥺💔',
    ambientEmoji: '🥀',
  },
  10: {
    day: 10,
    name: 'Sirius Melek Pisisi',
    badge: '🪦 Melek Pisi (10+ Gün)',
    badgeColor: '#cbd5e1',
    action: 'dead',
    quote: 'Tam 10 gündür hiç gelmedin miyav! Ben burada yokluğundan öldüm melek oldum gittim sandım, neredeydin bunca zaman?! 🪦😭',
    webIntensity: 100,
    darknessFilter: 'brightness(0.4) grayscale(1)',
    lockCareButtons: true,
    refuseMessage: '10 gündür gelmedin, ben artık bir melek pisiyim! Beni geri çağırmak için görevlerini yap 🪦😇',
    ambientEmoji: '🪦',
  },
};

export function getInactivityStage(days: number): InactivityStage {
  const clamped = Math.max(0, Math.min(10, Math.floor(days)));
  return INACTIVITY_STAGES[clamped] || INACTIVITY_STAGES[0];
}

export const SLEEPING_ANNOYED_QUOTES: string[] = [
  "Uykumun en tatlı yerindeydim miyav! Rahat bıraksana beni, uyuyorum şurada... 😾💤",
  "Pofuduk patilerimi burnuma çekip uyumaya çalışıyorum mırrr, gıdıklama lütfen! 🥱💢",
  "Rüyamda tam gökten taze balıklar yağıyordu, beni niye uyandırdın miyav? 🐟💤",
  "Gözlerimi açamıyorum bile pisi dostum... Bırak birazcık daha kestireyim miyav! 😾💤",
];

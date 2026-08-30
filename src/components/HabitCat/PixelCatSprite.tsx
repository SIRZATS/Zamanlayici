import React from 'react';
import { CatMood } from './habitTypes';

export type CatActionType =
  // ── ANIMATIONS - 1 ──
  | 'sleepy'
  | 'idle'
  | 'sleeping'
  | 'dance'
  | 'excited'
  | 'idle2'
  // ── ANIMATIONS - 2 ──
  | 'surprised'
  | 'crying'
  | 'eating'
  | 'waiting'
  | 'dead'
  | 'laydown'
  // ── ANIMATIONS - 3 ──
  | 'shy'
  | 'refusing'
  | 'angry'
  // ── ANIMATIONS - 4 ──
  | 'licking'
  | 'despite'
  // ── ANIMATIONS - BATHTUB ──
  | 'bathtub'
  // ── ANIMATIONS - 5 ──
  | 'sick1'
  | 'sick2'
  // ── ANIMATIONS - BOX ──
  | 'box1'
  | 'box2'
  | 'box3'
  // ── KAHVERENGİ / SİYAM SERİSİ ──
  | 'so_full'
  | 'jumping'
  | 'running'
  | 'chilling'
  | 'tickle'
  // ── EKSTRA STRİP ANİMASYONLARI ──
  | 'attack'
  | 'hurt'
  | 'born'
  | 'walk'
  | 'happy'
  | 'sad';

export interface UserAnimMeta {
  sheet: 'all_anims' | 'bathtub' | 'catsick1' | 'catsick2' | 'strip';
  stripUrl?: string;
  row?: number;
  frames: number;
  duration: string;
  label: string;
  screenshotGroup:
    | 'ANIMATIONS - 1'
    | 'ANIMATIONS - 2'
    | 'ANIMATIONS - 3'
    | 'ANIMATIONS - 4'
    | 'ANIMATIONS - 5'
    | 'ANIMATIONS - BOX'
    | 'ANIMATIONS - BATHTUB';
  bubbleTexts: string[];
}

export const USER_CAT_ANIMATIONS: Record<CatActionType, UserAnimMeta> = {
  // ─── ANIMATIONS - 1 ───
  sleepy: {
    sheet: 'all_anims',
    row: 7,
    frames: 8,
    duration: '1.3s',
    label: 'SLEEPY',
    screenshotGroup: 'ANIMATIONS - 1',
    bubbleTexts: [
      'Gözlerim minnak kaldı miyav, uykum geldi 🥱💤',
      'Pofuduk patilerim yoruldu, biraz uyusam mı mırrr? 💤',
      'Miyavvv... Kafam patime düşüverdi 😴🐾',
    ],
  },
  idle: {
    sheet: 'all_anims',
    row: 0,
    frames: 8,
    duration: '1.2s',
    label: 'IDLE',
    screenshotGroup: 'ANIMATIONS - 1',
    bubbleTexts: [
      'Mırrr... Yanına gelip patimle dokunabilir miyim? 🐾💕',
      'Beni sevmeye mi geldin miyav? Çok sevindim! 🥰',
      'Burnum pembiş miyav, sevgiye hazırım! 🌸✨',
      'Seninle vakit geçirmek çok güzel mırmırrr 💖',
    ],
  },
  sleeping: {
    sheet: 'all_anims',
    row: 2,
    frames: 4,
    duration: '1.4s',
    label: 'SLEEPING',
    screenshotGroup: 'ANIMATIONS - 1',
    bubbleTexts: [
      'Zzz... Rüyalarda leziz balıklar kovalıyorum mırrr 🌙🐟',
      'Pıt pıt kalbim atıyor, sıcacık uyuyorum miyav 😴💤',
      'Mırrr horrr... Uyurken bile seni seviyorum 💤💖',
    ],
  },
  dance: {
    sheet: 'all_anims',
    row: 3,
    frames: 4,
    duration: '0.65s',
    label: 'DANCE',
    screenshotGroup: 'ANIMATIONS - 1',
    bubbleTexts: [
      'Miyav salsa! Bak minik patilerim nasıl dönüyor 💃✨',
      'Pati şov başladı! Alkışlar minik yavruya mı? 💃🐾',
      'Mırrr mırrr! Mutluluktan fırıl fırıl dönüyorum 💃🌸',
    ],
  },
  excited: {
    sheet: 'all_anims',
    row: 5,
    frames: 12,
    duration: '0.9s',
    label: 'EXCITED',
    screenshotGroup: 'ANIMATIONS - 1',
    bubbleTexts: [
      'Kelebek mi o?! Minik patim havada yakalayacağım! 🎉🦋',
      'Çok heyecanlandım miyav, kalbim pıt pıt atıyor! 🎉💖',
      'Miyavvv iki pati havada zıp zıp zıplıyorum! 🐾✨',
    ],
  },
  idle2: {
    sheet: 'all_anims',
    row: 1,
    frames: 8,
    duration: '1.2s',
    label: 'IDLE 2',
    screenshotGroup: 'ANIMATIONS - 1',
    bubbleTexts: [
      'Kulaklarımı diktim, senin tatlı sesini dinliyorum 👂💕',
      'Poşet hışırtısı mı duydum yoksa bana ödül mü var? 👂✨',
      'Mırrr, bir kulağım sende bir kulağım oyunda! 👂🐾',
    ],
  },

  // ─── ANIMATIONS - 2 ───
  surprised: {
    sheet: 'all_anims',
    row: 12,
    frames: 12,
    duration: '1.0s',
    label: 'SURPRISED',
    screenshotGroup: 'ANIMATIONS - 2',
    bubbleTexts: [
      'Ayyy o neydi öyle! Gözlerim kocaman oldu miyav! 🙀✨',
      'Minnak kalbim küt küt attı, ödüm koptu pisi pisi! 🙀💓',
      'Miyavvv! Kuyruğum kabardı ama merak da ettim! 🙀🐾',
    ],
  },
  crying: {
    sheet: 'all_anims',
    row: 8,
    frames: 4,
    duration: '0.8s',
    label: 'CRYING',
    screenshotGroup: 'ANIMATIONS - 2',
    bubbleTexts: [
      'Karnım minik minik gurulduyor, bir parça mama lütfen hüüü 😿🥺',
      'Senin sevgine de çok açım miyav, biraz sarılır mısın? 😿💧',
      'Hüüü... Boş mama kabıma bakıp iç çekiyorum miyav 😿🐟',
    ],
  },
  eating: {
    sheet: 'all_anims',
    row: 13,
    frames: 15,
    duration: '1.4s',
    label: 'EATING',
    screenshotGroup: 'ANIMATIONS - 2',
    bubbleTexts: [
      'Hammm ham! Dünyanın en lezzetli balığı bu mırrr! 🐟💖',
      'Çok teşekkür ederim iki ayaklım, karnım doyuyor! 🤤✨',
      'Nom nom nom... Minik patilerimle tabağı sıyırıyorum! 🐟🐾',
      'Mırrr mırrr, o kadar tatlı ki çiğnemeden yutuyorum! 😋💕',
    ],
  },
  waiting: {
    sheet: 'all_anims',
    row: 14,
    frames: 6,
    duration: '1.1s',
    label: 'WAITING',
    screenshotGroup: 'ANIMATIONS - 2',
    bubbleTexts: [
      'Kapının önünde oturdum, seni bekliyorum miyav 🚪🥺',
      'Çabuk gel olur mu, sensiz odanın tadı yok miyav ⏳💖',
      'Pati pati bekliyorum, içeri girince hemen sevicem ⏳🐾',
    ],
  },
  dead: {
    sheet: 'all_anims',
    row: 6,
    frames: 12,
    duration: '1.6s',
    label: 'DEAD',
    screenshotGroup: 'ANIMATIONS - 2',
    bubbleTexts: [
      'Aşırı sevimlilikten bayıldım miyav... Pofuduk göbüşümü sev 🐾',
      'Hamur gibi eridim buraya, bir öpücükle uyanırım miyav 🐾💕',
      'Dermanım kalmadı mırrr, puf gibi yattım buraya 🫠✨',
    ],
  },
  laydown: {
    sheet: 'all_anims',
    row: 6,
    frames: 12,
    duration: '1.6s',
    label: 'LAY DOWN',
    screenshotGroup: 'ANIMATIONS - 2',
    bubbleTexts: [
      'Halıya serildim, yumuşacık bir hamur oldum miyav 🛋️🐾',
      'Bütün patilerimi açtım, keyif yapıyorum mırrr 🫠💕',
      'Beni böyle sevebilir misin miyav, hiç kıpırdamak istemiyorum 🛋️✨',
    ],
  },

  // ─── ANIMATIONS - 3 ───
  shy: {
    sheet: 'all_anims',
    row: 17,
    frames: 11,
    duration: '1.2s',
    label: 'SHY',
    screenshotGroup: 'ANIMATIONS - 3',
    bubbleTexts: [
      'Ayyy öyle tatlı bakma miyav, pembe yanaklarım kızardı 🥰🙈',
      'Patilerimle yüzümü kapattım, çok utandım mırrr 🥰🫣',
      'Beni övünce pofuduk kalbim eriyor miyavvv 🥰🌸',
      'Aynı Eren gibi utandım miyav, yanaklarım al al oldu 🥰🙈',
      'Böyle güzel bakınca aynı Eren gibi utanıyorum mırrr 🥰🫣',
    ],
  },
  refusing: {
    sheet: 'all_anims',
    row: 15,
    frames: 11,
    duration: '1.2s',
    label: 'REFUSING',
    screenshotGroup: 'ANIMATIONS - 3',
    bubbleTexts: [
      'Cık cık, bunu istemiyorum miyav, yaş mama yok mu acaba? 🥺🐾',
      'Burnumu kıvırdım miyav, başka bir şey ver lütfen 🥺🌸',
      'Pati pati geri çekiliyorum, sonra yesem olur mu? 🥺',
    ],
  },
  angry: {
    sheet: 'all_anims',
    row: 16,
    frames: 8,
    duration: '0.8s',
    label: 'ANGRY',
    screenshotGroup: 'ANIMATIONS - 3',
    bubbleTexts: [
      'Mırmır kızdım birazcık! Ama hemen sarılırsan geçer miyav 😾🌸',
      'Tısss! Bıyıklarımı çattım ama yine de çok tatlıyım di mi? 😾💕',
      'Küstüm sana... Şaka şaka, minnak bir öpücüğe affederim! 😾✨',
    ],
  },

  // ─── ANIMATIONS - 4 ───
  licking: {
    sheet: 'all_anims',
    row: 19,
    frames: 10,
    duration: '1.1s',
    label: 'LICKING',
    screenshotGroup: 'ANIMATIONS - 4',
    bubbleTexts: [
      'Yala yala pırıl pırıl, en bakımlı yavru pisi benim miyav 🐾🧼',
      'Pembiş burnumu ve patilerimi temizliyorum mırrr 🐾✨',
      'Mis gibi oldum miyav, şimdi sevebilirsin beni! 🐾🌸',
    ],
  },
  despite: {
    sheet: 'all_anims',
    row: 18,
    frames: 4,
    duration: '1.0s',
    label: 'DESPITE',
    screenshotGroup: 'ANIMATIONS - 4',
    bubbleTexts: [
      'Hıh! Birazcık naz yapıyorum, gelip kucağına al beni 🥺💅',
      'Sırtımı döndüm ama kuyruğum hala sana sallanıyor miyav 🥺🐾',
      'Birazcık sev beni hemen barışırım ki miyavvv 🥺💕',
    ],
  },

  // ─── ANIMATIONS - BATHTUB ───
  bathtub: {
    sheet: 'bathtub',
    row: 1,
    frames: 7,
    duration: '1.2s',
    label: 'BATHTUB',
    screenshotGroup: 'ANIMATIONS - BATHTUB',
    bubbleTexts: [
      'Foşş foşş! Köpükler burnuma kondu, pış pış banyo çok tatlı 🛁🫧',
      'Köpükten minik şapkam oldu miyav, bak pisi prense! 🛁👑',
      'Ilık su çok güzelmiş mırrr, mis gibi kokacağım 🛁🌸',
      'Köpük baloncuklarını patimle patlatıyorum miyav! 🛁🫧',
    ],
  },

  // ─── ANIMATIONS - 5 ───
  sick1: {
    sheet: 'catsick1',
    frames: 5,
    duration: '1.2s',
    label: 'SICK 1',
    screenshotGroup: 'ANIMATIONS - 5',
    bubbleTexts: [
      'Minik patim acıdı biraz ama sen yanımdasın diye iyiyim miyav 💉🥺',
      'Birazcık halsizim mırrr, beni sıcacık sarar mısın? 💉🌸',
      'İyileşince odada fırıl fırıl koşacağım miyav, söz! 💉💕',
    ],
  },
  sick2: {
    sheet: 'catsick2',
    frames: 4,
    duration: '1.1s',
    label: 'SICK 2',
    screenshotGroup: 'ANIMATIONS - 5',
    bubbleTexts: [
      'Ateşim birazcık çıkmış miyav, soğuk pati kompresi lütfen 🌡️🥺',
      'Battaniyenin altına kıvrıldım, bana şifa mırıltısı ver 🌡️🤧',
      'Çabucak iyileşip sana pati çakmak istiyorum miyav 🌡️💖',
    ],
  },

  // ─── ANIMATIONS - BOX ───
  box1: {
    sheet: 'all_anims',
    row: 9,
    frames: 12,
    duration: '1.3s',
    label: 'BOX 1',
    screenshotGroup: 'ANIMATIONS - BOX',
    bubbleTexts: [
      'Kutunun içinden gizlice bakıyorum, ce-ee miyav! 📦👀',
      'Kutu benim minik kalem, çok güvendeyim burada 📦✨',
      'Kutudan burnumu uzattım, kokunu aldım miyav! 📦🌸',
    ],
  },
  box2: {
    sheet: 'all_anims',
    row: 10,
    frames: 4,
    duration: '1.0s',
    label: 'BOX 2',
    screenshotGroup: 'ANIMATIONS - BOX',
    bubbleTexts: [
      'Sığdım buraya miyav! Kediler sıvıdır derlerdi doğruymuş 📦😻',
      'Kutu o kadar rahat ki pufuduk yatak gibi oldu 📦✨',
      'Burası benim gizli oyun evim miyavvv 📦🐾',
    ],
  },
  box3: {
    sheet: 'all_anims',
    row: 11,
    frames: 4,
    duration: '0.9s',
    label: 'BOX 3',
    screenshotGroup: 'ANIMATIONS - BOX',
    bubbleTexts: [
      'Kutudayım ama kuyruğum dışarıda sallanıyor miyav! 📦🐾',
      'Kuyruğumu anten yaptım, senin sevgini çekiyorum bzzzt 📦📡',
      'Kutudan patimi uzatıp sana dokunabilir miyim miyav? 📦💕',
    ],
  },

  // ─── GÜVENLİ GERİYE DÖNÜK UYUMLULUK (Siyah Kedi Tamamen Çıkarıldı) ───
  chilling: {
    sheet: 'all_anims',
    row: 6,
    frames: 12,
    duration: '1.6s',
    label: 'LAY DOWN',
    screenshotGroup: 'ANIMATIONS - 2',
    bubbleTexts: [
      'Ohhh mindere uzandım, dünya tatlısı bir hayat bu mırrr 🛋️☕',
      'Yanında olmak bana o kadar huzur veriyor ki miyav 🛋️💖',
      'Pofuduk patilerimi uzattım, mışıl mışıl keyif yapıyorum 🌸',
    ],
  },
  tickle: {
    sheet: 'all_anims',
    row: 19,
    frames: 10,
    duration: '1.1s',
    label: 'LICKING',
    screenshotGroup: 'ANIMATIONS - 4',
    bubbleTexts: [
      'İhihi gıdıklanıyorum! Göbüşüm çok hassas mırrr 😻🐾',
      'Ihihi yapma pati atarım ama çok hoşuma gidiyor! 😻💕',
      'Gıdıklanırken bile seni seviyorum miyavvv ihihi 😻🌸',
    ],
  },
  running: {
    sheet: 'all_anims',
    row: 3,
    frames: 4,
    duration: '0.65s',
    label: 'DANCE',
    screenshotGroup: 'ANIMATIONS - 1',
    bubbleTexts: [
      'Vııın! Minik patilerimle odada neşeyle dönüyorum miyav! 💃✨',
      'Patilerim tıkır tıkır ses çıkarıyor, neşe doluyum! 🐾💖',
    ],
  },
  jumping: {
    sheet: 'all_anims',
    row: 5,
    frames: 12,
    duration: '0.9s',
    label: 'EXCITED',
    screenshotGroup: 'ANIMATIONS - 1',
    bubbleTexts: [
      'Hoppalaaa! Bak iki patim havada nasıl seviniyorum miyav! 🐾✨',
      'Havada minik bir akrobat oldum mırrr! 🎉💖',
    ],
  },
  so_full: {
    sheet: 'all_anims',
    row: 13,
    frames: 15,
    duration: '1.4s',
    label: 'EATING',
    screenshotGroup: 'ANIMATIONS - 2',
    bubbleTexts: [
      'Offf göbüşüm pufuduk balon gibi oldu, çok doydum mırrr 🍗💤',
      'Dünyanın en mutlu kedisiyim, teşekkür ederim mama için 🍗💖',
    ],
  },
  attack: {
    sheet: 'all_anims',
    row: 16,
    frames: 8,
    duration: '0.8s',
    label: 'ANGRY',
    screenshotGroup: 'ANIMATIONS - 3',
    bubbleTexts: [
      'Pati saldırısı miyav! Minik bıyıklarımı çattım 😾🐾',
    ],
  },
  hurt: {
    sheet: 'catsick2',
    frames: 4,
    duration: '1.1s',
    label: 'SICK 2',
    screenshotGroup: 'ANIMATIONS - 5',
    bubbleTexts: [
      'Ayyy minnak patim çarptı miyav, biraz öper misin? 🩹🥺',
    ],
  },
  born: {
    sheet: 'all_anims',
    row: 3,
    frames: 4,
    duration: '0.65s',
    label: 'DANCE',
    screenshotGroup: 'ANIMATIONS - 1',
    bubbleTexts: [
      'Yeniden canlandım miyav! Pırıl pırıl dans ediyorum 🪩✨',
    ],
  },
  walk: {
    sheet: 'all_anims',
    row: 1,
    frames: 8,
    duration: '1.2s',
    label: 'IDLE 2',
    screenshotGroup: 'ANIMATIONS - 1',
    bubbleTexts: [
      'Pati pati geziyorum odanın her köşesini 🐾✨',
    ],
  },
  happy: {
    sheet: 'all_anims',
    row: 5,
    frames: 12,
    duration: '0.9s',
    label: 'EXCITED',
    screenshotGroup: 'ANIMATIONS - 1',
    bubbleTexts: [
      'Dünyanın en mutlu kedisiyim miyav! 😸✨',
    ],
  },
  sad: {
    sheet: 'all_anims',
    row: 8,
    frames: 4,
    duration: '0.8s',
    label: 'CRYING',
    screenshotGroup: 'ANIMATIONS - 2',
    bubbleTexts: [
      'Birazcık hüzünlendim miyav, patimi tutar mısın? 🥺💔',
    ],
  },
};

// Rastgele Kedice Replik Seçici Fonksiyon
export const getCatQuote = (act: CatActionType): string => {
  const meta = USER_CAT_ANIMATIONS[act];
  if (!meta || !meta.bubbleTexts || meta.bubbleTexts.length === 0) return 'Miyavvv! 🐾';
  const randomIndex = Math.floor(Math.random() * meta.bubbleTexts.length);
  return meta.bubbleTexts[randomIndex];
};

interface PixelCatSpriteProps {
  mood: CatMood;
  isSleeping: boolean;
  isPetted: boolean;
  isFeeding: boolean;
  actionOverride?: CatActionType;
  scale?: number;
  tubRow?: number;
}

export const PixelCatSprite: React.FC<PixelCatSpriteProps> = ({
  mood,
  isSleeping,
  isPetted,
  isFeeding,
  actionOverride,
  scale = 120,
  tubRow,
}) => {
  let currentAction: CatActionType = 'idle';

  if (actionOverride) {
    currentAction = actionOverride;
  } else if (isFeeding) {
    currentAction = 'eating';
  } else if (isPetted) {
    currentAction = 'licking';
  } else if (isSleeping) {
    currentAction = 'sleeping';
  } else if (mood === 'blooming') {
    currentAction = 'dance';
  } else if (mood === 'hungry') {
    currentAction = 'despite';
  } else if (mood === 'withered') {
    currentAction = 'sick1';
  } else {
    currentAction = 'idle';
  }

  const meta = USER_CAT_ANIMATIONS[currentAction] || USER_CAT_ANIMATIONS.idle;
  const animKey = `userCatAnim_${currentAction}`;

  // 1. ALL ANIMS SHEET (all_cat_anims.png - 32x32 Grid: 16 cols x 25 rows)
  if (meta.sheet === 'all_anims') {
    const sheetW = 16 * scale;
    const sheetH = 25 * scale;
    const rowY = (meta.row || 0) * scale;
    const animW = meta.frames * scale;

    return (
      <div
        className={`pixel-cat-character-box ${currentAction}`}
        style={{
          position: 'relative',
          width: scale,
          height: scale,
          imageRendering: 'pixelated',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          key={currentAction}
          style={{
            width: scale,
            height: scale,
            backgroundImage: 'url("/assets/cat_pixel/all_cat_anims.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${sheetW}px ${sheetH}px`,
            animation: `${animKey} ${meta.duration} steps(${meta.frames}) infinite`,
            imageRendering: 'pixelated',
            filter: mood === 'withered' && currentAction !== 'eating'
              ? 'grayscale(0.7) contrast(0.95)'
              : mood === 'blooming'
              ? 'drop-shadow(0 0 12px rgba(244,114,182,0.75))'
              : currentAction === 'angry'
              ? 'drop-shadow(0 0 8px rgba(244,63,94,0.6))'
              : 'drop-shadow(0 4px 8px rgba(0,0,0,0.45))',
          }}
        />

        {/* Kızgınlık öfke simgesi */}
        {currentAction === 'angry' && (
          <div
            style={{
              position: 'absolute',
              top: -12,
              right: 2,
              fontSize: '1.2rem',
              animation: 'angryFlash 0.5s infinite alternate',
              filter: 'drop-shadow(0 0 6px #ef4444)',
              pointerEvents: 'none',
            }}
          >
            💢
          </div>
        )}

        {/* Uyku Zzz */}
        {(currentAction === 'sleeping' || currentAction === 'sleepy') && (
          <div
            style={{
              position: 'absolute',
              top: -12,
              right: 6,
              display: 'flex',
              gap: 2,
              fontFamily: 'monospace',
              fontWeight: 800,
              color: '#c7d2fe',
              fontSize: '1.1rem',
              animation: 'floatZ 1.6s infinite ease-in-out',
              pointerEvents: 'none',
            }}
          >
            <span>z</span>
            <span>Z</span>
            <span>Z</span>
          </div>
        )}

        <style>{`
          @keyframes ${animKey} {
            0% { background-position: 0px -${rowY}px; }
            100% { background-position: -${animW}px -${rowY}px; }
          }
          @keyframes angryFlash {
            0% { transform: scale(0.9) rotate(-10deg); opacity: 0.8; }
            100% { transform: scale(1.2) rotate(10deg); opacity: 1; }
          }
          @keyframes floatZ {
            0%, 100% { transform: translateY(0); opacity: 0.6; }
            50% { transform: translateY(-7px); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // 2. BATHTUB SHEET (all_cat_bathtubs.png - 64x64 Grid: 7 frames x 8 rows)
  if (meta.sheet === 'bathtub') {
    const tubScale = scale * 1.15;
    const sheetW = 7 * tubScale;
    const sheetH = 8 * tubScale;
    const rowY = (tubRow !== undefined ? tubRow : (meta.row || 1)) * tubScale;
    const animW = 7 * tubScale;

    return (
      <div
        className="pixel-cat-character-box bathtub"
        style={{
          position: 'relative',
          width: tubScale,
          height: tubScale,
          imageRendering: 'pixelated',
          userSelect: 'none',
        }}
      >
        <div
          key={`bathtub_${tubRow}`}
          style={{
            width: tubScale,
            height: tubScale,
            backgroundImage: 'url("/assets/cat_pixel/all_cat_bathtubs.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${sheetW}px ${sheetH}px`,
            animation: `${animKey} ${meta.duration} steps(7) infinite`,
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))',
          }}
        />
        <style>{`
          @keyframes ${animKey} {
            0% { background-position: 0px -${rowY}px; }
            100% { background-position: -${animW}px -${rowY}px; }
          }
        `}</style>
      </div>
    );
  }

  // 3. SICK 1 (catsick1.png: 5 frames of 32x32)
  if (meta.sheet === 'catsick1') {
    const sickScale = scale;
    const animW = 5 * sickScale;

    return (
      <div
        className="pixel-cat-character-box sick1"
        style={{
          position: 'relative',
          width: sickScale,
          height: sickScale,
          imageRendering: 'pixelated',
          userSelect: 'none',
        }}
      >
        <div
          key="catsick1"
          style={{
            width: sickScale,
            height: sickScale,
            backgroundImage: 'url("/assets/cat_pixel/catsick1.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${animW}px ${sickScale}px`,
            animation: `animSick1 ${meta.duration} steps(5) infinite`,
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
          }}
        />
        <style>{`
          @keyframes animSick1 {
            0% { background-position: 0px 0px; }
            100% { background-position: -${animW}px 0px; }
          }
        `}</style>
      </div>
    );
  }

  // 4. SICK 2 (catsick2.png: 4 frames of 32x32)
  if (meta.sheet === 'catsick2') {
    const sickScale = scale;
    const animW = 4 * sickScale;

    return (
      <div
        className="pixel-cat-character-box sick2"
        style={{
          position: 'relative',
          width: sickScale,
          height: sickScale,
          imageRendering: 'pixelated',
          userSelect: 'none',
        }}
      >
        <div
          key="catsick2"
          style={{
            width: sickScale,
            height: sickScale,
            backgroundImage: 'url("/assets/cat_pixel/catsick2.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${animW}px ${sickScale}px`,
            animation: `animSick2 ${meta.duration} steps(4) infinite`,
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
          }}
        />
        <style>{`
          @keyframes animSick2 {
            0% { background-position: 0px 0px; }
            100% { background-position: -${animW}px 0px; }
          }
        `}</style>
      </div>
    );
  }

  // 5. ÖZEL TEMİZ TEK SATIR STRİPLER (Chilling, Tickle, Running, Jumping, So Full)
  if (meta.sheet === 'strip' && meta.stripUrl) {
    const animW = meta.frames * scale;

    return (
      <div
        className={`pixel-cat-character-box ${currentAction}`}
        style={{
          position: 'relative',
          width: scale,
          height: scale,
          imageRendering: 'pixelated',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          key={currentAction}
          style={{
            width: scale,
            height: scale,
            backgroundImage: `url("${meta.stripUrl}")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${animW}px ${scale}px`,
            backgroundPosition: '0px 0px',
            animation: meta.frames > 1 ? `${animKey} ${meta.duration} steps(${meta.frames}) infinite` : 'none',
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
          }}
        />
        {meta.frames > 1 && (
          <style>{`
            @keyframes ${animKey} {
              0% { background-position: 0px 0px; }
              100% { background-position: -${animW}px 0px; }
            }
          `}</style>
        )}
      </div>
    );
  }

  return null;
};



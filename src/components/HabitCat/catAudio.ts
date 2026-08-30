// Web Audio API Synthesizer for Cat & Habit Effects
// 100% Client-side, zero external dependency, instant playback without lag or 404s!

function getAudioContext(): AudioContext | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    return AudioCtx ? new AudioCtx() : null;
  } catch {
    return null;
  }
}

// 1. 🐱 Tatlı Yavru Kedi Miyavı (Idle, Selam, Tıklama)
export function playCuteMeow() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(820, now);
    osc1.frequency.exponentialRampToValueAtTime(1280, now + 0.11);
    osc1.frequency.exponentialRampToValueAtTime(680, now + 0.35);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1640, now);
    osc2.frequency.exponentialRampToValueAtTime(2560, now + 0.11);
    osc2.frequency.exponentialRampToValueAtTime(1360, now + 0.35);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.37);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.38);
    osc2.stop(now + 0.38);
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 2. 💖 Sevgi & Titreşimli Mırıltı (Petting, Okşama)
export function playHappyPurr() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(78, now);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(26, now); // 26 Hz purr vibration
    lfoGain.gain.setValueAtTime(32, now);

    lfo.connect(osc.frequency);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.1);
    gain.gain.setValueAtTime(0.24, now + 0.85);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + 1.2);
    osc.stop(now + 1.2);
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 3. 🐟 Çıtır Çıtır Mama / Balık Yeme (Eating)
export function playEatingCrunch() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const start = now + i * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(550 + Math.random() * 200, start);
      osc.frequency.exponentialRampToValueAtTime(180, start + 0.06);

      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.07);
    }
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 4. 🛁 Banyo Su Şıpırtısı ve Baloncuklar (Bathtub)
export function playWaterSplashBubble() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    // 4 damla / baloncuk patlaması
    [480, 720, 960, 1200].forEach((freq, i) => {
      const start = now + i * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.6, start + 0.06);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.13);
    });
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 5. 🦘 Yay Gibi Zıplama "Booo-iiing!" (Jump / Jumping / Excited)
export function playBoingJump() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.35);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 6. 😾 Hırlama & Tıslama "Hısssss!" (Angry)
export function playHissAngry() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240 + i * 80, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.45);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 7. 😿 Ağlamaklı Yavru Kedi Sesi (Crying / Sick / Refusing)
export function playSadMew() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(560, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.48);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.55);
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 8. 🪩 Neşeli 8-Bit Disko Dans Melodisi (Dance)
export function playDanceJingle() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const notes = [1046.50, 1318.51, 1567.98, 2093.00, 1760.00, 2093.00];
    notes.forEach((freq, i) => {
      const start = now + i * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.12, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.13);
    });
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 9. 😲 Komik Şaşırma "Bop-Pop!" (Surprised)
export function playSurprisePop() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.14);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.24);
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 10. 🏎️ Hızlı Pati Tıpırtısı (Running)
export function playFootstepsPaws() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    for (let i = 0; i < 6; i++) {
      const start = now + i * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220 + (i % 2) * 50, start);
      osc.frequency.exponentialRampToValueAtTime(90, start + 0.04);

      gain.gain.setValueAtTime(0.16, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.05);
    }
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 11. 🌪️ Pati Savurma "Whooosh!" (Attack / Fury)
export function playPounceWhoosh() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.22);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 12. 💤 Mışıl Mışıl Uyku Horlaması (Sleeping / Sleepy)
export function playSleepySnore() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(150, now + 0.4);
    osc.frequency.linearRampToValueAtTime(95, now + 0.8);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.9);
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 13. 🥱 Uykulu Kedi Esnemesi (Laydown / Chilling)
export function playYawnStretch() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(540, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.6);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.7);
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 14. 🤰 Balon Göbüş Puf Sesi (So Full)
export function playPlopFull() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.3);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 15. 📦 Kutu Hışırtısı (Box)
export function playBoxRustle() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const start = now + i * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180 + Math.random() * 80, start);
      osc.frequency.linearRampToValueAtTime(80, start + 0.07);

      gain.gain.setValueAtTime(0.14, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.08);
    }
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 16. 👅 Kedi Yalanma Sesi (Licking)
export function playLickingSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    for (let i = 0; i < 2; i++) {
      const start = now + i * 0.14;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, start);
      osc.frequency.exponentialRampToValueAtTime(320, start + 0.08);

      gain.gain.setValueAtTime(0.14, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.1);
    }
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 17. 🐭 Minik Fare Cik-Cik Sesi (Fare Ortaya Çıktığında)
export function playMouseSqueak() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    for (let i = 0; i < 2; i++) {
      const start = now + i * 0.11;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2600, start);
      osc.frequency.exponentialRampToValueAtTime(3800, start + 0.05);

      gain.gain.setValueAtTime(0.14, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.07);
    }
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 18. 🪙 Altın Sikke / Fare Yakalama Başarısı (Coin Success)
export function playCoinSuccess() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    [987.77, 1318.51].forEach((freq, i) => {
      const start = now + i * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.22, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.3);
    });
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 19. 🌟 Alışkanlık / Görev Tamamlama Çanı (Quest Complete)
export function playQuestCompleteSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    [523.25, 783.99, 987.77, 1318.51].forEach((freq, i) => {
      const start = now + i * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.2, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.48);
    });
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 20. 🌸 Büyülü Şifa & Yeniden Canlanma (Revive / Born)
export function playReviveMagicSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      const start = now + idx * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.2, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.38);
    });
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 21. 💀 Komik Yenilgi / Bayılma "Wah-wah-wah" (Dead)
export function playGameOverDead() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const notes = [440, 415.30, 392, 349.23];
    notes.forEach((freq, i) => {
      const start = now + i * 0.13;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + (i === 3 ? 0.4 : 0.12));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + (i === 3 ? 0.42 : 0.13));
    });
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 22. 💓 Pıt-Pıt Kalp Dokunuşu Sesi (Pet Click)
export function playHeartBeatSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    [90, 80].forEach((freq, i) => {
      const start = now + i * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(45, start + 0.08);

      gain.gain.setValueAtTime(0.24, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.1);
    });
  } catch (e) {
    console.error('Audio error', e);
  }
}

// 🐾 Bütün Animasyonlar İçin Otomatik Ses Yönlendirici (Central Dispatcher)
export function playAnimationAudio(act: string) {
  switch (act) {
    case 'eating':
      playEatingCrunch();
      break;
    case 'bathtub':
      playWaterSplashBubble();
      break;
    case 'jump':
    case 'jumping':
    case 'excited':
      playBoingJump();
      break;
    case 'angry':
      playHissAngry();
      break;
    case 'crying':
    case 'cry':
    case 'sad':
    case 'sick1':
    case 'sick2':
    case 'refusing':
    case 'despite':
      playSadMew();
      break;
    case 'dance':
      playDanceJingle();
      break;
    case 'surprised':
      playSurprisePop();
      break;
    case 'running':
      playFootstepsPaws();
      break;
    case 'attack':
      playPounceWhoosh();
      break;
    case 'sleeping':
    case 'sleep':
    case 'sleepy':
      playSleepySnore();
      break;
    case 'laydown':
    case 'chilling':
      playYawnStretch();
      break;
    case 'so_full':
      playPlopFull();
      break;
    case 'box1':
    case 'box2':
    case 'box3':
      playBoxRustle();
      break;
    case 'licking':
      playLickingSound();
      break;
    case 'born':
      playReviveMagicSound();
      break;
    case 'dead':
    case 'dead1':
    case 'dead2':
    case 'death1':
    case 'death2':
      playGameOverDead();
      break;
    case 'idle':
    default:
      playCuteMeow();
      break;
  }
}

export const playAngryCatAudio = playHissAngry;



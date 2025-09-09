// Debug logs in English
const log = (...args) => console.log("[DESUWA]", ...args);

const imagesForMain = [
  { src: 'desuwa.png', weight: 1, scale: 1.0 },
  { src: 'desuwa2.png', weight: 1, scale: 1.5 },
  { src: 'desuwa3.png', weight: 1, scale: 1.5 },
];

function pickRandomImage() {
  const index = Math.floor(Math.random() * imagesForMain.length);
  return imagesForMain[index];
}

function updateTitle(count) {
  document.title = `Desuwa x ${count}`;
}

function spawnFlyingAt(x, y) {
  const img = document.createElement('img');
  img.src = 'desuwa.png';
  img.alt = 'desuwa fly';
  img.className = 'spawn';
  img.style.left = `${x}px`;
  img.style.top = `${y}px`;
  document.body.appendChild(img);
  img.addEventListener('animationend', () => img.remove());
}

window.addEventListener('DOMContentLoaded', () => {
  const mainImg = document.getElementById('mainImg');
  const btn = document.getElementById('desuwaBtn');
  const audio = document.getElementById('desuwaAudio');
  const volume = document.getElementById('volume');
  const counterEl = document.getElementById('counter');
  const swapBtn = document.getElementById('changeImg');
  const resetBtn = document.getElementById('resetCounter');
  let lastTouch = 0;

  // Randomize main image per visit
  const chosen = pickRandomImage();
  mainImg.src = chosen.src;
  mainImg.style.setProperty('--imgScale', chosen.scale);
  log('Main image:', chosen);

  // Counter persisted in session
  const SESSION_KEY = 'desuwa-count';
  let count = Number(sessionStorage.getItem(SESSION_KEY) || 0);
  counterEl.textContent = `DESUWA !! x ${count}`;
  updateTitle(count);

  // Volume control
  audio.volume = Number(volume.value);
  volume.addEventListener('input', () => {
    audio.volume = Number(volume.value);
  });

  // Click behavior
  const trigger = (x, y) => {
    // Overlapping audio: new instance each time to avoid cutting off previous
    const player = new Audio(audio.src);
    player.volume = Number(volume.value);
    player.play().catch(err => log('Audio play blocked', err));
    btn.classList.remove('bonk');
    // Force reflow to restart animation
    void btn.offsetWidth;
    btn.classList.add('bonk');
    spawnFlyingAt(x, y);
    count += 1;
    counterEl.textContent = `DESUWA !! x ${count}`;
    counterEl.classList.remove('bounce');
    void counterEl.offsetWidth;
    counterEl.classList.add('bounce');
    sessionStorage.setItem(SESSION_KEY, String(count));
    updateTitle(count);
    spawnSpeech(x, y);
  };

  btn.addEventListener('click', (e) => {
    if (Date.now() - lastTouch < 400) return; // ignore ghost click after touch
    const rect = (e.currentTarget).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    trigger(x, y);
  });

  // Also handle touch devices
  btn.addEventListener('touchstart', (e) => {
    lastTouch = Date.now();
    const t = e.touches[0];
    trigger(t.clientX, t.clientY);
  }, { passive: true });

  // Swap image on demand
  const swap = () => {
    const current = imagesForMain.findIndex(i => i.src === mainImg.getAttribute('src'));
    let next = current + 1;
    if (next >= imagesForMain.length) next = 0;
    const chosen = imagesForMain[next];
    mainImg.src = chosen.src;
    mainImg.style.setProperty('--imgScale', chosen.scale);
  };
  swapBtn.addEventListener('click', swap);

  // Reset counter
  resetBtn.addEventListener('click', () => {
    count = 0;
    sessionStorage.setItem(SESSION_KEY, '0');
    counterEl.textContent = `DESUWA !! x ${count}`;
    updateTitle(count);
  });

  // Spawn random speech bubble text near click
  function spawnSpeech(x, y){
    const texts = [
      'DESUWA!', 'desu...wa!', 'De—su—wa~', 'DE SU W A', 'desu(wa?)', 'DESUWA!!!', 'desuwa~', 'desu...'
    ];
    const el = document.createElement('div');
    el.textContent = texts[Math.floor(Math.random()*texts.length)];
    el.style.position = 'fixed';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.transform = 'translate(-50%, -120%)';
    el.style.background = 'white';
    el.style.color = '#111';
    el.style.borderRadius = '10px';
    el.style.padding = '4px 8px';
    el.style.fontWeight = '900';
    el.style.fontSize = '14px';
    el.style.pointerEvents = 'none';
    el.style.boxShadow = '0 6px 18px rgba(0,0,0,.25)';
    el.style.opacity = '0.95';
    el.style.animation = 'speechFly 700ms ease-out forwards';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 750);
  }
});



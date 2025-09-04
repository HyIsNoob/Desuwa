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
  document.title = 'Desuwa';
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

  // Randomize main image per visit
  const chosen = pickRandomImage();
  mainImg.src = chosen.src;
  mainImg.style.setProperty('--imgScale', chosen.scale);
  log('Main image:', chosen);

  // Counter reset on refresh
  let count = 0;
  counterEl.textContent = `DESUWA !! x ${count}`;
  updateTitle(count);

  // Volume control
  audio.volume = Number(volume.value);
  volume.addEventListener('input', () => {
    audio.volume = Number(volume.value);
  });

  // Click behavior
  const trigger = (x, y) => {
    try { audio.currentTime = 0; } catch {}
    audio.play().catch(err => log('Audio play blocked', err));
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
    updateTitle(count);
  };

  btn.addEventListener('click', (e) => {
    const rect = (e.currentTarget).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    trigger(x, y);
  });

  // Also handle touch devices
  btn.addEventListener('touchstart', (e) => {
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
});



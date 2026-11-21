// 網頁版簡報：方向鍵／空白鍵／點擊翻頁，網址 #3 可直接跳頁，N 或「講稿」按鈕顯示講稿
(() => {
  const deck = document.getElementById('deck');
  const slides = [...deck.children];
  const count = document.getElementById('count');
  const note = document.getElementById('note');
  const notesBtn = document.getElementById('notes');
  let i = Math.min(Math.max((parseInt(location.hash.slice(1), 10) || 1) - 1, 0), slides.length - 1);
  const fit = () => {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    deck.style.transform = `scale(${s}) translate(-960px, -540px)`;
  };
  const show = (n) => {
    i = Math.min(Math.max(n, 0), slides.length - 1);
    slides.forEach((el, k) => {
      el.classList.toggle('on', k === i);
      el.querySelectorAll('video').forEach((v) => { if (k === i) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause(); });
    });
    count.textContent = `${i + 1}／${slides.length}`;
    const a = slides[i].querySelector('aside');
    note.textContent = a ? a.textContent : '';
    history.replaceState(null, '', `#${i + 1}`);
  };
  document.getElementById('prev').onclick = () => show(i - 1);
  document.getElementById('next').onclick = () => show(i + 1);
  const toggleNotes = () => { note.hidden = !note.hidden; notesBtn.setAttribute('aria-pressed', String(!note.hidden)); };
  notesBtn.onclick = toggleNotes;
  addEventListener('keydown', (e) => {
    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); show(i + 1); }
    if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); show(i - 1); }
    if (e.key === 'Home') show(0);
    if (e.key === 'End') show(slides.length - 1);
    if (e.key === 'n' || e.key === 'N') toggleNotes();
  });
  deck.addEventListener('click', (e) => { if (!e.target.closest('a, button, video')) show(e.clientX > innerWidth / 2 ? i + 1 : i - 1); });
  let x0 = null;
  addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1)); x0 = null; });
  addEventListener('hashchange', () => { const n = (parseInt(location.hash.slice(1), 10) || 1) - 1; if (n !== i) show(n); });
  addEventListener('resize', fit);
  fit(); show(i);
})();

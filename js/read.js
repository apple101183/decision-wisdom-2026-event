// 書房：目錄頁與文章頁（read.html?id=a12&q=引文）
import { ARTICLES } from './data.js';
import { esc, CHAPTERS, articleParts } from './reader-core.js';

const $a = document.getElementById('article');
const IDS = Object.keys(ARTICLES);
const params = new URLSearchParams(location.search);
const id = IDS.includes(params.get('id')) ? params.get('id') : null;
const q = params.get('q') || '';

function shelf() {
  const groups = {};
  for (const k of IDS) (groups[ARTICLES[k].chapter] ||= []).push(k);
  $a.className = 'shelf';
  $a.innerHTML = `
    <div class="shelf-intro">
      <p class="kicker">書房｜決策智慧 2026</p>
      <h1>22 篇，不用從頭讀</h1>
      <span class="bar"></span>
      <p>挑一篇在遊戲裡打到你的，<br>或從一個你正在煩惱的題目開始。</p>
    </div>
    ${Object.entries(groups).map(([ch, ks]) => {
      const c = CHAPTERS[ch];
      return `<section class="chapter" style="--c:${c.color}">
        <div class="chapter-card">${c.img ? `<img src="${c.img}" alt="">` : ''}
          <p class="label"><span class="num">${c.num}</span><span class="name">${esc(ch)}</span></p></div>
        <ol class="chapter-list">${ks.map((k) => `<li><a href="read.html?id=${k}">${esc(ARTICLES[k].title)}</a>
          <span>${esc(ARTICLES[k].author)}・p.${esc(ARTICLES[k].pages)}</span></li>`).join('')}</ol>
      </section>`;
    }).join('')}`;
}

async function article() {
  const p = await articleParts(id, q);
  document.body.dataset.ch = p.meta.chapter;
  document.title = `${p.meta.title}｜書房`;
  const idx = IDS.indexOf(id);
  const prev = IDS[idx - 1]; const next = IDS[idx + 1];
  $a.className = 'spread';
  $a.innerHTML = `
    <header class="opener">${p.opener}</header>
    <div class="pages">
      ${p.head}
      ${p.hit >= 0 ? '<p class="read-jump"><a href="#" id="jump">跳到遊戲中引用的段落 ↓</a></p>' : ''}
      ${p.toc}
      ${p.body}
      ${p.notes}
      ${p.icon}
      <nav class="read-nav">
        ${prev ? `<a href="read.html?id=${prev}">← ${esc(ARTICLES[prev].title)}</a>` : '<span></span>'}
        <a href="read.html">書房目錄</a>
        ${next ? `<a href="read.html?id=${next}">${esc(ARTICLES[next].title)} →</a>` : '<span></span>'}
      </nav>
    </div>`;
  const hit = $a.querySelector('.hit');
  if (hit) {
    hit.scrollIntoView({ block: 'center' });
    document.getElementById('jump').onclick = (e) => { e.preventDefault(); hit.scrollIntoView({ block: 'center', behavior: 'smooth' }); };
  }
}

const prog = document.getElementById('prog');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  prog.style.width = `${Math.min(100, (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100)}%`;
}, { passive: true });

if (id) article(); else shelf();

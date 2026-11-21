// 文章內容的共用模組：書房頁（read.html）與遊戲內的閱讀面板都用它
import { ARTICLES } from './data.js';

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = (s) => String(s).replace(/[\s　「」『』，。、：；！？（）()．.,:;!?"'‘’“”—–-]/g, '');

export const CHAPTERS = {
  Intro: { num: '00', img: null, color: '#d8d4cb' },
  People: { num: '01', img: 'img/ch-people.jpg', color: '#cfe07a' },
  Model: { num: '02', img: 'img/ch-model.jpg', color: '#f0c4c3' },
  AI: { num: '03', img: 'img/ch-ai.jpg', color: '#8ad0de' },
};
const ICONS = ['img/icon-search.png', 'img/icon-growth.png', 'img/icon-box.png', 'img/icon-pie.png'];

let cache = null;
export async function loadArticles() {
  if (!cache) cache = (await fetch('data/articles.json')).json();
  return cache;
}

// 回傳文章的各個部分；q 為引文，會標示所在段落
export async function articleParts(id, q = '') {
  const meta = ARTICLES[id];
  const blocks = (await loadArticles())[id] || [];
  const bylines = blocks.filter((b) => b.t === 'byline').map((b) => b.text);
  const dek = blocks.find((b) => b.t === 'dek');
  const body = blocks.filter((b) => ['p', 'h2', 'h3', 'h4', 'quote', 'cap', 'fig'].includes(b.t));
  const notes = blocks.filter((b) => b.t === 'note');
  const chars = body.reduce((s, b) => s + (b.text || '').length, 0);
  const minutes = Math.max(1, Math.round(chars / 450));
  const target = norm(q).slice(0, 14);
  const hit = target ? body.findIndex((b) => b.text && norm(b.text).includes(target)) : -1;
  const heads = body.map((b, i) => [b, i]).filter(([b]) => b.t === 'h2' || b.t === 'h3');

  const block = (b, i) => {
    const mark = i === hit ? ' class="hit"' : '';
    if (b.t === 'fig') {
      // 原刊的照片與圖表（多張並排）
      return `<figure class="art-fig n${Math.min(b.src.length, 4)}">${b.src.map((f) => `<img src="${new URL(`../img/art/${f}`, import.meta.url).href}" alt="${esc(b.alt)}" loading="lazy" decoding="async">`).join('')}</figure>`;
    }
    const t = esc(b.text);
    switch (b.t) {
      case 'h2': return `<h2 id="s${i}"${mark}>${t}</h2>`;
      case 'h3': return `<h3 id="s${i}"${mark}>${t}</h3>`;
      case 'h4': return `<h4${mark}>${t}</h4>`;
      case 'quote': return `<p class="pull${i === hit ? ' hit' : ''}">${t}</p>`;
      case 'cap': return `<p class="cap${i === hit ? ' hit' : ''}"><span>圖表</span>${t}</p>`;
      default: return `<p${mark}>${t}</p>`;
    }
  };
  const iconIdx = Number(id.slice(1)) % ICONS.length;
  return {
    meta, minutes, hit,
    opener: `
      <p class="run">: ${esc(meta.chapter)}</p>
      <h1>${esc(meta.title)}</h1>
      <p class="by">${bylines.map((b) => `<b>${esc(b)}</b>`).join('') || esc(meta.author)}</p>
      ${dek ? `<p class="dek">${esc(dek.text)}</p>` : ''}`,
    head: `<div class="head"><span class="run">: ${esc(meta.chapter)}</span><span class="pg">p.${esc(meta.pages)}</span></div>`,
    toc: heads.length
      ? `<details class="read-toc"${hit < 0 ? ' open' : ''}><summary>本篇大綱（${heads.length}）・約 ${minutes} 分鐘</summary><ol>${heads.map(([b, i]) => `<li class="${b.t}"><a href="#s${i}" data-jump="s${i}">${esc(b.text)}</a></li>`).join('')}</ol></details>`
      : `<p class="meta">約 ${minutes} 分鐘</p>`,
    body: `<div class="read-body">${body.map(block).join('')}</div>`,
    notes: notes.length ? `<section class="read-notes"><h2>註解</h2><ol>${notes.map((n) => `<li>${esc(n.text)}</li>`).join('')}</ol></section>` : '',
    icon: `<img class="read-icon" src="${ICONS[iconIdx]}" alt="" aria-hidden="true">`,
  };
}

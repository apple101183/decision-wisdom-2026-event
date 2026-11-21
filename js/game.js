import {
  ARTICLES, FAMILIES, BRANDS, YEAR1, YEAR1_INTERNAL, INTERNAL_FAMILIES, DEBATES, YEAR3, YEAR5, ENDINGS, GAP19, TWIN_LIMIT, COHORT_NAMES, TWIN_INTRO, DEBATE_MORE, YEAR3_FAMILY,
} from './data.js';
import { mountDecor } from './decor.js';
import { makeAvatar, avatarSVG } from './avatar.js';
import { articleParts, keepNames } from './reader-core.js';
import { SKILLS, freshStats, applyGain, RULES, hexSVG, gainText, promoCheck } from './skills.js';

mountDecor(document.getElementById('decor'));

const $stage = document.getElementById('stage');
const $side = document.getElementById('side');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let S; // 遊戲狀態

// ---------- 工具 ----------
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// 內文斷行：逗號、句號、問號後直接換行（後面接引號或已到句尾則不換）
// 斷句：①只在句號、問號、驚嘆號、分號後換行（逗號不換），短句不換；
// ②用 Intl.Segmenter 把中文詞包成不可拆的單位，瀏覽器自動折行時不會把一個詞切兩半。
const seg = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('zh-Hant', { granularity: 'word' }) : null;
const phrase = (s) => (seg
  ? [...seg.segment(s)].map(({ segment: t }) => (/^[一-鿿]{2,6}$/.test(t) ? `<span class="nw">${esc(t)}</span>` : esc(t))).join('')
  : esc(s));
const fmt = (s, { breaks = true } = {}) => {
  const str = String(s);
  if (!breaks || str.length <= 36) return phrase(str);
  return str.split(/(?<=[。？！；])(?![」』）)]|$)/).map(phrase).join('<br>');
};
// 中文與英文人名之間補空格，例如「站在 People Model 團隊這邊」
const sp = (w) => (/^[A-Za-z]/.test(w) ? ` ${w}` : w);
// 文章連結：另開分頁進入書房，帶著引文讓文章頁標示出段落（遊戲進度不會中斷）
const artLink = (id, quote = '') => {
  const a = ARTICLES[id];
  const qs = quote ? `&q=${encodeURIComponent(quote.slice(0, 40))}` : '';
  return `<a class="to-article" href="read.html?id=${id}${qs}" target="_blank" rel="noopener" title="${esc(a.title)}">〈${esc(a.short)}〉</a>`;
};
const rand = (n) => Math.floor(Math.random() * n);
const pickOne = (arr) => arr[rand(arr.length)];
const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);

function pickBrand() {
  const total = BRANDS.reduce((s, b) => s + b.share, 0);
  let r = Math.random() * total;
  for (const b of BRANDS) { r -= b.share; if (r <= 0) return b; }
  return BRANDS[BRANDS.length - 1];
}

function quoteBlock(q, label = '出自哪篇') {
  if (q.article) S.met.add(q.article);
  const a = q.article ? ARTICLES[q.article] : null;
  const cite = a
    ? `${esc(a.author)}${artLink(q.article, q.text)}p.${esc(q.page)}`
    : esc(q.who || '');
  const note = q.note ? `<p class="src-note">${esc(q.note)}</p>` : '';
  return `<details class="src"><summary>${label}</summary>
    <blockquote>「${fmt(q.text)}」</blockquote><p class="cite">— ${cite}</p>${note}</details>`;
}

function render(html, accent = 'people', { bar = true } = {}) {
  $stage.dataset.accent = accent;
  document.body.dataset.ch = accent; // 背景浮水印跟著章節換
  $stage.innerHTML = html;
  // 主視覺的招牌：每個標題下方一條粗黑橫條
  const h = $stage.querySelector('h2');
  if (bar && h) h.insertAdjacentHTML('afterend', '<span class="bar" aria-hidden="true"></span>');
  keepNames($stage);
  $stage.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
}

function judgment(changed) { S.opps += 1; if (changed) S.j += 1; }
function twin(hit) { S.twinTotal += 1; if (hit) S.twinHits += 1; }

// 升遷門檻：升中階主管較寬，升大家長更嚴（交給 AI 的比例要更適中、自己拿主意的次數要更多）
// 升遷由六邊形決定：升中階主管要衡斷力與 AI 駕馭力都到位；升大家長要六項都不能有短板
function promotable(level = 1) {
  return promoCheck(S.stats, level).ok;
}
// 這一題的能力變化：玩家一份、AI 分身照它自己的預測走一份
function gain(g, tg) {
  applyGain(S.stats, g);
  applyGain(S.twinStats, tg);
  S.lastGain = g;
}

// ---------- 同梯（模擬） ----------
function makeCohort(me) {
  const list = [];
  const names = [...COHORT_NAMES].sort(() => Math.random() - 0.5);
  for (let i = 0; i < 3; i++) {
    const b = pickBrand();
    const [role] = pickOne(b.roles);
    list.push({ name: names[i], brand: b.name, role, t: 10 + rand(86), rank: '基層', status: '剛報到', out: null, avatar: makeAvatar() });
  }
  return list;
}

function advanceCohort(stage) {
  for (const c of S.cohort) {
    if (stage === 'day1') c.status = `把工作交給 AI ${Math.round(c.t / 10)} 成`;
    if (stage === 'year1') c.status = c.t >= 50 ? '提案前先問了 AI 分身' : '提案前直接找真人聊';
    if (stage === 'year3') {
      if (c.t >= 25 && c.t <= 85 && Math.random() < 0.6) { c.rank = '中階主管'; c.status = '升上中階主管'; } else c.status = '還在原本的位置';
    }
    if (stage === 'year5') {
      if (c.rank === '中階主管' && Math.random() < 0.4) { c.rank = '大家長'; c.out = '升上老闆'; }
      else if (c.t > 85) c.out = '位置被 AI 取代，離開了';
      else if (c.t < 25) c.out = '跟不上變化，離開了';
      else c.out = '換了跑道';
      c.status = c.out;
    }
  }
  renderSide();
}

// 側欄：下一個升遷目標與條件（大家長之後不再顯示）
function promoBox() {
  if (S.rank === '大家長' || (S.curStep || 0) > 4) return '';
  const lv = S.rank === '中階主管' ? 2 : 1;
  const r = promoCheck(S.stats, lv);
  const when = lv === 1 ? '第 2 題後判定' : '第 4 題後判定';
  return `<div class="promo"><p class="promo-t">升${r.to}的條件<span>${when}</span></p>
    <ul>${r.items.map((i) => `<li class="${i.ok ? 'ok' : 'no'}"><b>${i.ok ? '已達成' : '未達成'}</b><span>${esc(i.text).replace(/（(.*)）/, '<span class="nw">（$1）</span>')}</span></li>`).join('')}</ul></div>`;
}

// ---------- 吊牌 ----------
// 版型參考電通識別證：上方照片、下方深藍斜切、白色三角內 dentsu 字樣、最下方品牌 Logo
// 照片用《決策智慧 2026》封面的素描人像（你）；AI 分身用封面的點陣字元人像
function logoHTML(b, cls = 'logo') {
  return b.logo
    ? `<img class="${cls}" src="img/logos/${b.logo}" alt="${esc(b.name)} Logo">`
    : `<span class="${cls} logo-text">${esc(b.logoText || b.name)}</span>`;
}

function badgeHTML(b, role, avatar, { rolling = false } = {}) {
  return `
    <div class="badge-wrap${rolling ? ' rolling' : ''}">
      <div class="lanyard" aria-hidden="true"></div>
      <div class="badge" role="img" aria-label="${rolling ? '識別證製作中' : `識別證：${esc(b.name)}・${esc(role)}`}">
        <div class="badge-photo" id="badge-photo">${avatarSVG(avatar)}</div>
        <div class="badge-low">
          <img class="badge-dentsu" src="img/logos/dentsu-gray.png" alt="">
          <p class="badge-name">New Hire</p>
          <p class="badge-role" id="badge-role">${rolling ? '……' : esc(role)}</p>
          <div class="badge-logo" id="badge-logo">${logoHTML(b)}</div>
        </div>
      </div>
    </div>`;
}

function renderSide() {
  if (!S || !S.brand) { $side.hidden = true; return; }
  $side.hidden = false;
  const rows = S.cohort.map((c) => `<li><span class="face">${avatarSVG(c.avatar)}</span>
      <span class="txt"><span class="who">${esc(c.name)}｜${esc(c.brand)}・${esc(c.role)}</span>
      <span class="what">${esc(c.status)}</span></span></li>`).join('');
  $side.innerHTML = `
    <div class="mini-badge">
      <div class="mini-logo">${logoHTML(S.brand)}</div>
      <p><b>你</b>｜${esc(S.roleTitle)}<br><span>${esc(S.rank)}</span></p>
    </div>
    <div class="hex-box">
      <h2>你的 AI 時代能力</h2>
      ${hexSVG(S.stats, { size: 230 })}
      <p class="meta">每一個選擇都會調整它，<br>結局由你的決定。</p>
      ${promoBox()}
    </div>
    <div class="twin">
      <h2>你的 AI 分身正在觀察你</h2>
      <div class="twin-img">${avatarSVG(S.avatar, { mode: 'dots', label: '你的 AI 分身：用圓點拼成的同一張臉' })}</div>
      <p class="twin-say">${fmt(S.twinSay || (S.twinLog.length ? `猜中 ${S.twinHits}／${S.twinTotal} 題` : '它在猜，你下一步會怎麼選。'))}</p>
      ${S.twinLog.length ? `<ol class="twin-log">${S.twinLog.map((r) => `<li class="${r.hit === null ? 'skip' : r.hit ? 'hit' : 'miss'}">
        <b>第 ${r.step} 題｜${esc(STEPS[r.step - 1])}</b>
        <span>猜：${esc(r.guess)}<br>你：${esc(r.you)}</span><em>${r.hit === null ? '不猜' : r.hit ? '猜中' : '沒猜中'}</em></li>`).join('')}</ol>` : ''}
      <p class="twin-what">People Model 模擬。<br>每一關先猜你的選擇，<br>等你決定後再對答案。</p>
    </div>
    <div class="cohort-box">
      <h3>同一天報到的同梯<small>（模擬）</small></h3>
      <ul class="cohort">${rows}</ul>
    </div>`;
  keepNames($side);
}

// ---------- 遊戲內的閱讀面板 ----------
// 點篇名不離開遊戲：右側滑出全文（手機為全螢幕），讀完問「有沒有幫助」，記錄下來在結局揭曉
const $drawer = document.getElementById('drawer');
let lastFocus = null;

function stepName(step) {
  if (step === -1) return '報到通知';
  return step >= 1 && step <= STEPS.length ? STEPS[step - 1] : step === 0 ? '報到' : '結局';
}

async function openReader(id, q) {
  lastFocus = document.activeElement;
  const p = await articleParts(id, q);
  const inGame = Boolean(S);
  const step = inGame ? (S.curStep ?? 0) : -1;
  const read = { id, step, helpful: null, then: '' };
  if (inGame) { S.reads.push(read); S.met.add(id); }
  $drawer.dataset.ch = p.meta.chapter;
  $drawer.innerHTML = `
    <div class="drawer-backdrop" data-close></div>
    <section class="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="dr-title">
      <div class="drawer-bar">
        <button class="btn" type="button" data-close>← ${inGame ? `回到遊戲（${esc(stepName(step))}）` : '回到報到通知'}</button>
        <div class="drawer-which"><b>${esc(p.meta.title)}</b><span>${esc(p.meta.author)}・《決策智慧 2026》p.${esc(p.meta.pages)}</span></div>
        <a class="drawer-full" href="read.html?id=${id}" target="_blank" rel="noopener">完整版面 ↗</a>
      </div>
      <header class="opener drawer-opener">${p.opener.replace('<h1>', '<h1 id="dr-title">')}</header>
      <div class="pages">
        ${p.head}
        ${p.toc}
        ${p.body}
        ${p.notes}
        ${inGame ? '' : '<div class="row"><button class="btn primary" type="button" data-close>回到報到通知</button></div>'}
        <div class="feedback" id="feedback"${inGame ? '' : ' hidden'}>
          <p class="fb-q">這篇文章，<br>有幫助你面對剛剛的處境嗎？</p>
          <div class="row">
            <button class="btn" type="button" data-help="yes">有幫助</button>
            <button class="btn" type="button" data-help="no">沒有</button>
          </div>
        </div>
      </div>
    </section>`;
  keepNames($drawer);
  $drawer.hidden = false;
  document.body.classList.add('drawer-open');
  const panel = $drawer.querySelector('.drawer-panel');
  const hit = $drawer.querySelector('.hit');
  panel.scrollTop = 0;
  if (hit) requestAnimationFrame(() => hit.scrollIntoView({ block: 'center' }));
  $drawer.querySelector('[data-close]').focus({ preventScroll: true });
  $drawer.querySelectorAll('[data-close]').forEach((b) => { b.onclick = closeReader; });
  $drawer.querySelectorAll('[data-jump]').forEach((a) => {
    a.onclick = (e) => { e.preventDefault(); $drawer.querySelector(`#${a.dataset.jump}`).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); };
  });
  $drawer.querySelectorAll('[data-help]').forEach((b) => {
    b.onclick = () => {
      read.helpful = b.dataset.help === 'yes';
      document.getElementById('feedback').innerHTML = `
        <p class="fb-q">${read.helpful ? '記下了：這篇有幫到你。' : '記下了：這篇沒有幫到你。'}<br>結局時，你會看到它和你的選擇有沒有關係。</p>
        <button class="btn primary" type="button" data-close>回到遊戲（${esc(stepName(step))}）</button>`;
      document.querySelector('#feedback [data-close]').onclick = closeReader;
      document.querySelector('#feedback [data-close]').focus();
    };
  });
}

function closeReader() {
  $drawer.hidden = true;
  $drawer.innerHTML = '';
  document.body.classList.remove('drawer-open');
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$drawer.hidden) closeReader(); });
document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('a.to-article');
  if (!a || a.closest('#drawer')) return;
  e.preventDefault();
  const u = new URL(a.href, location.href);
  openReader(u.searchParams.get('id'), u.searchParams.get('q') || '');
});

// 決定做完後，把這一關讀過的文章和你的選擇連起來
function afterDecision(step, text) {
  for (const r of S.reads) if (r.step === step && !r.then) r.then = text;
}

function readsSummary() {
  if (!S.reads.length) {
    return '<p class="meta">這一輪你沒有打開文章。<br>下一輪，被哪句話打到時，點篇名就能直接讀。</p>';
  }
  const seen = new Set();
  const rows = S.reads.filter((r) => { const k = `${r.id}-${r.step}`; if (seen.has(k)) return false; seen.add(k); return true; })
    .map((r) => {
      const a = ARTICLES[r.id];
      const help = r.helpful === true ? '你覺得有幫助' : r.helpful === false ? '你覺得沒有幫助' : '你沒有回答';
      const then = r.then ? `，接著你選了「${esc(r.then)}」` : '';
      return `<li><b>${esc(stepName(r.step))}</b>你讀了${artLink(r.id)}，${help}${then}。</li>`;
    }).join('');
  const yes = S.reads.filter((r) => r.helpful === true).length;
  return `<ol class="reads">${rows}</ol><p class="meta">你在路上打開了 ${S.reads.length} 次文章，其中 ${yes} 次覺得有幫助。</p>`;
}

// ---------- 畫面 ----------
function setScene(scene) {
  document.body.classList.remove('home', 'world', 'opening');
  document.body.classList.add(scene);
}

function intro() {
  S = null;
  $side.hidden = true;
  setScene('home');
  render(`
    <section class="home-hero">
      <div class="home-copy">
        <p class="kicker">決策智慧 2026｜Agentic Era：重塑品牌與人的真實距離</p>
        <h1 class="zh-title">降落在電通，<br>讀懂《決策智慧》</h1>
        <span class="bar"></span>
        <p class="lead">翻開這本書，換個職務讀它。</p>
        <p>你會被隨機分發到集團裡的一間公司、一個職務，<br>從報到第一天走到離開，或升上老闆。<br>一路上 AI 會幫你，<br>但每個決定，都由你來做。</p>
        <p>你在路上遇到的每一個難題，<br>都出自這本書裡 22 篇文章的作者。</p>
        <p class="meta">約 2–3 分鐘・每一關都能展開刊物原文</p>
        <div class="row"><button class="btn primary" id="go">翻開書，報到</button></div>
        <p class="from">內容取材自電通《決策智慧 2026：Agentic 時代，重塑品牌與人的真實距離》</p>
      </div>
      <div class="book">
        <figure>
          <div class="book-inside" aria-hidden="true"><img src="img/ascii.jpg" alt=""><span class="bar"></span><p>降落在電通</p></div>
          <div class="book-cover"><img src="img/cover.jpg" alt="《決策智慧 2026》封面：素描人像與點陣人像左右並置，下方是彩色的「決策智慧」四字" width="1100" height="1517"></div>
          <figcaption class="book-caption">《決策智慧 2026》封面</figcaption>
        </figure>
      </div>
    </section>`, 'people', { bar: false });
  document.getElementById('go').onclick = notice;
}

// 報到通知：翻開書之前，先告訴玩家會有 AI 分身跟著、為什麼、出自書裡哪一篇
function notice() {
  const avatar = makeAvatar();
  const T = TWIN_INTRO;
  const cite = (q) => `${esc(ARTICLES[q.article].author)}${artLink(q.article, q.text)}p.${esc(q.page)}`;
  const wrap = document.createElement('div');
  wrap.className = 'notice-backdrop';
  wrap.innerHTML = `
    <div class="notice" role="dialog" aria-modal="true" aria-labelledby="notice-t">
      <p class="kicker">報到通知｜<span id="notice-step">1／2</span></p>
      <section class="nt-page" id="nt1">
        <h2 id="notice-t">你不會一個人報到</h2>
        <span class="bar" aria-hidden="true"></span>
        <div class="twin-pair">
          <figure><div class="tp-face">${avatarSVG(avatar, { label: '你' })}</div><figcaption>你</figcaption></figure>
          <span class="tp-arrow" aria-hidden="true">→</span>
          <figure><div class="tp-face">${avatarSVG(avatar, { mode: 'dots', label: '你的 AI 分身' })}</div><figcaption>你的 AI 分身</figcaption></figure>
        </div>
        <p>報到之後，會有一個 <b>AI 分身</b>跟著你。<br>它每一關都會先猜你會怎麼選，<br>等你決定後再對答案。<br>它只知道你被分到的公司和職務，就靠這些來猜。</p>
        <h3>為什麼要有它？</h3>
        <p>它來自這本書的特別企劃 <b>People Model</b>：</p>
        <blockquote class="bridge small">「${fmt(T.q1.text)}」</blockquote>
        <p class="cite">— ${cite(T.q1)}</p>
        <p>但 AI 真的能懂「你」嗎？<br>玩到最後，你會知道它猜中了幾次。</p>
      </section>
      <section class="nt-page" id="nt2" hidden>
        <h2>你的 AI 時代能力六邊形</h2>
        <span class="bar" aria-hidden="true"></span>
        <p class="nt-key">你的每一個選擇，都會調整這個六邊形。<br>升上老闆或離開，都由你的決定。</p>
        ${hexSVG(freshStats(), { size: 210, title: '起始的六邊形，六項能力都是 40' })}
        <ul class="skill-cards">${SKILLS.map((k) => `<li><b>${k.name}</b><span>${k.desc}</span></li>`).join('')}</ul>
        <h3>怎麼變化？</h3>
        <ul class="nt-rules">
          <li>自己拿主意 → <span class="dl up">衡斷力 +</span></li>
          <li>全部交給 AI → <span class="dl up">AI 駕馭力 +</span><span class="dl down">感知力 −</span></li>
        </ul>
        <details class="nt-src"><summary>這六項能力從哪裡來？</summary>
          <p>依《決策智慧 2026》各篇整理：</p>
          <ul>${SKILLS.map((k) => `<li><b>${k.name}</b>${esc(k.src)}${artLink(k.article)}</li>`).join('')}</ul>
        </details>
      </section>
      <div class="nt-foot"><button class="btn primary" id="ok">下一步：你的 AI 時代能力</button></div>
    </div>`;
  keepNames(wrap);
  document.body.appendChild(wrap);
  const ok = wrap.querySelector('#ok');
  const panel = wrap.querySelector('.notice');
  panel.scrollTop = 0;
  ok.focus({ preventScroll: true });
  wrap.addEventListener('keydown', (e) => { if (e.key === 'Tab') { e.preventDefault(); ok.focus(); } });
  let page = 1;
  ok.onclick = () => {
    if (page === 1) {
      page = 2;
      wrap.querySelector('#nt1').hidden = true;
      wrap.querySelector('#nt2').hidden = false;
      wrap.querySelector('#notice-step').textContent = '2／2';
      wrap.querySelector('.nt-page:not([hidden]) h2').id = 'notice-t';
      ok.textContent = '明白了，繼續閱讀';
      panel.scrollTop = 0;
      return;
    }
    wrap.remove();
    // 翻開封面 → 被吸進書裡 → 落進電通的灰色世界
    document.body.classList.add('opening');
    setTimeout(() => { setScene('world'); draw(avatar); }, reduceMotion ? 0 : 1900);
  };
}

function draw(avatar) {
  const brand = pickBrand();
  const [roleTitle, family] = pickOne(brand.roles);
  S = {
    brand, roleTitle, f: FAMILIES[family], family,
    d: [], j: 0, opps: 0, rank: '基層', twinHits: 0, twinTotal: 0,
    met: new Set(), cohort: makeCohort(brand), wish: '', twinSay: '', avatar: avatar || makeAvatar(), peeks: 0, peeked: false, reads: [], curStep: 0, twinLog: [], stats: freshStats(), twinStats: freshStats(), lastGain: null,
  };
  $side.hidden = true;
  render(`
    <div class="reveal">
      <div class="reveal-copy">
        <p class="kicker">分發中</p>
        <h2 class="big">你的識別證正在製作……</h2>
        <p class="roll" id="roll" aria-live="polite">……</p>
      </div>
      ${badgeHTML(BRANDS[0], '', makeAvatar(), { rolling: true })}
    </div>`, 'model');
  const $roll = document.getElementById('roll');
  const $logo = document.getElementById('badge-logo');
  const $photo = document.getElementById('badge-photo');
  const finish = () => reveal();
  if (reduceMotion) return finish();
  let k = 0;
  const timer = setInterval(() => {
    const b = BRANDS[k++ % BRANDS.length];
    $roll.textContent = b.name;
    $logo.innerHTML = logoHTML(b);
    if (k % 2 === 0) $photo.innerHTML = avatarSVG(makeAvatar());
  }, 110);
  setTimeout(() => { clearInterval(timer); finish(); }, 1500);
}

function reveal() {
  const b = S.brand;
  renderSide();
  render(`
    <div class="reveal">
      <div class="reveal-copy">
        <p class="kicker">分發結果</p>
        <h2 class="big">你是 ${esc(b.name)} 的${esc(sp(S.roleTitle))}。</h2>
        <div class="card">
          <p class="card-name">${esc(b.name)}<span>${esc(b.zh)}</span></p>
          <p>${fmt(b.card, { breaks: false })}</p>
          <p class="share">這一梯，約 ${b.share}% 的人和你分到這裡。</p>
        </div>
        <p class="role"><b>職務內容</b>：<br>${fmt(S.f.does)}</p>
        <button class="btn primary" id="go">戴上識別證，走進辦公室</button>
      </div>
      ${badgeHTML(b, S.roleTitle, S.avatar)}
    </div>`, 'model');
  document.getElementById('go').onclick = wish;
}

function wish() {
  render(`
    ${timeline(0)}
    <p class="kicker">報到小卡</p>
    <h2>Day 1，你希望 AI 幫你做什麼？</h2>
    <label class="sr" for="wish">寫下一句話</label>
    <input id="wish" maxlength="40" placeholder="寫一句話，最後會還給你">
    <div class="row"><button class="btn primary" id="go">寫好了</button><button class="btn ghost" id="skip">先跳過</button></div>`);
  const next = () => {
    S.wish = document.getElementById('wish').value.trim();
    S.twinSay = S.wish ? '你寫的那句話只屬於你，我猜不到。我只能照你的公司和職務去猜。' : '';
    renderSide();
    day1();
  };
  document.getElementById('go').onclick = next;
  document.getElementById('skip').onclick = () => { document.getElementById('wish').value = ''; next(); };
}

function sliderBlock(label, aiValue) {
  return `
    <div class="decide">
      <label for="sl">${esc(label)}</label>
      <input type="range" id="sl" min="0" max="100" step="10" value="${aiValue}">
      <p class="val"><span id="slv">${aiValue / 10}</span> 成交給 AI</p>
    </div>`;
}
function bindSlider() {
  const sl = document.getElementById('sl');
  sl.oninput = () => { document.getElementById('slv').textContent = sl.value / 10; };
  return () => Number(sl.value);
}

// ---------- 五個決定 ----------
// 每個決定拆成「commit」：玩家自己按下、或交給 AI 分身代勞，都走同一套規則
const STEPS = ['Day 1', '第 1 年', '辯論庭', '第 3 年', '第 5 年'];

function timeline(step) {
  S.curStep = step;
  const items = STEPS.map((label, i) => {
    const n = i + 1;
    const cls = n < step ? (S.autoFrom && n >= S.autoFrom ? 'auto' : 'done') : n === step ? 'now' : '';
    return `<li class="${cls}"${n === step ? ' aria-current="step"' : ''}><span>${n}</span>${label}</li>`;
  }).join('');
  const note = step === 0 ? `接下來，你會遇到 ${STEPS.length} 個決定`
    : step <= STEPS.length ? `第 ${step}／${STEPS.length} 個決定` : '五個決定都完成了';
  const delta = S.lastGain && step > 1 ? `<p class="deltas" aria-label="上一題的能力變化">上一題：${gainText(S.lastGain)}</p>` : '';
  return `<nav class="timeline" aria-label="職涯進度：${note}"><ol>${items}</ol><p>${note}</p></nav>${delta}`;
}

// 偷看 AI 分身的想法：預設隱藏，按下才顯示；有沒有偷看會影響「是不是你自己的判斷」
function peekBlock(text) {
  S.peeked = false;
  return `<div class="peek"><button class="btn peek-btn" id="peek" type="button" aria-expanded="false">偷看 AI 分身的想法</button>
    <p class="peek-text" id="peek-text" hidden>${avatarSVG(S.avatar, { mode: 'dots' })}<span>分身的想法：<b>${esc(text)}</b></span></p></div>`;
}
function bindPeek() {
  const b = document.getElementById('peek');
  b.onclick = () => {
    if (!S.peeked) { S.peeked = true; S.peeks += 1; }
    document.getElementById('peek-text').hidden = false;
    b.setAttribute('aria-expanded', 'true'); b.disabled = true; b.textContent = '你偷看了分身的想法';
  };
}
// 自己的判斷＝沒偷看就決定，或偷看了但沒照它的想法走
const ownCall = (followed, auto) => !auto && (!S.peeked || !followed);

function takeoverBtn() {
  return '<button class="btn takeover" id="auto" type="button">從現在起交給 AI 分身處理</button>';
}
function bindTakeover(step) {
  document.getElementById('auto').onclick = () => autopilot(step);
}

function twinYear3Hours(y) {
  const aiH = Math.round(S.f.twin / 10);
  const base = y.ai.slice(1); const sum = base.reduce((a, b) => a + b, 0);
  const rest = base.map((b) => Math.floor((b / sum) * (10 - aiH)));
  let left = 10 - aiH - rest.reduce((a, b) => a + b, 0);
  for (let k = 0; left > 0; k = (k + 1) % rest.length, left -= 1) rest[k] += 1;
  return [aiH, ...rest];
}

function commitDay1(v, auto = false) {
  const f = S.f;
  S.d.push(v);
  const near = Math.abs(v - f.twin) <= 15;
  const own = ownCall(near, auto);
  judgment(own);
  gain(RULES.day1(v, own), RULES.day1(f.twin, false));
  if (!auto) { twin(near); logTwin(1, `${f.twin / 10} 成`, `${v / 10} 成`, near); }
  advanceCohort('day1');
  return `交給 AI ${v / 10} 成`;
}
// 內部職務（HQ、DSC 系統派）的第 1 年與時間分配用內部版本
const isInternal = () => INTERNAL_FAMILIES.includes(S.family);
const y1 = () => (isInternal() ? YEAR1_INTERNAL : YEAR1);
const twin1 = (y) => (S.f.twin >= 50 ? y.twinHigh : y.twinLow);
const y3buckets = (y) => (isInternal() ? y.buckets.map((b) => (b === '陪客戶' ? '支援前線同事' : b)) : y.buckets);

function commitYear1(key, auto = false) {
  const y = y1(); const o = y.options.find((x) => x.key === key);
  S.d.push(o.delegate);
  const tp = twin1(y);
  const own = ownCall(tp === key, auto);
  judgment(own);
  gain(RULES.year1(key, own), RULES.year1(tp, false));
  if (!auto) { twin(tp === key); logTwin(2, y.options.find((x) => x.key === tp).label, o.label, tp === key); }
  if (promotable()) S.rank = '中階主管';
  advanceCohort('year1');
  return o.label;
}
function commitDebate(k, auto = false) {
  S.debatePick = k;
  const D = DEBATES[S.brand.debate];
  if (!auto) logTwin(3, '這題沒有對錯，我不猜', (k === 'a' ? D.a : D.b).who, null);
  gain(RULES.debate(k), RULES.debate('a'));
  return `站在${sp((k === 'a' ? D.a : D.b).who)}這一邊`;
}
function commitYear3(hours, auto = false) {
  const y = S.rank === '中階主管' ? YEAR3.mid : YEAR3.base;
  S.d.push(hours[0] * 10);
  const th = twinYear3Hours(y);
  const diff = hours.reduce((s2, h, i) => s2 + Math.abs(h - th[i]), 0);
  const own = ownCall(diff < 4, auto);
  judgment(own);
  gain(RULES.year3(hours, S.rank === '中階主管', own), RULES.year3(th, S.rank === '中階主管', false));
  if (!auto) {
    const ok = Math.abs(hours[0] - th[0]) <= 2;
    twin(ok); logTwin(4, `AI ${th[0]} 小時`, `AI ${hours[0]} 小時`, ok);
  }
  if (S.rank === '中階主管' ? promotable(2) : promotable(1)) S.rank = S.rank === '中階主管' ? '大家長' : '中階主管';
  advanceCohort('year3');
  return `${y.buckets[0]} ${hours[0]} 小時，其餘 ${10 - hours[0]} 小時分給其他事`;
}
function commitYear5(key, auto = false) {
  const y = S.rank === '大家長' ? YEAR5.leader : YEAR5.other;
  S.y5 = key;
  const tp = S.f.twin >= 50 ? y.twinHigh : y.twinLow;
  const own = ownCall(tp === key, auto);
  judgment(own);
  gain(RULES.year5(key, own), RULES.year5(tp, false));
  if (!auto) { twin(tp === key); logTwin(5, y.options.find((o) => o.key === tp).label, y.options.find((o) => o.key === key).label, tp === key); }
  advanceCohort('year5');
  return y.options.find((o) => o.key === key).label;
}

// 分身的逐題預測紀錄（顯示在側欄）
function logTwin(step, guess, you, hit) {
  S.twinLog.push({ step, guess, you, hit });
  S.twinSay = '';
}

// 交給 AI 分身：剩下的決定全部依分身的預測走完
function autopilot(step) {
  S.autoFrom = step;
  const log = [];
  const f = S.f;
  if (step <= 1) log.push(['Day 1', commitDay1(f.twin, true)]);
  if (step <= 2) log.push(['第 1 年', commitYear1(twin1(y1()), true)]);
  if (step <= 3) log.push(['辯論庭', commitDebate('a', true)]);
  if (step <= 4) {
    const y = S.rank === '中階主管' ? YEAR3.mid : YEAR3.base;
    log.push(['第 3 年', commitYear3(twinYear3Hours(y), true)]);
  }
  const y5 = S.rank === '大家長' ? YEAR5.leader : YEAR5.other;
  const y5pick = f.twin >= 50 ? y5.twinHigh : y5.twinLow;
  log.push(['第 5 年', commitYear5(y5pick, true)]);
  S.twinSay = '剩下的路，我替你走完了。';
  renderSide();
  render(`
    ${timeline(6)}
    <p class="kicker">你把決定交給了 AI 分身</p>
    <h2>它替你走完了剩下的職涯</h2>
    <p>從「${STEPS[step - 1]}」開始，<br>每一個決定都由你的 AI 分身代勞。</p>
    <ol class="auto-log">${log.map(([k, v]) => `<li><b>${esc(k)}</b>${esc(v)}</li>`).join('')}</ol>
    <p class="meta">它做的每個選擇，<br>都是照你的公司和職務推測出來的。</p>
    <button class="btn primary" id="go">看看結局</button>`, 'ai');
  document.getElementById('go').onclick = ending;
}

function day1() {
  const f = S.f;
  render(`
    ${timeline(1)}
    <p class="kicker">Day 1｜${esc(S.brand.name)}・${esc(S.roleTitle)}</p>
    <h2>第一天的任務</h2>
    <p class="task">${fmt(f.task)}</p>
    ${quoteBlock(f.quote)}
    ${sliderBlock(f.slider, 50)}
    ${peekBlock(`交給 AI ${f.twin / 10} 成`)}
    <div class="row"><button class="btn primary" id="go">就這樣決定</button>${takeoverBtn()}</div>`);
  const get = bindSlider();
  bindPeek();
  bindTakeover(1);
  document.getElementById('go').onclick = () => { afterDecision(1, commitDay1(get())); year1(); };
}

function year1() {
  const y = y1();
  render(`
    ${timeline(2)}
    <p class="kicker">全集團的時刻</p>
    <h2>${esc(y.title)}</h2>
    <p class="task">${fmt(y.body)}</p>
    ${quoteBlock(y.quote)}
    ${y.quote2 ? quoteBlock(y.quote2, '但原文也說') : ''}
    ${peekBlock(y.options.find((o) => o.key === twin1(y)).label)}
    <div class="choices">${y.options.map((o) => `<button class="btn choice" data-k="${o.key}">${esc(o.label)}</button>`).join('')}</div>
    <div class="row">${takeoverBtn()}</div>`, 'model');
  bindTakeover(2);
  bindPeek();
  $stage.querySelectorAll('.choice').forEach((btn) => {
    btn.onclick = () => { afterDecision(2, commitYear1(btn.dataset.k)); debate(); };
  });
}

function debate() {
  const D = DEBATES[S.brand.debate];
  const side = (x, k) => {
    if (x.article) S.met.add(x.article);
    const a = x.article ? ARTICLES[x.article] : null;
    const cite = a ? `${esc(x.who)}〈${esc(a.short)}〉p.${esc(x.page)}` : esc(x.who); // 卡片本身是按鈕，連結放在裁決後
    return `<button class="debate-card" data-k="${k}"><span class="q">「${fmt(x.text, { breaks: false })}」</span><span class="cite">— ${cite}</span></button>`;
  };
  render(`
    ${timeline(3)}
    <p class="kicker">辯論庭｜沒有對錯，只有你的判斷</p>
    <h2>${esc(D.q)}<br>你站哪邊？</h2>
    <p>兩位作者都在《決策智慧 2026》裡，<br>各自說了一段話。</p>
    <div class="debate">${side(D.a, 'a')}${side(D.b, 'b')}</div>
    <div class="row">${takeoverBtn()}</div>`, 'ai');
  bindTakeover(3);
  $stage.querySelectorAll('.debate-card').forEach((btn) => {
    btn.onclick = () => {
      afterDecision(3, commitDebate(btn.dataset.k));
      const k = btn.dataset.k;
      const mine = k === 'a' ? D.a : D.b;
      const other = k === 'a' ? D.b : D.a;
      const more = DEBATE_MORE[S.brand.debate][k === 'a' ? 'b' : 'a'];
      [mine, more].forEach((x) => x.article && S.met.add(x.article));
      const cite = (x) => (x.article ? `${esc(x.who)}${artLink(x.article, x.text)}p.${esc(x.page)}` : esc(x.who));
      render(`
        ${timeline(3)}
        <p class="kicker">辯論庭｜你的裁決</p>
        <h2>你站在${esc(sp(mine.who))}這邊</h2>
        <div class="verdict mine"><p class="v-label">你選的這段話</p>
          <blockquote>「${fmt(mine.text)}」</blockquote><p class="cite">— ${cite(mine)}</p></div>
        <div class="verdict other"><p class="v-label">但另一邊也有話要說</p>
          <blockquote>「${fmt(more.text)}」</blockquote><p class="cite">— ${cite(more)}</p></div>
        <p>這題沒有對錯。<br>兩邊都讀過，你的判斷會更清楚。</p>
        <p class="read-both">${[mine, other].filter((x) => x.article).map((x) => `讀${esc(sp(x.who))}的原文：${artLink(x.article, x.text)}`).join('<br>')}</p>
        <p class="meta">你的裁決不影響升遷，只會影響最後推薦你讀的文章。</p>
        <button class="btn primary" id="go">繼續</button>`, 'ai');
      document.getElementById('go').onclick = year3;
    };
  });
}

function year3() {
  const y = S.rank === '中階主管' ? YEAR3.mid : YEAR3.base;
  const hours = [3, 3, 2, 2];
  const th = twinYear3Hours(y);
  const rows = () => y3buckets(y).map((b, i) => `
    <div class="alloc-row"><span>${esc(b)}</span>
      <button class="btn mini" data-i="${i}" data-d="-1" aria-label="${esc(b)}減少一小時">−</button>
      <b id="h${i}">${hours[i]}</b>
      <button class="btn mini" data-i="${i}" data-d="1" aria-label="${esc(b)}增加一小時">＋</button></div>`).join('');
  render(`
    ${timeline(4)}
    <p class="kicker">第 3 年｜${esc(S.rank)}</p>
    <h2>${esc(y.title)}</h2>
    <p class="task">${fmt(y.lead)}<br>${fmt(YEAR3_FAMILY[S.family].body)}</p>
    <p>這週你有 10 小時可以分配。</p>
    ${quoteBlock(YEAR3_FAMILY[S.family].quote)}
    ${peekBlock(y3buckets(y).map((b, i) => `${b} ${th[i]}`).join('、') + ' 小時')}
    <div class="alloc">${rows()}</div>
    <p class="val">還剩 <b id="left">0</b> 小時</p>
    <div class="row"><button class="btn primary" id="go">就這樣分配</button>${takeoverBtn()}</div>`, 'people');
  bindTakeover(4);
  bindPeek();
  const left = () => 10 - hours.reduce((a, b) => a + b, 0);
  const sync = () => {
    hours.forEach((h, i) => { document.getElementById(`h${i}`).textContent = h; });
    document.getElementById('left').textContent = left();
    document.getElementById('go').disabled = left() !== 0;
  };
  $stage.querySelectorAll('.mini').forEach((btn) => {
    btn.onclick = () => {
      const i = Number(btn.dataset.i); const d = Number(btn.dataset.d);
      if (d > 0 && left() <= 0) return;
      hours[i] = Math.max(0, hours[i] + d);
      sync();
    };
  });
  sync();
  document.getElementById('go').onclick = () => { afterDecision(4, commitYear3(hours)); year5(); };
}

function year5() {
  const y = S.rank === '大家長' ? YEAR5.leader : YEAR5.other;
  const extra = S.rank === '大家長' ? '' : `<p class="meta">你目前的職級：${esc(S.rank)}</p>`;
  render(`
    ${timeline(5)}
    <p class="kicker">第 5 年</p>
    <h2>${esc(y.title)}</h2>
    <p class="task">${fmt(y.body)}</p>${extra}
    ${peekBlock(y.options.find((o) => o.key === (S.f.twin >= 50 ? y.twinHigh : y.twinLow)).label)}
    <div class="choices">${y.options.map((o) => `<button class="btn choice" data-k="${o.key}">${esc(o.label)}</button>`).join('')}</div>
    <div class="row">${takeoverBtn()}</div>`, 'model');
  bindTakeover(5);
  bindPeek();
  $stage.querySelectorAll('.choice').forEach((btn) => {
    btn.onclick = () => { afterDecision(5, commitYear5(btn.dataset.k)); ending(); };
  });
}

function ending() {
  const d = Math.round(avg(S.d));
  // 幾乎都照 AI 建議走、又大量交給 AI → 被取代；幾乎不用 AI → 跟不上
  const followRatio = S.opps ? S.j / S.opps : 0;
  const st = S.stats;
  const key = S.rank === '大家長' ? 'boss'
    : st.ai >= 55 && (st.judge < 42 || st.sense < 30) ? 'replaced'
    : st.ai < 32 ? 'behind'
    : S.y5 === 'stay' ? 'stay' : 'ownway';
  const low = SKILLS.reduce((a, b) => (st[a.key] <= st[b.key] ? a : b));
  const high = SKILLS.reduce((a, b) => (st[a.key] >= st[b.key] ? a : b));
  const why = {
    boss: `六項能力都沒有短板，衡斷力 ${st.judge}。`,
    replaced: `AI 駕馭力 ${st.ai}，但衡斷力只有 ${st.judge}、感知力 ${st.sense}。`,
    behind: `AI 駕馭力只有 ${st.ai}，跟不上身邊的變化。`,
    stay: `你最強的是${high.name}（${st[high.key]}），最需要補的是${low.name}（${st[low.key]}）。`,
    ownway: `你最強的是${high.name}（${st[high.key]}），最需要補的是${low.name}（${st[low.key]}）。`,
  }[key];
  const E = ENDINGS[key];
  S.met.add(E.quote.article);
  S.twinSay = `我猜中了你 ${S.twinHits}／${S.twinTotal} 題。${S.wish ? '但你 Day 1 寫的那句話，我到最後都猜不透。' : '剩下的，是我算不出來的你。'}`;
  renderSide();

  const D = DEBATES[S.brand.debate];
  const mine = S.debatePick === 'a' ? D.a : D.b;
  const other = S.debatePick === 'a' ? D.b : D.a;
  // 推薦 3 篇：你公司的文章、你選的一方、你沒選的一方；不足時以公司其他文章與開篇文補滿
  const recIds = [...new Set([S.brand.articles[0], mine.article, other.article, ...S.brand.articles.slice(1), 'a02', 'a01']
    .filter(Boolean))].slice(0, 3);
  const recs = recIds.map((id) => {
    const a = ARTICLES[id];
    const why = id === S.brand.articles[0] ? '你公司的作者寫的'
      : id === mine.article ? '你在辯論庭站的那一方'
      : id === other.article ? '你沒選的那一方'
      : S.brand.articles.includes(id) ? '你公司的作者寫的' : '全書的開篇';
    return `<li><a class="to-article" href="read.html?id=${id}" target="_blank" rel="noopener"><b>${esc(a.title)}</b></a><br><span>${esc(a.author)}・p.${esc(a.pages)}・${why}</span></li>`;
  }).join('');

  const gap = key === 'boss' ? `
    <div class="gap">
      <p>${S.y5 === 'announce' ? '你對外宣布：轉型很成功。' : '你先去聽了基層的聲音。'}</p>
      <p>但你同梯裡，還有人留在原本的位置。<br>他們的感受，和你一樣嗎？</p>
      <blockquote>「${fmt(GAP19.text)}」</blockquote>
      <p class="cite">— ${esc(ARTICLES[GAP19.article].author)}${artLink(GAP19.article, GAP19.text)}p.${GAP19.page}</p>
    </div>` : '';
  S.met.add(GAP19.article);

  const cohort = S.cohort.map((c) => `<li>${esc(c.name)}（${esc(c.brand)}）：${esc(c.out)}</li>`).join('');
  render(`
    <p class="kicker">你的職涯總結</p>
    <h2 class="big">${esc(E.title)}</h2>
    <p>${esc(S.brand.name)}・${esc(S.roleTitle)} → ${esc(S.rank)}</p>
    <div class="disclaimer" role="note">
      <p class="dc-label">免責聲明</p>
      <p>這是一場模擬。結局是為了呈現《決策智慧 2026》書中的觀點而設計，<br>不代表任何人真實的職涯發展或能力評價，也不代表電通集團的人事政策。<br>「被 AI 取代」「跟不上」都是放大的說法，用來提醒判斷的重要，不是預測。</p>
    </div>
    <div class="hex-end">
      ${hexSVG(st, { ghost: S.twinStats, size: 300, title: '你的 AI 時代能力（實線）與 AI 分身猜的你（虛線）' })}
      <div><h3>為什麼是這個結局？</h3><p>${esc(why)}</p>
        <p class="meta"><span class="key you"></span>實線：你<br><span class="key ghost"></span>虛線：AI 分身照它的預測走出來的你</p></div>
    </div>
    ${S.autoFrom ? `<p class="auto-note">從「${STEPS[S.autoFrom - 1]}」開始，你把決定交給了 AI 分身。</p>` : ''}
    <blockquote class="bridge">「${fmt(E.quote.text)}」</blockquote>
    <p class="cite">— ${esc(ARTICLES[E.quote.article].author)}${artLink(E.quote.article, E.quote.text)}p.${esc(E.quote.page)}</p>
    ${gap}
    <div class="summary">
      ${S.wish ? `<p class="wish-back">Day 1 的你說：「${esc(S.wish)}」</p>` : ''}
      <p>${S.wish ? '五年後，' : ''}你平均把 <b>${(d / 10).toFixed(1)}</b> 成的工作交給 AI。<br>${S.peeks ? `你偷看了分身的想法 <b>${S.peeks}</b> 次；` : '你一次都沒偷看分身的想法；'}<br>${S.opps} 個決定裡，有 <b>${S.j}</b> 次是你自己拿主意。</p>
      <h3>你的 AI 分身</h3>
      <p>${S.twinTotal ? `它猜中了你 <b>${S.twinHits}／${S.twinTotal}</b> 題。<br>` : ''}它只知道你被分到哪間公司、什麼職務，<br>就照這些去猜你會怎麼選。</p>
      ${S.wish ? '<p>但你 Day 1 寫的那句話只屬於你，<br>它猜不到。</p>' : ''}
      <p class="cite">「${esc(TWIN_LIMIT.text)}」— People Model 團隊 p.${TWIN_LIMIT.page}</p>
      <h3>同梯們後來</h3><ul>${cohort}</ul>
    </div>
    <h3>你在路上讀過的文章</h3>
    ${readsSummary()}
    <h3>這一生，推薦你讀</h3>
    <ol class="recs">${recs}</ol>
    <p class="meta">這一輪你遇見了 ${S.met.size}／22 篇文章。換一間公司，會遇到不同的篇章。</p>
    <div class="row"><button class="btn primary" id="again">再降落一次</button>
      <button class="btn" id="home">回到書的封面</button>
      <a class="btn" href="read.html" target="_blank" rel="noopener">進入書房，讀全部 22 篇</a></div>`, 'people');
  document.getElementById('again').onclick = () => draw();
  document.getElementById('home').onclick = intro;
}

intro();

// 六邊形：AI 時代的六項能力
// 依《決策智慧 2026》各篇整理（書中沒有這個框架，是我們綜合 4–5 篇文章的整理），每一項都附出處
export const SKILLS = [
  { key: 'sense', name: '感知力', desc: '察覺變化與機會', article: 'a14',
    src: '強義明：Sense 感知與洞察' },
  { key: 'connect', name: '連結力', desc: '把各種專業串起來', article: 'a14',
    src: '強義明：Connect 創造與聯結' },
  { key: 'judge', name: '衡斷力', desc: '判斷方向，為結果負責', article: 'a14',
    src: '強義明：Judge 判斷與決策' },
  { key: 'insight', name: '人性洞察', desc: '看懂數據背後的人', article: 'a05',
    src: '朱芳儀：數據可以精準，人性洞察才能破局' },
  { key: 'trust', name: '信任力', desc: '讓人願意相信你', article: 'a06',
    src: '楊欣怡：公關的下一個角色是信任工程師' },
  { key: 'ai', name: 'AI 駕馭力', desc: '知道什麼該交給 AI', article: 'a20',
    src: '潘其偉：把 AI 的生成力升級為交付力' },
];
export const START = 40;

export function freshStats() {
  return Object.fromEntries(SKILLS.map((s) => [s.key, START]));
}

export function applyGain(stats, gain) {
  for (const [k, v] of Object.entries(gain)) {
    if (!v) continue;
    stats[k] = Math.max(0, Math.min(100, stats[k] + v));
  }
}

// 每一題的能力變化規則（玩家與 AI 分身共用）
export const RULES = {
  day1: (v, own) => ({
    judge: own ? 10 : -8,
    ai: v < 20 ? -8 : v > 80 ? 6 : 10,
    sense: v > 80 ? -12 : v <= 60 ? 6 : 0,
  }),
  year1: (key, own) => ({
    judge: own ? 8 : -6,
    ...{ model: { sense: 8, ai: 6, insight: -4 }, human: { insight: 10, sense: -2 },
      allow: { ai: 8, sense: 4, trust: -6 }, govern: { trust: 10, judge: 4, ai: -2 } }[key],
  }),
  debate: (k) => (k === 'a' ? { ai: 4, connect: 4 } : { insight: 4, trust: 4 }),
  year3: (hours, mid, own) => {
    const [h0, h1, h2, h3] = hours;
    // 陪客戶／支援前線同事：同時累積信任力與人性洞察
    const g = { ai: (h0 - 2) * 3, sense: h3 * 3 + (h0 >= 7 ? -10 : 0), trust: h2 * 3, insight: h2 * 2, judge: own ? 8 : -6 };
    if (mid) g.connect = h1 * 3; else g.judge += h1 * 2;
    return g;
  },
  year5: (key, own) => ({
    ...{ announce: { trust: -8 }, listen: { trust: 10, insight: 6, connect: 4 },
      stay: { connect: 6, trust: 4 }, jump: { sense: 6 }, startup: { judge: 6, connect: -4 } }[key],
    judge: (own ? 6 : -6) + (key === 'startup' ? 6 : 0),
  }),
};

// 六邊形 SVG：stats 為玩家，ghost 為對照（例如 AI 分身猜的你）
export function hexSVG(stats, { ghost = null, size = 220, labels = true, title = '' } = {}) {
  const c = size / 2; const R = size * (labels ? 0.32 : 0.44);
  const pt = (i, r) => {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / 6;
    return [c + r * Math.cos(a), c + r * Math.sin(a)];
  };
  const poly = (vals) => SKILLS.map((s, i) => pt(i, (R * vals[s.key]) / 100).map((n) => n.toFixed(1)).join(',')).join(' ');
  const rings = [0.25, 0.5, 0.75, 1].map((f) => `<polygon points="${SKILLS.map((_, i) => pt(i, R * f).join(',')).join(' ')}" class="hx-ring"/>`).join('');
  const spokes = SKILLS.map((_, i) => { const [x, y] = pt(i, R); return `<line x1="${c}" y1="${c}" x2="${x}" y2="${y}" class="hx-ring"/>`; }).join('');
  const lab = labels ? SKILLS.map((s, i) => {
    const [x, y] = pt(i, R + size * 0.1);
    return `<text x="${x}" y="${y}" class="hx-lab" text-anchor="middle" dominant-baseline="middle">${s.name}<tspan x="${x}" dy="1.15em" class="hx-num">${stats[s.key]}</tspan></text>`;
  }).join('') : '';
  const desc = SKILLS.map((s) => `${s.name} ${stats[s.key]}`).join('、');
  return `<svg viewBox="0 0 ${size} ${size}" class="hex" role="img" aria-label="${title || '你的 AI 時代能力六邊形'}：${desc}">
    ${rings}${spokes}
    ${ghost ? `<polygon points="${poly(ghost)}" class="hx-ghost"/>` : ''}
    <polygon points="${poly(stats)}" class="hx-you"/>
    ${lab}</svg>`;
}

export function gainText(gain) {
  return SKILLS.filter((s) => gain[s.key]).map((s) => {
    const v = gain[s.key];
    return `<span class="dl ${v > 0 ? 'up' : 'down'}">${s.name} ${v > 0 ? '+' : '−'}${Math.abs(v)}</span>`;
  }).join('');
}

// 升遷條件（顯示給玩家看，也是實際判定的規則）
export const PROMO = {
  1: { to: '中階主管', judge: 52, aiMin: 42, aiMax: 100, min: 30 },
  2: { to: '大家長', judge: 64, aiMin: 46, aiMax: 85, min: 40 },
};
export function promoCheck(stats, level) {
  const c = PROMO[level];
  const low = SKILLS.reduce((a, b) => (stats[a.key] <= stats[b.key] ? a : b));
  const items = [
    { ok: stats.judge >= c.judge, text: `衡斷力 ${c.judge} 以上（目前 ${stats.judge}）` },
    { ok: stats.ai >= c.aiMin && stats.ai <= c.aiMax, text: c.aiMax < 100 ? `AI 駕馭力 ${c.aiMin}–${c.aiMax}（目前 ${stats.ai}）` : `AI 駕馭力 ${c.aiMin} 以上（目前 ${stats.ai}）` },
    { ok: stats[low.key] >= c.min, text: `每一項都至少 ${c.min}（最低：${low.name} ${stats[low.key]}）` },
  ];
  return { to: c.to, ok: items.every((i) => i.ok), items };
}

// 背景裝飾：依 dentsu「Innovating to Impact」主視覺的語彙，用 SVG 重新繪製
// 粗圓柱（青綠、橘紅、藍紫）＋細線＋顆粒感深灰圓球，象徵彼此連結的網絡（One dentsu）

const C = { teal: '#3c9fa4', red: '#f23a12', blue: '#6871d6', pink: '#e9b2a6', violet: '#8e94c9' };

// 粗圓柱：x1,y1 → x2,y2，粗細，顏色
const PILLARS = [
  [120, -40, 175, 940, 34, 'teal'],
  [1480, -40, 1560, 380, 30, 'red'],
  [1420, 300, 1380, 940, 30, 'blue'],
];

// 細線＋端點圓球：x1,y1,x2,y2,顏色,起點球半徑,終點球半徑
const LINES = [
  [40, 150, 105, 780, 'violet', 5, 0],
  [55, 140, 230, 710, 'pink', 5, 7],
  [1190, 50, 1640, 470, 'teal', 20, 0],
  [1260, 25, 1600, 520, 'red', 9, 0],
  [1350, 240, 1300, 800, 'red', 0, 8],
  [1440, 30, 1580, 900, 'pink', 7, 0],
  [1290, 120, 1640, 380, 'teal', 13, 0],
];
const SPHERES = [
  [1505, 145, 58], [1390, 560, 36], [140, 520, 50], [110, 760, 22], [1195, 55, 20],
];

function pillar([x1, y1, x2, y2, w, c], i) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="url(#p-${c})" stroke-width="${w}" stroke-linecap="round" filter="url(#grain)"/>`;
}
function line([x1, y1, x2, y2, c, r1, r2]) {
  const s = (x, y, r) => (r ? `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#sphere)" filter="url(#grain)"/>` : '');
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C[c]}" stroke-width="2.2" opacity=".9"/>${s(x1, y1, r1)}${s(x2, y2, r2)}`;
}

export function mountDecor(el) {
  const grad = (id, col) => `<linearGradient id="p-${id}" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="${col}" stop-opacity=".75"/><stop offset=".45" stop-color="${col}"/>
      <stop offset="1" stop-color="${col}" stop-opacity=".7"/></linearGradient>`;
  el.innerHTML = `
  <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <defs>
      ${Object.entries(C).map(([k, v]) => grad(k, v)).join('')}
      <radialGradient id="sphere" cx=".38" cy=".35" r=".7">
        <stop offset="0" stop-color="#5a5a5a"/><stop offset=".6" stop-color="#303030"/><stop offset="1" stop-color="#1c1c1c"/>
      </radialGradient>
      <filter id="grain" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="7" result="n"/>
        <feColorMatrix in="n" type="saturate" values="0" result="g"/>
        <feComponentTransfer in="g" result="g2"><feFuncA type="table" tableValues="0 .35"/></feComponentTransfer>
        <feComposite in="g2" in2="SourceGraphic" operator="in" result="gc"/>
        <feBlend in="SourceGraphic" in2="gc" mode="multiply"/>
      </filter>
    </defs>
    <g class="lines">${LINES.map(line).join('')}</g>
    <g class="pillars">${PILLARS.map(pillar).join('')}</g>
    <g class="spheres">${SPHERES.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#sphere)" filter="url(#grain)"/>`).join('')}</g>
  </svg>`;
}

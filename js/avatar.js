// 隨機插畫人像：每次報到組合不同的膚色、髮型、髮色、眼鏡與衣服
// mode 'flat' 為吊牌照片；mode 'dots' 為 AI 分身（同一張臉，用圓點拼成）

const SKIN = ['#f5d7c0', '#ecbf9d', '#d9a27c', '#b47a55', '#80553a'];
const HAIR = ['#1f1a17', '#3a2a20', '#5b3b26', '#8a5c38', '#a9a39b'];
const CLOTH = ['#3c9fa4', '#f23a12', '#6871d6', '#1d2538', '#3a3d44', '#c9cdd4'];
const BG = ['#e8ecf2', '#f1ebe3', '#e4eef0', '#ecebf5', '#f3ecea'];
const HAIRSTYLES = ['short', 'side', 'bob', 'long', 'bun', 'curly', 'buzz'];

const pick = (a, r) => a[Math.floor(r() * a.length)];

export function makeAvatar(r = Math.random) {
  return {
    skin: pick(SKIN, r), hair: pick(HAIR, r), cloth: pick(CLOTH, r), bg: pick(BG, r),
    style: pick(HAIRSTYLES, r), glasses: r() < 0.3, collar: r() < 0.5,
  };
}

function hairBack(a) {
  if (a.style === 'long') return `<path d="M58 92 C54 40 156 40 152 92 L156 160 C140 168 70 168 54 160 Z" fill="${a.hair}"/>`;
  if (a.style === 'bob') return `<path d="M62 94 C56 40 154 40 148 94 L150 118 C136 122 74 122 60 118 Z" fill="${a.hair}"/>`;
  return '';
}

function hairFront(a) {
  const h = a.hair;
  switch (a.style) {
    case 'short': return `<path d="M70 80 C66 44 92 34 105 34 C126 34 145 46 140 80 C132 62 119 55 105 55 C91 55 78 62 70 80 Z" fill="${h}"/>`;
    case 'side': return `<path d="M70 82 C64 42 104 28 130 40 C142 47 144 64 140 82 C131 60 102 52 86 61 C79 65 74 72 70 82 Z" fill="${h}"/>`;
    case 'bob': return `<path d="M70 84 C66 44 92 36 105 36 C127 36 146 48 140 84 C136 64 124 58 112 57 C110 66 92 70 76 70 C73 74 71 79 70 84 Z" fill="${h}"/>`;
    case 'long': return `<path d="M71 86 C66 44 92 36 105 36 C126 36 146 48 139 86 C134 64 118 57 105 57 C94 64 80 68 71 86 Z" fill="${h}"/>`;
    case 'bun': return `<circle cx="105" cy="32" r="14" fill="${h}"/><path d="M70 80 C66 46 92 40 105 40 C124 40 145 48 140 80 C131 63 118 57 105 57 C92 57 79 63 70 80 Z" fill="${h}"/>`;
    case 'curly': return [[74, 62], [84, 48], [97, 41], [112, 41], [125, 47], [135, 60], [139, 74], [70, 75]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="${h}"/>`).join('');
    default: return `<path d="M72 74 C70 50 90 44 105 44 C122 44 140 50 138 74 C128 62 116 59 105 59 C94 59 82 62 72 74 Z" fill="${h}" opacity=".85"/>`;
  }
}

function face(a) {
  const glasses = a.glasses
    ? `<g fill="none" stroke="#1d1d1d" stroke-width="2.4"><rect x="81" y="79" width="20" height="15" rx="5"/><rect x="109" y="79" width="20" height="15" rx="5"/><path d="M101 85 L109 85"/></g>`
    : '';
  return `
    <path d="M91 77 Q96 74 101 77" stroke="#2a211c" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M109 77 Q114 74 119 77" stroke="#2a211c" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="96" cy="86" r="3.2" fill="#1d1d1d"/><circle cx="114" cy="86" r="3.2" fill="#1d1d1d"/>
    <path d="M104 92 Q102 98 106 99" stroke="#00000040" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M96 106 Q105 113 114 106" stroke="#7a3b2e" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    ${glasses}`;
}

function figure(a) {
  const collar = a.collar ? `<path d="M90 132 L105 152 L120 132 Z" fill="#f4f4f4"/>` : `<path d="M88 131 Q105 144 122 131" stroke="#00000030" stroke-width="3" fill="none"/>`;
  return `
    ${hairBack(a)}
    <path d="M28 190 C32 146 66 130 105 130 C144 130 178 146 182 190 Z" fill="${a.cloth}"/>
    ${collar}
    <rect x="93" y="104" width="24" height="30" rx="9" fill="${a.skin}"/>
    <rect x="93" y="112" width="24" height="10" fill="#00000018"/>
    <circle cx="71" cy="88" r="7.5" fill="${a.skin}"/><circle cx="139" cy="88" r="7.5" fill="${a.skin}"/>
    <ellipse cx="105" cy="84" rx="34" ry="40" fill="${a.skin}"/>
    ${face(a)}
    ${hairFront(a)}`;
}

let uid = 0;
export function avatarSVG(a, { mode = 'flat', label = '', view } = {}) {
  const id = `av${++uid}`;
  const aria = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  if (mode === 'dots') {
    // 同一張臉：轉成灰階，只透過圓點陣列顯示
    return `<svg viewBox="${view || '38 22 134 134'}" ${aria} class="avatar dots">
      <defs>
        <pattern id="${id}p" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="#fff"/></pattern>
        <mask id="${id}m"><rect width="210" height="187" fill="url(#${id}p)"/></mask>
        <filter id="${id}g"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="1.25" intercept="-.15"/><feFuncG type="linear" slope="1.25" intercept="-.15"/><feFuncB type="linear" slope="1.25" intercept="-.15"/></feComponentTransfer></filter>
      </defs>
      <rect width="210" height="187" fill="#eceae5"/>
      <g mask="url(#${id}m)" filter="url(#${id}g)"><rect width="210" height="187" fill="#eceae5"/>${figure(a)}</g>
    </svg>`;
  }
  return `<svg viewBox="${view || '20 14 170 151'}" ${aria} class="avatar">
    <rect width="210" height="187" fill="${a.bg}"/>${figure(a)}</svg>`;
}

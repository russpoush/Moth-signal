// Night Shift: progressive letter sets, a larger word pool, mistake tracking and key-back timing.
// Pure functions only; the page script in app.mjs handles the DOM and audio.
import { MORSE, encode } from './morse.mjs';

// Letters arrive a few at a time, most common first, so early nights stay decodable.
export const NIGHTS = Object.freeze([
  { name: 'First light', adds: 'ETAINOS' },
  { name: 'Porch lamp', adds: 'HRD' },
  { name: 'Lantern row', adds: 'LUCM' },
  { name: 'Lighthouse', adds: 'WFGYP' },
  { name: 'Full moon', adds: 'BVKJXQZ' },
]);

export function lettersForNight(n) {
  if (!Number.isInteger(n) || n < 0 || n >= NIGHTS.length) throw new Error('Unknown night.');
  return NIGHTS.slice(0, n + 1).map(x => x.adds).join('');
}

// Common words, 3–6 letters. Each word belongs to the first night that has all its letters.
export const POOL = Object.freeze(`
TEA SEA SIT NET TEN ONE NOT TOE ANT OAT SET SON TIN NOSE NEST SEAT STONE NOTES SAINT TOAST EAST SEEN TOES ANTS STAIN
NOON SOON INTO TINT ONSET ASSET TASTE STAINS SEASON INSIST TENNIS OASIS NOISE TONE NINE SENT TIES SAT TOSS
HEN HAT HER RED HIDE SHED DARE HEAT HEART NORTH SHORE STAR DUSK RISE TIDE STORM DREAM HORSE THIRD EARTH SHADE HINT
TRAIN RAIN DEER HAND SHINE STREAM NEAR DOOR HOOD SIREN ROAD ROSE DATE SNORE
MOON LAMP MOTH DARK CLOUD MUSIC CALM LULL CANDLE CLEAR MOUSE LUNAR CHURCH MOTEL COMET LILAC CLAM MELT MULE LOCUST
CLOAK CROSS CHILD CROWD COAST SALT LATE LAST LOUD HOME LIME ROUND SOUTH TOUCH SCOUT
GLOW WING BEAM WIND FROG OWL SKY FLY FOG PONY SWAY WOLF PEAR FLOWER SPRING PATH GRAY DEWY PILLOW
YARN SPY WAVE SWAMP WARM WATCH FIELD FOREST POWER LIGHT NIGHT
BUZZ JAZZ QUIET BLINK KITE VEX BOX JUMP QUEEN ZERO VIVID BRAVE BRIGHT DOZE WAX BAKE KNOT JOKE QUILT ZONE OXEN
`.trim().split(/\s+/));

export function nightOf(word) {
  for (let n = 0; n < NIGHTS.length; n++) {
    const set = lettersForNight(n);
    if ([...word].every(c => set.includes(c))) return n;
  }
  return -1;
}

/** Words for a night: only its letters, and (after night 1) at least one of its new letters. */
export function wordsForNight(n) {
  const set = lettersForNight(n), fresh = NIGHTS[n].adds;
  return [...new Set(POOL)].filter(w => w.length >= 3 && w.length <= 6 && [...w].every(c => set.includes(c)) && (n === 0 || [...w].some(c => fresh.includes(c))));
}

/** Deterministic PRNG so tests (and a future daily mode) can reproduce a deck. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export function pickDeck(n, rounds = 5, random = Math.random) {
  const words = wordsForNight(n).slice();
  for (let i = words.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [words[i], words[j]] = [words[j], words[i]]; }
  return words.slice(0, rounds);
}

/** Letters the player got wrong, position by position. Extra or missing letters count against the target letter. */
export function letterMistakes(answer, target) {
  const a = String(answer).trim().toUpperCase();
  const misses = [];
  for (let i = 0; i < target.length; i++) if (a[i] !== target[i]) misses.push(target[i]);
  return misses;
}

/** Merge new misses into a {letter: count} tally and return the letters most worth practicing. */
export function tally(stats, misses) {
  const next = { ...stats };
  for (const c of misses) next[c] = (next[c] || 0) + 1;
  return next;
}
export function weakest(stats, limit = 4) {
  return Object.entries(stats).filter(([c, n]) => MORSE[c] && n > 0).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit).map(([c]) => c);
}

// --- Key-back: turn press/release timings (ms) into Morse --------------------------------

/**
 * Split press lengths into dots and dashes. People key slower than the target speed, so the
 * boundary comes from the player's own presses when they include both kinds; otherwise it falls
 * back to 2 units of the target speed.
 */
export function dashThreshold(presses, unitMs) {
  const sorted = [...presses].sort((a, b) => a - b);
  let best = { ratio: 1, at: 2 * unitMs };
  for (let i = 1; i < sorted.length; i++) {
    const ratio = sorted[i] / Math.max(1, sorted[i - 1]);
    if (ratio > best.ratio) best = { ratio, at: Math.sqrt(sorted[i] * sorted[i - 1]) };
  }
  return best.ratio >= 1.8 ? best.at : 2 * unitMs;
}

/**
 * presses: [{down, up}] in ms, in order. Returns the keyed code ("letters" separated by spaces).
 * Gaps longer than about 2 dot-lengths end a letter.
 */
export function decodeKeying(presses, unitMs) {
  if (!presses.length) return '';
  const lengths = presses.map(p => Math.max(0, p.up - p.down));
  const cut = dashThreshold(lengths, unitMs);
  const dots = lengths.filter(l => l < cut);
  const dot = dots.length ? dots.reduce((a, b) => a + b, 0) / dots.length : Math.min(unitMs, cut / 3);
  const letterGap = Math.max(2 * dot, 1.5 * unitMs);
  let out = '';
  presses.forEach((p, i) => {
    if (i && p.down - presses[i - 1].up >= letterGap) out += ' ';
    out += lengths[i] < cut ? '.' : '-';
  });
  return out;
}

const INVERSE = Object.fromEntries(Object.entries(MORSE).map(([c, code]) => [code, c]));
export function codeToText(code) {
  return code.trim().split(/\s+/).filter(Boolean).map(g => INVERSE[g] || '?').join('');
}

/** Compare a keyed code with the target word; returns per-letter results for display. */
export function compareKeying(code, word) {
  const groups = code.trim().split(/\s+/).filter(Boolean);
  const target = encode(word).split(' ');
  const letters = target.map((t, i) => ({ letter: word[i], expected: t, keyed: groups[i] || '', ok: groups[i] === t }));
  return { letters, ok: groups.length === target.length && letters.every(l => l.ok), extra: Math.max(0, groups.length - target.length) };
}

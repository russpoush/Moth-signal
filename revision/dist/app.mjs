// Moth Signal — Night Shift revision. Builds on the original game in /src (unchanged).
import { MORSE, encode, timeline, isCorrect, scoreRound } from './morse.mjs';
import { NIGHTS, lettersForNight, wordsForNight, pickDeck, letterMistakes, tally, weakest, decodeKeying, codeToText, compareKeying } from './night.mjs';

const $ = id => document.getElementById(id);
const ROUNDS = 5, PASS = 12, STORE = 'moth-signal-revision';
let night = 0, deck = [], round = 0, score = 0, hinted = false, solved = false, keyed = false, busy = false, writtenFree = false;
let context, oscillator, timers = [], generation = 0;
let presses = [], keyTone = null, keyDownAt = null;

// --- Saved progress (per browser; storage can be unavailable, so every access is guarded) ---
function loadProgress() {
  try { const p = JSON.parse(globalThis.localStorage?.getItem(STORE) || 'null'); if (p && Number.isInteger(p.unlocked)) return { unlocked: Math.min(p.unlocked, NIGHTS.length - 1), best: p.best || {}, misses: p.misses || {} }; } catch {}
  return { unlocked: 0, best: {}, misses: {} };
}
let progress = loadProgress();
function saveProgress() { try { globalThis.localStorage?.setItem(STORE, JSON.stringify(progress)); } catch {} }

// --- Audio and lamp --------------------------------------------------------------------
async function audio() { context ??= new AudioContext(); await context.resume(); return context; }
function stop() {
  generation++; timers.forEach(clearTimeout); timers = [];
  try { oscillator?.stop(); } catch {} oscillator = null; busy = false;
  $('lamp').classList.remove('on'); $('play').disabled = round === ROUNDS; $('play').textContent = '▶ Play signal';
}
/** Play a timeline on sound and/or lamp. Resolves when finished or interrupted. */
async function transmit(plan, { label = true } = {}) {
  const run = ++generation; busy = true; $('play').disabled = true;
  let origin = 0;
  try {
    if ($('sound').checked) {
      const ctx = await audio(); if (run !== generation) return;
      if ($('sound').checked) {
        origin = ctx.currentTime + .12; oscillator = ctx.createOscillator(); const gain = ctx.createGain();
        oscillator.frequency.value = 600; gain.gain.value = 0; oscillator.connect(gain); gain.connect(ctx.destination);
        for (const p of plan.pulses) { const s = origin + p.start, e = s + p.duration; gain.gain.setValueAtTime(0, s); gain.gain.linearRampToValueAtTime(.12, s + .005); gain.gain.setValueAtTime(.12, e - .005); gain.gain.linearRampToValueAtTime(0, e); }
        oscillator.start(origin); oscillator.stop(origin + plan.duration + .02);
      }
    }
  } catch { if (run !== generation) return; $('feedback').textContent = 'Audio unavailable. Use the lamp, or switch off Sound and Flashes for written-only play.'; }
  if (run !== generation) return;
  const flashes = $('flashes').checked, delay = origin ? Math.max(0, (origin - context.currentTime) * 1000) : 100;
  if (label) $('play').textContent = '● Transmitting…';
  for (const p of plan.pulses) {
    timers.push(setTimeout(() => { if (flashes && $('flashes').checked) $('lamp').classList.add('on'); }, delay + p.start * 1000));
    timers.push(setTimeout(() => $('lamp').classList.remove('on'), delay + (p.start + p.duration) * 1000));
  }
  await new Promise(done => timers.push(setTimeout(() => { if (run === generation) { busy = false; $('play').disabled = solved || round === ROUNDS; $('play').textContent = '↻ Replay signal'; } done(); }, delay + plan.duration * 1000 + 30)));
}
const wpm = () => Number($('speed').value);

// --- Rounds ----------------------------------------------------------------------------
function render() {
  $('progress').textContent = `${NIGHTS[night].name.toUpperCase()} · SIGNAL ${Math.min(round + 1, ROUNDS)} / ${ROUNDS}`;
  $('score').innerHTML = `${score} <small>POINTS</small>`;
  $('title').textContent = round === ROUNDS ? 'Your shift is complete.' : 'The night is listening.';
  const over = round === ROUNDS;
  $('answer').disabled = solved || over; $('submit').disabled = solved || over;
  $('hint').disabled = solved || over || writtenFree;
  $('next').hidden = !solved || over; $('next').textContent = round === ROUNDS - 1 ? 'Finish shift →' : 'Next signal →';
  $('keyback').hidden = !solved || over || keyed;
  $('slots').textContent = over ? '' : solved ? [...deck[round]].join(' ') : '_ '.repeat(deck[round].length).trim();
  $('word-length').textContent = over ? '' : `${deck[round].length} letters`;
  const weak = weakest(progress.misses).filter(c => lettersForNight(night).includes(c));
  $('practice').hidden = !weak.length;
  $('practice-letters').replaceChildren(...weak.map(letterButton));
}
function newRound() {
  stop(); writtenFree = false; hinted = false; solved = false; keyed = false; clearKey();
  $('written').hidden = true; $('answer').value = '';
  $('feedback').textContent = 'Press Play signal to start. Replays are free.';
  if (!$('sound').checked && !$('flashes').checked) showWrittenMode(); else render();
}
function startNight(n) {
  night = n; deck = pickDeck(n, ROUNDS); round = 0; score = 0;
  const all = lettersForNight(n), fresh = NIGHTS[n].adds;
  $('night-letters').replaceChildren(...[...all].map(c => { const b = letterButton(c); if (n > 0 && fresh.includes(c)) b.classList.add('fresh'); return b; }));
  $('night-note').textContent = n === 0 ? 'Tonight’s letters. Tap one to hear it.' : `Tonight’s letters. New tonight: ${[...fresh].join(' ')}. Tap one to hear it.`;
  renderNightPicker(); renderGuide(); newRound();
}
function showWrittenMode() {
  if (solved || round >= ROUNDS) return;
  stop(); writtenFree = true; hinted = false;
  $('written').textContent = encode(deck[round]); $('written').hidden = false;
  render(); $('feedback').textContent = 'Written-only play: decode these dots and dashes. A correct answer earns 3 points.';
}
function finishShift() {
  const passed = score >= PASS;
  progress.best[night] = Math.max(progress.best[night] || 0, score);
  if (passed && night === progress.unlocked && night < NIGHTS.length - 1) progress.unlocked = night + 1;
  saveProgress(); renderNightPicker();
  const max = ROUNDS * 4;
  $('feedback').textContent = passed
    ? (night < NIGHTS.length - 1 ? `Five messages delivered: ${score} of ${max}. ${NIGHTS[night + 1].name} is unlocked.` : `Five messages delivered: ${score} of ${max}. You’ve worked every night at the tower.`)
    : `Five messages delivered: ${score} of ${max}. Score ${PASS} or more to unlock the next night.`;
  $('play').disabled = true; $('restart').focus();
}

// --- Key-back: send the word back to the tower -------------------------------------------
function clearKey() { presses = []; keyDownAt = null; $('keyed-code').textContent = ''; $('keyed-result').textContent = ''; $('key-send').disabled = true; }
function keyDown() {
  if (keyDownAt !== null || $('keyback').hidden) return;
  keyDownAt = performance.now();
  $('key').classList.add('down'); $('lamp').classList.toggle('on', $('flashes').checked);
  if ($('sound').checked) audio().then(ctx => { if (keyDownAt === null) return; keyTone = ctx.createOscillator(); const g = ctx.createGain(); keyTone.frequency.value = 600; g.gain.value = .1; keyTone.connect(g); g.connect(ctx.destination); keyTone.start(); }).catch(() => {});
}
function keyUp() {
  if (keyDownAt === null) return;
  presses.push({ down: keyDownAt, up: performance.now() }); keyDownAt = null;
  $('key').classList.remove('down'); $('lamp').classList.remove('on');
  try { keyTone?.stop(); } catch {} keyTone = null;
  const code = decodeKeying(presses, 1200 / wpm());
  $('keyed-code').textContent = code; $('keyed-result').textContent = codeToText(code); $('key-send').disabled = false;
}
function sendKey() {
  if (!presses.length || keyed) return;
  const result = compareKeying(decodeKeying(presses, 1200 / wpm()), deck[round]);
  if (result.ok) {
    keyed = true; score += 1;
    $('feedback').textContent = `The tower copied ${deck[round]} back. +1 point.`; render(); $('next').focus();
  } else {
    const wrong = result.letters.filter(l => !l.ok).map(l => `${l.letter} is ${l.expected}${l.keyed ? `, you sent ${l.keyed}` : ''}`);
    $('keyed-result').textContent = `Not quite: ${wrong.slice(0, 3).join('; ')}${result.extra ? `; ${result.extra} extra letter${result.extra > 1 ? 's' : ''}` : ''}. Clear and try again.`;
  }
}

// --- Guide and practice ----------------------------------------------------------------
function letterButton(c) {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'letter';
  b.setAttribute('aria-label', `Play ${c}, ${MORSE[c].replaceAll('.', 'dot ').replaceAll('-', 'dash ').trim()}`);
  const strong = document.createElement('b'); strong.textContent = c; b.append(strong, document.createTextNode(MORSE[c]));
  b.onclick = () => { if (busy) return; transmit(timeline(c, wpm()), { label: false }); };
  return b;
}
function renderGuide() {
  const set = lettersForNight(night);
  $('alphabet').replaceChildren(...Object.entries(MORSE).map(([letter, code]) => {
    const span = document.createElement('span'); const b = document.createElement('b'); b.textContent = letter;
    span.append(b, document.createTextNode(code)); if (!set.includes(letter)) span.className = 'later'; return span;
  }));
}
function renderNightPicker() {
  $('night').replaceChildren(...NIGHTS.map((x, i) => {
    const o = document.createElement('option'); o.value = String(i);
    o.textContent = i > progress.unlocked ? `${i + 1}. ${x.name} · locked` : `${i + 1}. ${x.name}${progress.best[i] ? ` · best ${progress.best[i]}` : ''}`;
    o.disabled = i > progress.unlocked; o.selected = i === night; return o;
  }));
}

// --- Wiring ----------------------------------------------------------------------------
$('flashes').checked = !(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
$('sound').onchange = () => { if (!$('sound').checked) { try { oscillator?.stop(); } catch {} } if (!$('sound').checked && !$('flashes').checked) showWrittenMode(); };
$('flashes').onchange = () => { if (!$('flashes').checked) $('lamp').classList.remove('on'); if (!$('sound').checked && !$('flashes').checked) showWrittenMode(); };
$('play').onclick = () => {
  if (busy || solved || round === ROUNDS) return;
  if (!$('sound').checked && !$('flashes').checked) { showWrittenMode(); return; }
  transmit(timeline(deck[round], wpm()));
};
$('answer-form').onsubmit = e => {
  e.preventDefault(); if (solved || round === ROUNDS) return;
  const answer = $('answer').value;
  if (!answer.trim()) { $('feedback').textContent = 'Enter a decoded word first.'; return; }
  if (isCorrect(answer, deck[round])) {
    stop(); solved = true; const points = scoreRound(true, hinted); score += points;
    $('feedback').textContent = `Message received: ${deck[round]}. +${points} ${points === 1 ? 'point' : 'points'}. Key it back for a bonus point, or move on.`;
    render(); $('key').focus();
  } else {
    const len = answer.trim().length, want = deck[round].length;
    // Only same-length guesses say anything about which letters were misheard.
    if (len === want) { progress.misses = tally(progress.misses, letterMistakes(answer, deck[round])); saveProgress(); }
    $('feedback').textContent = len !== want ? `A little static. The word has ${want} letters. Try again or replay.` : 'A little static. Try again, replay, or reveal the written signal.';
    render();
  }
};
$('hint').onclick = () => { if (solved || round === ROUNDS || writtenFree) return; hinted = true; $('written').textContent = encode(deck[round]); $('written').hidden = false; $('feedback').textContent = 'Written signal revealed. This round is now worth 1 point.'; render(); };
$('next').onclick = () => { if (!solved) return; round++; newRound(); if (round === ROUNDS) finishShift(); else $('answer').focus(); };
$('restart').onclick = () => startNight(night);
$('night').onchange = e => { const n = Number(e.target.value); if (n <= progress.unlocked) startNight(n); };
$('key').onpointerdown = e => { e.preventDefault(); $('key').setPointerCapture?.(e.pointerId); keyDown(); };
$('key').onpointerup = keyUp; $('key').onpointercancel = keyUp; $('key').onlostpointercapture = keyUp;
$('key').onkeydown = e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); keyDown(); } };
$('key').onkeyup = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); keyUp(); } };
$('key-clear').onclick = clearKey; $('key-send').onclick = sendKey;
$('key-play').onclick = () => { if (!busy) transmit(timeline(deck[round], wpm()), { label: false }); };
fetch('./environment.json').then(r => r.ok ? r.json() : null).then(env => { if (env?.name) $('environment').textContent = ` / ${env.name.toUpperCase()}`; }).catch(() => {});

night = Math.min(progress.unlocked, NIGHTS.length - 1);
startNight(night);

export const _test = { get state() { return { night, deck, round, score, solved, keyed, progress }; }, startNight };

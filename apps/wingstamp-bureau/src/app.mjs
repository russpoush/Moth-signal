import { LEVELS } from './levels.mjs';
import { initialState, stampAt, move, isDelivered, solve, loadProgress, adjacent } from './engine.mjs';

const $ = id => document.getElementById(id);
const storageKey = 'wingstamp-bureau:v1';
const guideKey = 'wingstamp-bureau:guided';
let index = 0;
let state = initialState(LEVELS[0]);
let history = [];
let perchButtons = new Map();
let hinted = null;
let usedHint = false;
let guided = true;
let progress;
try {
  progress = loadProgress(localStorage.getItem(storageKey), LEVELS);
  guided = localStorage.getItem(guideKey) !== 'off';
} catch {
  progress = loadProgress(null, LEVELS);
}
const level = () => LEVELS[index];
const nodeName = id => level().nodes.find(n => n.id === id)?.name ?? id;
const message = text => { $('feedback').textContent = text; };
function save(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Play works without storage. */ }
}
function choose(i) {
  index = i;
  state = initialState(level());
  history = [];
  hinted = null;
  usedHint = false;
  render();
  message(level().practice ? 'Take your time. These letters stay the same.' : 'Some letters change after you collect them. Guide me can help you all the way.');
}
function goBack() {
  if (!history.length) return;
  state = history.pop();
  hinted = null;
  render();
  message('Back one step. Your letters and the stops are just as they were.');
  if (!history.length) {
    if (guided) $('go-next').focus();
    else perchButtons.get(state.at)?.focus();
  }
}
function hop(id) {
  const result = move(level(), state, id);
  if (!result.ok) { message(result.reason); return; }
  if (guided && solve(level(), result.state) === null) {
    message('That way will get us stuck. Try the stop marked NEXT. Your moth has not moved.');
    return;
  }
  history.push(state);
  state = result.state;
  hinted = null;
  if (isDelivered(level(), state)) {
    const best = progress.best[level().id];
    if (!best || state.turns < best) {
      progress.best[level().id] = state.turns;
      save(storageKey, JSON.stringify(progress));
    }
    render();
    message(`Delivered ${level().word}! Your moth is Home. Well done!`);
    $('next').focus();
    return;
  }
  render();
  const nextLetter = level().word[state.receipt.length];
  if (state.receipt === level().word) {
    message(`You have all the letters for ${level().word}! Now go Home.`);
  } else if (result.letter) {
    const changed = stampAt(level(), state, id) !== result.letter;
    message(`${result.letter} collected! ${changed ? `${nodeName(id)} now shows ${stampAt(level(), state, id)} for a later visit. ` : ''}Next letter: ${nextLetter}.`);
  } else {
    message(`You are Home. There are still letters to collect. Next: ${nextLetter}.`);
  }
  if (guided) $('go-next').focus();
  else perchButtons.get(state.at)?.focus();
}
function render() {
  const l = level();
  const done = isDelivered(l, state);
  const path = solve(l, state);
  const suggested = guided ? path?.[0] : hinted;
  $('guided').checked = guided;
  $('route-number').textContent = `DELIVERY ${index + 1} OF ${LEVELS.length}`;
  $('route-title').textContent = l.title;
  $('move-count').textContent = `${state.turns} HOPS`;
  $('move-count').hidden = guided;
  $('lesson').textContent = l.lesson;
  $('word').replaceChildren(...[...l.word].map((letter, i) => {
    const span = document.createElement('span');
    span.className = 'letter' + (i < state.receipt.length ? ' stamped' : i === state.receipt.length ? ' needed' : '');
    span.textContent = letter;
    span.setAttribute('aria-label', `${letter}: ${i < state.receipt.length ? 'collected' : i === state.receipt.length ? 'collect next' : 'not collected yet'}`);
    return span;
  }));
  const ready = state.receipt === l.word;
  $('receipt-status').textContent = done ? 'All delivered. Your moth is Home!' : ready ? 'All letters collected. Now go Home.' : `Collect ${l.word[state.receipt.length]} next · ${state.receipt.length} of ${l.word.length} letters collected`;
  $('step-title').textContent = done ? 'Wonderful! Your word is delivered.' : path === null && guided ? 'Let’s go back one step' : ready ? 'Now bring your moth Home' : `${state.receipt.length === 0 ? 'First' : 'Next'}, collect ${l.word[state.receipt.length]}`;
  $('step-help').textContent = done ? 'Try another word whenever you are ready.' : guided ? path === null ? 'The big button will take you back. Nothing is lost.' : 'Tap the stop marked NEXT, or use the big button below the map.' : 'Choose a stop along a dotted line. Show next stop can help if you want a clue.';
  $('go-next').hidden = !guided || done;
  $('go-next').textContent = path === null ? '↶ Go back one step' : suggested === 'nest' ? 'Go Home ⌂' : `Go to ${stampAt(l, state, suggested)} · ${nodeName(suggested)} →`;
  $('go-next').disabled = done || (path === null && history.length === 0);

  const board = $('board');
  board.replaceChildren();
  perchButtons = new Map();
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');
  for (const [a, b] of l.edges) {
    const start = l.nodes.find(n => n.id === a);
    const end = l.nodes.find(n => n.id === b);
    const line = document.createElementNS(svg.namespaceURI, 'line');
    for (const [key, value] of Object.entries({ x1: start.x, y1: start.y, x2: end.x, y2: end.y })) line.setAttribute(key, String(value));
    line.setAttribute('class', 'route-line' + (a === state.at || b === state.at ? ' active' : ''));
    svg.append(line);
  }
  board.append(svg);
  for (const n of l.nodes) {
    const btn = document.createElement('button');
    btn.type = 'button';
    const result = move(l, state, n.id);
    const can = result.ok && (!guided || solve(l, result.state) !== null);
    const isNext = suggested === n.id;
    const current = stampAt(l, state, n.id);
    const later = n.id === 'nest' ? null : n.stamps[(state.cycles[n.id] + 1) % n.stamps.length];
    btn.className = 'perch' + (n.id === 'nest' ? ' nest' : '') + (n.id === state.at ? ' current' : '') + (can ? ' available' : '') + (isNext ? ' hinted' : '');
    btn.style.left = n.x + '%';
    btn.style.top = n.y + '%';
    btn.disabled = done;
    btn.setAttribute('aria-label', `${isNext ? 'Next stop. ' : ''}${n.name}. ${n.id === 'nest' ? 'Home, no letter' : `Collect ${current}${current !== later ? `, then changes to ${later}` : ''}`}. ${n.id === state.at ? 'Your moth is here.' : can ? 'You can fly here.' : adjacent(l, state.at, n.id) ? 'Connected.' : 'Follow a dotted line to get here.'}`);
    btn.setAttribute('data-node', n.id);
    const big = document.createElement('span');
    big.className = 'letter-main';
    big.textContent = current ?? '⌂';
    const small = document.createElement('span');
    small.className = 'cycle';
    small.textContent = n.id === 'nest' ? 'HOME' : current === later ? 'stays ' + current : 'then ' + later;
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = n.name;
    btn.append(big, small, name);
    if (isNext) {
      const badge = document.createElement('span');
      badge.className = 'next-badge';
      badge.textContent = 'NEXT ↓';
      badge.setAttribute('aria-hidden', 'true');
      btn.append(badge);
    }
    btn.onclick = () => hop(n.id);
    board.append(btn);
    perchButtons.set(n.id, btn);
  }
  $('undo').disabled = history.length === 0;
  $('hint').disabled = done;
  $('hint').hidden = guided;
  $('complete').hidden = !done;
  $('result').textContent = guided ? `You collected ${l.word} and brought your moth Home. Great flying!` : `${state.turns} hops · Shortest route: ${solve(l)?.length} · Best: ${progress.best[l.id] ?? '—'}${usedHint ? ' · Help used' : ''}.`;
  $('next').textContent = index === LEVELS.length - 1 ? 'Play again →' : 'Try the next word →';
  $('progress').textContent = `${Object.keys(progress.best).length} of ${LEVELS.length} delivered`;
  $('levels').replaceChildren(...LEVELS.map((item, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-current', String(i === index));
    const number = document.createElement('span');
    number.className = 'level-number';
    number.textContent = String(i + 1);
    const name = document.createElement('span');
    name.textContent = item.word + (item.practice ? ' · Easy' : '');
    const status = document.createElement('span');
    status.className = 'level-result';
    status.textContent = progress.best[item.id] ? '✓ Done' : '→';
    btn.append(number, name, status);
    btn.onclick = () => { choose(i); $('route-title').focus(); $('route-title').scrollIntoView({ block: 'start' }); };
    return btn;
  }));
}
$('undo').onclick = goBack;
$('reset').onclick = () => choose(index);
$('guided').onchange = () => {
  guided = $('guided').checked;
  hinted = null;
  save(guideKey, guided ? 'on' : 'off');
  render();
  message(guided ? 'We’ll guide you one step at a time. No need to hurry.' : 'You are choosing your own route. Show next stop is here if you need it.');
};
$('go-next').onclick = () => {
  const path = solve(level(), state);
  if (path === null) { goBack(); return; }
  if (path.length) hop(path[0]);
};
$('hint').onclick = () => {
  const path = solve(level(), state);
  usedHint = true;
  if (!path) { message('Let’s go back one step. Then try a different stop.'); return; }
  hinted = path[0];
  render();
  message(`Try ${nodeName(hinted)} next. ${hinted === 'nest' ? 'Bring your moth Home.' : `It gives you ${stampAt(level(), state, hinted)}.`}`);
};
$('next').onclick = () => { choose((index + 1) % LEVELS.length); $('route-title').focus(); $('route-title').scrollIntoView({ block: 'start' }); };
choose(0);

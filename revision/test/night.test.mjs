import test from 'node:test';
import assert from 'node:assert/strict';
import { MORSE, encode } from '../src/morse.mjs';
import { NIGHTS, POOL, lettersForNight, wordsForNight, nightOf, pickDeck, mulberry32, letterMistakes, tally, weakest, dashThreshold, decodeKeying, codeToText, compareKeying } from '../src/night.mjs';

test('nights add every letter exactly once', () => {
  const all = lettersForNight(NIGHTS.length - 1);
  assert.equal(all.length, 26);
  assert.deepEqual([...all].sort().join(''), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  assert.throws(() => lettersForNight(5));
});

test('every night has at least 20 words, all using only its letters and at least one new letter', () => {
  for (let n = 0; n < NIGHTS.length; n++) {
    const words = wordsForNight(n), set = lettersForNight(n);
    assert.ok(words.length >= 20, `night ${n} has ${words.length}`);
    for (const w of words) {
      assert.match(w, /^[A-Z]{3,6}$/);
      assert.ok([...w].every(c => set.includes(c)), w);
      if (n) assert.ok([...w].some(c => NIGHTS[n].adds.includes(c)), w);
      assert.equal(nightOf(w), n, w);
    }
  }
  assert.equal(new Set(POOL).size, POOL.length, 'no duplicate words');
});

test('decks are 5 distinct words and reproducible from a seed', () => {
  const a = pickDeck(2, 5, mulberry32(7)), b = pickDeck(2, 5, mulberry32(7));
  assert.deepEqual(a, b); assert.equal(new Set(a).size, 5);
  for (const w of a) assert.ok(wordsForNight(2).includes(w));
});

test('mistakes are tracked per target letter', () => {
  assert.deepEqual(letterMistakes('tea', 'TEA'), []);
  assert.deepEqual(letterMistakes('TEN', 'TEA'), ['A']);
  assert.deepEqual(letterMistakes('TE', 'TEA'), ['A']);
  const stats = tally(tally({}, ['A', 'H']), ['A']);
  assert.deepEqual(stats, { A: 2, H: 1 });
  assert.deepEqual(weakest(stats), ['A', 'H']);
});

// Build press timings for a word at a given unit, with a human "slop" factor.
function keyPresses(word, unit, { dash = 3, gap = 1, letterGap = 3, jitter = 0 } = {}) {
  const out = []; let t = 0; let k = 0;
  const wobble = () => 1 + (jitter ? Math.sin(++k * 2.7) * jitter : 0);
  encode(word).split(' ').forEach((letter, i) => {
    if (i) t += (letterGap - gap) * unit * wobble();
    for (const s of letter) { const len = (s === '.' ? 1 : dash) * unit * wobble(); out.push({ down: t, up: t + len }); t += len + gap * unit * wobble(); }
  });
  return out;
}

test('keying at textbook timing decodes exactly', () => {
  for (const word of ['MOTH', 'STONE', 'QUIET', 'EE', 'TT']) {
    const code = decodeKeying(keyPresses(word, 100), 100);
    assert.equal(code, encode(word), word); assert.equal(codeToText(code), word);
  }
});

test('slow, uneven human keying still decodes when dots and dashes are distinct', () => {
  // Player keys at about a third of the target speed with ±25% wobble and stretched letter gaps.
  for (const word of ['LAMP', 'NIGHT', 'HEART']) {
    const code = decodeKeying(keyPresses(word, 300, { jitter: .25, letterGap: 4 }), 100);
    assert.equal(codeToText(code), word, `${word}: ${code}`);
  }
});

test('all-dot or all-dash words fall back to the target speed', () => {
  assert.equal(dashThreshold([100, 110, 95], 100), 200);
  assert.equal(decodeKeying(keyPresses('SHE', 100), 100), encode('SHE'));
  assert.equal(decodeKeying(keyPresses('TOM', 100), 100), encode('TOM'));
});

test('comparison reports which letters were keyed wrong', () => {
  const ok = compareKeying(encode('TEA'), 'TEA'); assert.equal(ok.ok, true);
  const bad = compareKeying('- . .--', 'TEA');
  assert.equal(bad.ok, false); assert.deepEqual(bad.letters.map(l => l.ok), [true, true, false]);
  assert.equal(compareKeying(encode('TEA') + ' .', 'TEA').extra, 1);
  assert.equal(codeToText('...... .'), '?E');
  assert.equal(Object.keys(MORSE).length, 36);
});

# Moth Signal — Night Shift (revision)

A revised copy of the game. The original in `/src`, `/dist`, its tests and its Sites deployments are unchanged.

```sh
cd revision
npm test        # logic tests (night.test.mjs)
npm run build   # copies src/ to dist/
python3 -m http.server 8000 --directory src   # then open http://localhost:8000
```

## What changed, and why

| Original | Revision |
|---|---|
| The page lists all 10 possible words, so a player can match the code's length and pattern without really decoding. | No word list. The player sees the word length and **tonight's letters**. |
| 10 four-letter words. | 166 words, 3–6 letters, split across **5 nights**. Each night adds letters, most common first (E T A I N O S → +H R D → +L U C M → +W F G Y P → +B V K J X Q Z). Each night has at least 27 words, and after night 1 every word uses at least one new letter. |
| One shift. | Score 12 of 20 to unlock the next night. Best scores and unlocks are saved in this browser (guarded, so private browsing still works). |
| Static guide. | Tonight's letters are buttons that play their sound and flash. Later letters are dimmed in the guide. |
| — | **Letters to practice**: same-length wrong guesses are tallied per letter, and the most-missed letters appear as play buttons. |
| — | **Key it back (+1)**: after decoding, the player sends the word back by holding a key (pointer, Space or Enter), with tone and lamp. Timing is read from the player's own presses, so slow, uneven keying still decodes. Wrong letters are named ("A is .-, you sent .."). |

Scoring stays the same per round (3, or 1 after revealing), plus 1 for keying it back: 20 max.

## Files
- `src/night.mjs`: new pure logic (nights, word pool, deck, mistake tally, keying decoder, comparison).
- `src/app.mjs`: the page script for the revision.
- `src/morse.mjs`: unchanged copy of the original.
- `src/index.html`, `src/style.css`: copied from the original, with the night picker, letter panels and key-back section added.

## Checks
- `npm test`: 8 tests. Every night's words use only its letters. Seeded decks are reproducible. Keying decodes at textbook timing, at a third of target speed with ±25% wobble, and for all-dot or all-dash words.
- Played in headless Chrome: a full night with wrong answers and keyed Space-bar replies for 4 words (19/20), night 2 unlocked, no page errors, and no horizontal scroll at 390 px wide. Real audio wasn't listened to; the tone uses the same Web Audio approach as the original.

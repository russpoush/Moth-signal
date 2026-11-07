const nest = { id: 'nest', name: 'Home', x: 50, y: 84 };
const spots = {
  A: { name: 'Fern', x: 20, y: 61 },
  B: { name: 'Willow', x: 20, y: 24 },
  C: { name: 'Birch', x: 80, y: 24 },
  D: { name: 'Clover', x: 80, y: 61 },
  E: { name: 'Moon', x: 50, y: 12 }
};
function level(id, title, word, cycles, edges, lesson, practice = false) {
  return {
    id, title, word, lesson, practice,
    nodes: [nest, ...Object.entries(cycles).map(([id, stamps]) => ({ id, ...spots[id], stamps: [...stamps] }))],
    edges: edges.map(edge => edge.split('-'))
  };
}
function easy(id, title, word) {
  const ids = [...word].map((_, i) => String.fromCharCode(65 + i));
  const cycles = Object.fromEntries(ids.map((id, i) => [id, word[i]]));
  const edges = [`nest-${ids[0]}`, ...ids.slice(1).map((id, i) => `${ids[i]}-${id}`), `${ids.at(-1)}-nest`];
  return level(id, title, word, cycles, edges, `Collect ${[...word].join(', then ')}, then go Home. These letters stay the same. The big green button can guide every step.`, true);
}
function returnVisit(id, title, word) {
  return level(id, title, word, { A: word[0] + word[2], B: word[1], C: word[3] },
    ['nest-A', 'A-B', 'A-C', 'C-nest'],
    `Fern gives ${word[0]} first. Come back after ${word[1]} to collect ${word[2]}. Then collect ${word[3]} at Birch and go Home.`);
}
export const LEVELS = [
  // Eight gentle deliveries with no changing letters.
  easy('hello-post', 'Say hello', 'HI'),
  easy('cat-post', 'A little CAT', 'CAT'),
  easy('dog-post', 'A friendly DOG', 'DOG'),
  easy('sun-post', 'Hello, SUN', 'SUN'),
  easy('map-post', 'Follow the MAP', 'MAP'),
  easy('cup-post', 'A little CUP', 'CUP'),
  easy('hat-post', 'A new HAT', 'HAT'),
  easy('bus-post', 'Catch the BUS', 'BUS'),
  // One changing stop: practice a return visit with familiar words.
  level('first-post', 'A changing letter', 'MAIL', { A: 'MI', B: 'A', C: 'L' }, ['nest-A', 'A-B', 'A-C', 'C-nest'], 'Fern gives M first, then I when you return. Visit Fern, Willow, Fern again, then Birch. Finally go Home.'),
  level('wing-shift', 'A change of wings', 'WING', { A: 'WN', B: 'I', D: 'G' }, ['nest-A', 'A-B', 'A-D', 'D-nest'], 'A stop remembers your last visit. Its small “then” letter tells you what it gives next time.'),
  returnVisit('book-post', 'A bedtime BOOK', 'BOOK'),
  returnVisit('star-post', 'Wish on a STAR', 'STAR'),
  returnVisit('tree-post', 'A shady TREE', 'TREE'),
  returnVisit('home-post', 'A word for HOME', 'HOME'),
  returnVisit('love-post', 'Send some LOVE', 'LOVE'),
  returnVisit('kind-post', 'A KIND delivery', 'KIND'),
  returnVisit('play-post', 'Time to PLAY', 'PLAY'),
  level('moon-mail', 'Moon mail', 'MOON', { A: 'MO', B: 'O', C: 'N', D: 'OX' }, ['nest-A', 'A-B', 'A-D', 'A-C', 'C-nest', 'D-C'], 'Two stops offer O. Explore both routes, and watch Fern change from M to O. Going back is always free.'),
  // Longer words with two or more changing stops.
  level('night-route', 'The night route', 'NIGHT', { A: 'NG', B: 'IH', C: 'T', D: 'GX' }, ['nest-A', 'A-B', 'B-C', 'C-nest', 'A-D', 'D-C'], 'Watch the letters after each visit. Leave Guide me on if you would like help with every step.'),
  level('paper-trail', 'A paper trail', 'PAPER', { A: 'PP', B: 'AE', C: 'R', D: 'EX' }, ['nest-A', 'A-B', 'B-C', 'C-nest', 'A-D'], 'A stop can keep the same letter. Revisit Willow after its A changes to E.'),
  level('smile-post', 'Deliver a SMILE', 'SMILE', { A: 'SI', B: 'ML', C: 'E' }, ['nest-A', 'A-B', 'B-C', 'C-nest'], 'Fern changes S to I. Willow changes M to L. Visit both a second time, then collect E and go Home.'),
  level('double-loop', 'Two little loops', 'LETTER', { A: 'LT', B: 'ET', C: 'ER' }, ['nest-A', 'A-B', 'A-C', 'B-C', 'C-nest'], 'Fern and Willow both change. Take your time, or use the big green button to follow the route.'),
  level('return-service', 'Return service', 'RETURN', { A: 'RT', B: 'EU', C: 'RN', D: 'UX' }, ['nest-A', 'A-B', 'A-C', 'B-C', 'C-nest', 'B-D', 'D-C'], 'Three changing stops share one word. Guide me can help you bring all the letters Home.'),
  level('bureau-night', 'Bureau by moonlight', 'BUREAU', { A: 'BR', B: 'UA', C: 'EU', D: 'AX', E: 'UX' }, ['nest-A', 'A-B', 'A-C', 'B-C', 'C-nest', 'B-D', 'D-E', 'E-C'], 'The last delivery has three return visits. Collect every letter, then follow the last dotted line Home.')
];

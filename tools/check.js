// Logic checks for the Parley content. Run: node tools/check.js
const path = require('path');
const root = path.join(__dirname, '..');
globalThis.window = globalThis;
if (!globalThis.crypto) globalThis.crypto = require('crypto').webcrypto;
globalThis.location = { search: '', hash: '', href: 'http://x/' };
for (const f of ['kit.js', 'council.data.js', 'leak.data.js', 'panel.data.js']) require(path.join(root, 'assets', f));
const { K, COUNCIL: C, LEAK: L, PANEL: P } = globalThis;
let bad = 0;
const ok = (c, m) => { if (!c) { bad++; console.log('FAIL', m); } };

// ---------- The Council ----------
for (let t = 0; t < 400; t++) {
  const room = K.newCode(5);
  for (const n of [3, 4]) {
    const pf = C.portfoliosFor(room, n);
    ok(pf.length === n && new Set(pf).size === n, 'portfolios ' + room);
    const ord = C.orderFor(room);
    ok(ord.length === 8 && ord[0] === 'windfall' && new Set(ord).size === 8, 'order ' + ord);
    C.PROMISE_CRISES.forEach(p => ok(ord.includes(p), 'promise crisis missing ' + p));
    ord.forEach(id => ok(!!C.CRISES[id], 'unknown crisis ' + id));
  }
}
const gids = C.GAUGES.map(g => g.id);
Object.entries(C.PORTFOLIOS).forEach(([k, p]) => {
  const c = C.CRISES[p.promise.crisis];
  ok(c, 'promise crisis ' + k);
  p.promise.keeps.forEach(o => ok(c.options.some(x => x.id === o), 'keeps ' + k + o));
  ok(gids.includes(p.gauge), 'gauge ' + k);
});
Object.entries(C.CRISES).concat(Object.entries(C.RECKONING)).forEach(([id, c]) => {
  ok(typeof c.text({}) === 'string' && c.text({}).length > 80, 'text ' + id);
  ok(c.real, 'real ' + id);
  c.options.forEach(o => {
    Object.keys(o.fx).forEach(g => ok(gids.includes(g), 'fx gauge ' + id + g));
    ok(o.out && o.label && o.pitch, 'option fields ' + id + o.id);
    if (o.flag) ok(C.EPILOGUE.flags[o.flag], 'flag has no epilogue line: ' + o.flag);
  });
});
C.CHARTER.forEach(a => a.options.forEach(o => Object.keys(o.fx).forEach(g => ok(gids.includes(g), 'charter fx ' + g))));
['cit:blood', 'cit:investor', 'sea:reserve', 'sea:village', 'lang:skerran', 'lang:english'].forEach(s => {
  const [k, v] = s.split(':');
  const hit = Object.values(C.CRISES).filter(c => c.guard && c.guard({ [k]: v }));
  ok(hit.length === 1, 'guard ' + s + ' hits ' + hit.length);
  hit.forEach(c => c.guard({ [k]: v }).options.forEach(o => ok(c.options.some(x => x.id === o), 'guard option ' + o)));
});
// Simulated play under two policies: blind (random votes) and careful (never votes a gauge down to zero if it can help it).
function simulate(careful) {
  let falls = 0, emerg = 0;
  const games = 4000, sums = {};
  gids.forEach(k => { sums[k] = 0; });
  for (let t = 0; t < games; t++) {
    const r = K.rng('sim' + t), g = { treasury: 5, trust: 5, reef: 5, standing: 5 };
    let e = 0, fell = false;
    const ap = fx => Object.keys(fx).forEach(k => { g[k] = Math.max(0, Math.min(10, g[k] + fx[k])); });
    const safe = o => Object.keys(o.fx).every(k => g[k] + o.fx[k] > 0);
    const choose = opts => {
      const pool = careful && opts.some(safe) ? opts.filter(safe) : opts;
      return pool[Math.floor(r() * pool.length)];
    };
    const zero = () => {
      for (const k of gids) {
        if (g[k] <= 0) {
          e++;
          if (e >= 2) { fell = true; return; }
          const o = gids.filter(x => x !== k).sort((x, y) => g[y] - g[x])[0];
          g[o] = Math.max(0, g[o] - 2); g[k] = 2;
        }
      }
    };
    C.CHARTER.forEach(a => ap(a.options[Math.floor(r() * 3)].fx));
    const ord = C.orderFor('sim' + t);
    for (let k = 0; k < ord.length; k++) {
      if (C.BILLS.includes(k)) { ap({ treasury: -1 }); zero(); if (fell) break; }
      ap(choose(C.CRISES[ord[k]].options).fx); zero();
      if (fell) break;
    }
    if (!fell) {
      const low = gids.slice().sort((x, y) => g[x] - g[y])[0];
      ap(choose(C.RECKONING[low].options).fx); zero();
    }
    if (fell) falls++;
    emerg += e;
    gids.forEach(k => { sums[k] += g[k]; });
  }
  console.log('council, ' + (careful ? 'careful' : 'blind') + ' play: government fell in ' + (100 * falls / games).toFixed(1) + '% of games; emergencies per game ' + (emerg / games).toFixed(2) +
    '; mean final gauges ' + gids.map(k => k + ' ' + (sums[k] / games).toFixed(1)).join(', '));
}
simulate(false);
simulate(true);

// ---------- The Leak ----------
for (let t = 0; t < 300; t++) {
  const room = K.newCode(5), c4 = L.castFor(room, 4), c3 = L.castFor(room, 3);
  ok(new Set(c4).size === 4 && c4.includes('alex'), 'cast of four');
  ok(new Set(c3).size === 3 && c3.includes('alex') && !c3.includes('sam'), 'cast of three');
}
L.ROUNDS.forEach(r => r.ids.forEach(id => ok(L.EXHIBITS.some(x => x.id === id && x.round === r.n), 'exhibit ' + id)));
ok(L.EXHIBITS.length === 6, 'six exhibits');
L.QUESTIONS.forEach(q => q.options.forEach(o => { if (q.id !== 'q1') ok(L.EPILOGUE[q.id][o.id], 'epilogue ' + q.id + o.id); }));
Object.keys(L.CAST).forEach(c => ok(typeof L.AIMS[c] === 'function', 'aim ' + c));

// ---------- The Panel ----------
for (let t = 0; t < 500; t++) {
  const room = K.newCode(5);
  for (const n of [3, 4]) {
    const p = P.plan(room, n);
    ok(JSON.stringify(p) === JSON.stringify(P.plan(room, n)), 'plan not deterministic');
    ok(p.jam.length === n * 2 && new Set(p.jam.map(j => j.subject)).size === n * 2, 'one minute subjects');
    ok(p.bluff.length === 4 && new Set(p.bluff.map(b => b.word.w)).size === 4, 'dictionary words');
    ok(p.wilty.length === (n === 3 ? 4 : n) && p.wilty.some(w => w.truth) && p.wilty.some(w => !w.truth), 'true-or-not mix');
    for (let s = 0; s < n; s++) ok(p.wilty.some(w => w.speaker === s), 'true-or-not seat ' + s);
    ok(p.truth.length === n && new Set(p.truth.map(x => x.lecturer)).size === n && new Set(p.truth.map(x => x.subject)).size === n, 'lectures');
    [].concat(p.jam.map(j => j.starter), p.bluff.map(b => b.reader), p.wilty.map(w => w.speaker), p.truth.map(x => x.lecturer)).forEach(s => ok(s >= 0 && s < n, 'seat range'));
  }
}
ok(new Set(P.WORDS.map(w => w.w)).size === P.WORDS.length, 'duplicate word');
ok(new Set(P.SUBJECTS).size === P.SUBJECTS.length, 'duplicate subject');
ok(new Set(P.LIES).size === P.LIES.length, 'duplicate lie');
P.LECTURES.forEach(l => ok(l.truths.length === 3, 'three truths ' + l.subject));
console.log('counts: subjects ' + P.SUBJECTS.length + ', words ' + P.WORDS.length + ', lies ' + P.LIES.length + ', lectures ' + P.LECTURES.length +
  ' | crises ' + Object.keys(C.CRISES).length + ' | phrases ' + K.PHRASES.length);
console.log(bad ? bad + ' FAILURES' : 'all checks passed');
process.exit(bad ? 1 : 0);

// Logic checks for the Parley content, for both scenarios of every game. Run: node tools/check.js
const path = require('path');
const root = path.join(__dirname, '..');
globalThis.window = globalThis;
if (!globalThis.crypto) globalThis.crypto = require('crypto').webcrypto;
globalThis.location = { search: '', hash: '', href: 'http://x/' };
const load = f => { const p = path.join(root, 'assets', f); delete require.cache[require.resolve(p)]; require(p); };
load('kit.js');
load('panel.data.js');
const K = globalThis.K, P = globalThis.PANEL;
let bad = 0;
const ok = (c, m) => { if (!c) { bad++; console.log('FAIL', m); } };

// ---------- The Council ----------
function council(v) {
  load('council.' + v + '.js');
  const C = globalThis.COUNCIL, gids = C.GAUGES.map(g => g.id), tag = 'council/' + v + ': ';
  ok(C.META && C.META.title && C.META.bill && C.META.verdicts.ok, tag + 'META');
  ok(gids.length === 4 && new Set(gids).size === 4, tag + 'four gauges');
  const pids = Object.keys(C.PORTFOLIOS);
  for (let t = 0; t < 300; t++) {
    const room = K.newCode(5);
    for (const n of [3, 4]) {
      const pf = C.portfoliosFor(room, n);
      ok(pf.length === n && new Set(pf).size === n && pf.every(p => pids.includes(p)), tag + 'portfolios');
      const ord = C.orderFor(room);
      ok(ord.length === 8 && ord[0] === C.FIRST && new Set(ord).size === 8, tag + 'order ' + ord);
      C.PROMISE_CRISES.forEach(p => ok(ord.includes(p), tag + 'promise crisis missing ' + p));
      ord.forEach(id => ok(!!C.CRISES[id], tag + 'unknown crisis ' + id));
    }
  }
  ok(pids.length === 4 && new Set(pids.map(p => C.PORTFOLIOS[p].gauge)).size === 4, tag + 'one gauge per portfolio');
  pids.forEach(k => {
    const p = C.PORTFOLIOS[k], c = C.CRISES[p.promise.crisis];
    ok(c && C.PROMISE_CRISES.includes(p.promise.crisis), tag + 'promise crisis ' + k);
    p.promise.keeps.forEach(o => ok(c.options.some(x => x.id === o), tag + 'keeps ' + k + o));
    ok(gids.includes(p.gauge) && p.brief.length === 3, tag + 'portfolio ' + k);
  });
  ok(Object.keys(C.CRISES).length === 1 + C.PROMISE_CRISES.length + C.POOL.length, tag + 'crisis count');
  gids.forEach(g => { ok(C.RECKONING[g], tag + 'reckoning for ' + g); ok(C.EPILOGUE[g] && C.EPILOGUE[g].length === 3, tag + 'epilogue for ' + g); });
  Object.entries(C.CRISES).concat(Object.entries(C.RECKONING)).forEach(([id, c]) => {
    ok(typeof c.text({}) === 'string' && c.text({}).length > 80, tag + 'text ' + id);
    ok(c.real, tag + 'real ' + id);
    c.options.forEach(o => {
      Object.keys(o.fx).forEach(g => ok(gids.includes(g), tag + 'fx gauge ' + id + ' ' + g));
      ok(o.out && o.label && o.pitch, tag + 'option fields ' + id + o.id);
      if (o.flag) ok(C.EPILOGUE.flags[o.flag], tag + 'flag has no epilogue line: ' + o.flag);
    });
  });
  const flags = new Set();
  Object.values(C.CRISES).concat(Object.values(C.RECKONING)).forEach(c => c.options.forEach(o => { if (o.flag) flags.add(o.flag); }));
  Object.keys(C.EPILOGUE.flags).forEach(f => ok(flags.has(f), tag + 'epilogue line never used: ' + f));
  // Every charter choice that a guard mentions must exist, and guarded options must exist.
  C.CHARTER.forEach(a => a.options.forEach(o => {
    Object.keys(o.fx).forEach(g => ok(gids.includes(g), tag + 'charter fx ' + g));
    Object.values(C.CRISES).forEach(c => { if (c.guard) { const gd = c.guard({ [a.id]: o.id }); if (gd) { ok(gd.why, tag + 'guard text'); gd.options.forEach(x => ok(c.options.some(y => y.id === x), tag + 'guard option ' + x)); } } });
  }));

  // Simulated play under two policies: blind (random votes) and careful (never votes a gauge to zero if it can help it).
  function simulate(careful) {
    let falls = 0, emerg = 0, most = 0;
    const games = 4000, sums = {};
    gids.forEach(k => { sums[k] = 0; });
    for (let t = 0; t < games; t++) {
      const r = K.rng('sim' + t), g = {};
      gids.forEach(k => { g[k] = 5; });
      let e = 0, fell = false;
      const ap = fx => Object.keys(fx).forEach(k => { g[k] = Math.max(0, Math.min(10, g[k] + fx[k])); });
      const safe = o => Object.keys(o.fx).every(k => g[k] + o.fx[k] > 0);
      const choose = opts => { const pool = careful && opts.some(safe) ? opts.filter(safe) : opts; return pool[Math.floor(r() * pool.length)]; };
      // As in the engine: the second emergency marks the government as fallen but the year is played out,
      // and the gauge given up never drops below 1.
      const zero = () => {
        for (let k = gids.find(x => g[x] <= 0); k; k = gids.find(x => g[x] <= 0)) {
          e++; if (e >= 2) fell = true;
          const o = gids.filter(x => x !== k && g[x] >= 2).sort((x, y) => g[y] - g[x])[0];
          if (o) g[o] = Math.max(1, g[o] - 2);
          g[k] = 2;
        }
      };
      C.CHARTER.forEach(a => ap(a.options[Math.floor(r() * a.options.length)].fx));
      const ord = C.orderFor('sim' + t);
      for (let k = 0; k < ord.length; k++) {
        if (C.BILLS.includes(k)) { ap({ [gids[0]]: -1 }); zero(); }
        ap(choose(C.CRISES[ord[k]].options).fx); zero();
      }
      const low = gids.slice().sort((x, y) => g[x] - g[y])[0];
      ap(choose(C.RECKONING[low].options).fx); zero();
      most = Math.max(most, e);
      if (fell) falls++;
      emerg += e;
      gids.forEach(k => { sums[k] += g[k]; });
    }
    console.log(tag + (careful ? 'careful' : 'blind') + ' play: fell in ' + (100 * falls / games).toFixed(1) + '% of games; emergencies per game ' + (emerg / games).toFixed(2) + ' (most ' + most + ')' +
      '; mean final ' + gids.map(k => k + ' ' + (sums[k] / games).toFixed(1)).join(', '));
  }
  simulate(false);
  simulate(true);
}

// ---------- The Leak ----------
function leak(v) {
  load('leak.' + v + '.js');
  const L = globalThis.LEAK, M = L.META, tag = 'leak/' + v + ': ';
  ok(M.all.length === 4 && M.all.every(c => L.CAST[c]) && Object.keys(L.CAST).length === 4, tag + 'cast of four');
  ok(L.CAST[M.leaker] && L.CAST[M.leaker].liar === true, tag + 'leaker may lie');
  ok(M.all.filter(c => L.CAST[c].liar).length === 1, tag + 'exactly one liar');
  ok(M.absent !== M.leaker && M.all.includes(M.absent), tag + 'absent is not the leaker');
  ok(M.all.includes(M.clear) && M.clear !== M.leaker, tag + 'clear');
  M.secrets.forEach(s => ok(M.all.includes(s.who) && s.who !== M.leaker && s.chip && s.kept, tag + 'secret ' + s.id));
  ok(M.prompts.length === 3 && M.grid.length === 3 && M.truth && M.awayTitle && M.awayTag.length === 2, tag + 'META text');
  ok(Array.isArray(L.AWAY) && L.AWAY.length >= 3, tag + 'away statement');
  for (let t = 0; t < 300; t++) {
    const room = K.newCode(5), c4 = L.castFor(room, 4), c3 = L.castFor(room, 3);
    ok(new Set(c4).size === 4 && c4.includes(M.leaker), tag + 'cast of four');
    ok(new Set(c3).size === 3 && c3.includes(M.leaker) && !c3.includes(M.absent), tag + 'cast of three');
  }
  ok(L.EXHIBITS.length === 6 && L.EXHIBITS.map(x => x.id).join('') === 'ABCDEF', tag + 'six exhibits, lettered in order');
  ok(L.ROUNDS.length === 3, tag + 'three rounds');
  L.ROUNDS.forEach(r => { ok(r.hints.length === 3, tag + 'three hints'); r.ids.forEach(id => ok(L.EXHIBITS.some(x => x.id === id && x.round === r.n), tag + 'exhibit ' + id)); });
  ok(L.QUESTIONS.length === 3 && L.CARDS.length === 5 && L.SOLUTION.length >= 4, tag + 'hearing shape');
  L.QUESTIONS.forEach(q => q.options.forEach(o => { if (q.id !== 'q1') ok(L.EPILOGUE[q.id][o.id], tag + 'epilogue ' + q.id + ' ' + o.id); }));
  M.all.forEach(c => {
    ok(typeof L.AIMS[c] === 'function', tag + 'aim ' + c);
    const x = L.CAST[c]; ok(x.name && x.job && x.who && x.know.length >= 4 && x.quiet.length >= 1 && x.want && x.hearing, tag + 'brief ' + c);
  });
  // Every character's hearing aim must be reachable by some combination of votes.
  const combos = [];
  L.QUESTIONS[0].options.forEach(a => L.QUESTIONS[1].options.forEach(b => L.QUESTIONS[2].options.forEach(c => combos.push({ q1: a.id, q2: b.id, q3: c.id }))));
  M.all.forEach(c => ok(combos.some(L.AIMS[c]) && !combos.every(L.AIMS[c]), tag + 'aim is neither impossible nor automatic: ' + c));
}

// ---------- The Panel ----------
function panel() {
  const seen = { rehearsal: { s: new Set(), w: new Set(), l: new Set(), t: new Set() }, 'class': { s: new Set(), w: new Set(), l: new Set(), t: new Set() } };
  for (let t = 0; t < 400; t++) {
    const room = K.newCode(5);
    for (const v of ['rehearsal', 'class']) {
      for (const n of [3, 4]) {
        const p = P.plan(room, n, v);
        ok(JSON.stringify(p) === JSON.stringify(P.plan(room, n, v)), 'panel: plan not deterministic');
        ok(p.jam.length === n * 2 && new Set(p.jam.map(j => j.subject)).size === n * 2, 'panel: one minute subjects');
        ok(p.bluff.length === 4 && new Set(p.bluff.map(b => b.word.w)).size === 4, 'panel: dictionary words');
        ok(p.wilty.length === (n === 3 ? 4 : n) && p.wilty.some(w => w.truth) && p.wilty.some(w => !w.truth), 'panel: true-or-not mix');
        for (let s = 0; s < n; s++) ok(p.wilty.some(w => w.speaker === s), 'panel: true-or-not seat ' + s);
        ok(p.truth.length === n && new Set(p.truth.map(x => x.lecturer)).size === n && new Set(p.truth.map(x => x.subject)).size === n, 'panel: lectures');
        [].concat(p.jam.map(j => j.starter), p.bluff.map(b => b.reader), p.wilty.map(w => w.speaker), p.truth.map(x => x.lecturer)).forEach(s => ok(s >= 0 && s < n, 'panel: seat range'));
        p.jam.forEach(j => seen[v].s.add(j.subject)); p.bluff.forEach(b => seen[v].w.add(b.word.w)); p.wilty.forEach(w => seen[v].l.add(w.lie)); p.truth.forEach(x => seen[v].t.add(x.subject));
      }
    }
  }
  // Nothing that can appear in rehearsal may ever appear in class.
  ['s', 'w', 'l', 't'].forEach(k => seen.rehearsal[k].forEach(x => ok(!seen['class'][k].has(x), 'panel: shared between scenarios: ' + x)));
  ok(new Set(P.WORDS.map(w => w.w)).size === P.WORDS.length, 'panel: duplicate word');
  ok(new Set(P.SUBJECTS).size === P.SUBJECTS.length, 'panel: duplicate subject');
  ok(new Set(P.LIES).size === P.LIES.length, 'panel: duplicate lie');
  P.LECTURES.forEach(l => ok(l.truths.length === 3, 'panel: three truths ' + l.subject));
  console.log('panel: per scenario ' + seen.rehearsal.s.size + '/' + seen['class'].s.size + ' subjects, ' + seen.rehearsal.w.size + '/' + seen['class'].w.size + ' words, ' +
    seen.rehearsal.l.size + '/' + seen['class'].l.size + ' lies, ' + seen.rehearsal.t.size + '/' + seen['class'].t.size + ' lectures; no overlap');
}

['rehearsal', 'class'].forEach(council);
['rehearsal', 'class'].forEach(leak);
panel();
console.log(bad ? bad + ' FAILURES' : 'all checks passed');
process.exit(bad ? 1 : 0);

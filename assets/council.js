/* The Council — host screen. */
(function () {
  'use strict';
  const D = window.COUNCIL, K = window.K, $ = K.$, esc = K.esc;
  const V = K.variant();
  const LS = K.store('parley.council.v2.' + V);
  const GID = D.GAUGES.map(g => g.id);
  const app = $('#app');
  const T = { charter: 240, crisis: 210, emergency: 90, write: 360, review: 300 };
  let S = LS.get();

  function fresh() {
    return {
      v: 1, room: K.newCode(5), names: ['', '', '', ''], n: 0, phase: 'setup', i: 0, sub: 'read', turn: 0,
      g: GID.reduce((o, id) => { o[id] = 5; return o; }, {}), f: {}, flags: {}, picks: {}, order: [], reck: null,
      emergencies: 0, fell: false, zero: null, timer: null, started: 0, delta: null, ask: null, markers: [2, 2, 2, 2], sure: false, bill: false, hold: false
    };
  }
  if (!S || S.v !== 1 || !S.g || GID.some(id => S.g[id] == null)) S = fresh();
  const save = () => LS.set(S);

  const clock = K.Countdown({ id: 'main', get: () => S.timer, set: t => { S.timer = t; save(); } });
  const setTimer = sec => { S.timer = { left: sec, running: false, total: sec }; };

  // ---------- small pieces ----------
  const names = () => S.names.slice(0, S.n);
  const chair = () => names()[S.turn % S.n] || '';
  const gname = id => D.GAUGES.find(g => g.id === id).name;
  function clamp(v) { return Math.max(0, Math.min(10, v)); }
  function apply(fx) {
    const d = {};
    Object.keys(fx || {}).forEach(k => { const before = S.g[k]; S.g[k] = clamp(before + fx[k]); d[k] = S.g[k] - before; });
    S.delta = d;
  }
  function gauges(showDelta) {
    return '<div class="gauges">' + D.GAUGES.map(g => {
      const v = S.g[g.id], d = showDelta && S.delta ? (S.delta[g.id] || 0) : 0;
      let segs = ''; for (let i = 1; i <= 10; i++) segs += '<i class="' + (i <= v ? 'on' : '') + '"></i>';
      const dd = d ? '<span class="d ' + (d > 0 ? 'up' : 'down') + '">' + (d > 0 ? '+' : '−') + Math.abs(d) + '</span>' : '';
      return '<div class="gauge' + (v <= 2 ? ' low' : '') + '"><div class="top"><span class="lab">' + g.name + '</span><span><span class="v">' + v + '</span>' + dd + '</span></div><div class="segs">' + segs + '</div></div>';
    }).join('') + '</div>';
  }
  function fxLine(fx) {
    return '<div class="fx">' + Object.keys(fx || {}).filter(k => fx[k]).map(k =>
      '<span class="' + (fx[k] > 0 ? 'up' : 'down') + '">' + gname(k) + ' ' + (fx[k] > 0 ? '▲' : '▼').repeat(Math.abs(fx[k])) + '</span>').join('') + '</div>';
  }
  function timerBox() {
    const t = S.timer || {};
    const ctl = !t.running
      ? '<button class="btn y" data-act="t-go">' + (t.left === t.total ? 'Start the clock' : 'Resume') + '</button>'
      : '<button class="btn" data-act="t-pause">Pause</button>';
    return '<div class="btns"><span class="timer s" data-timer="main">' + K.fmt(clock.left()) + '</span>' + ctl + '<button class="btn ghost" data-act="t-add">+ 1 min</button></div>';
  }
  function phraseStrip(key) {
    return '<div class="phrases"><span class="lab">On the record</span>' + K.phrases(S.room + key, 3).map(p => '<q>' + esc(p) + '</q>').join('') + '</div>';
  }
  function kicker(text) {
    return '<div class="kicker"><span>' + esc(text) + '</span><span class="who">Chair: ' + esc(chair()) + '</span></div>';
  }
  const nextBtn = (label, act) => '<div class="btns"><button class="btn go" data-act="' + (act || 'next') + '" data-next>' + esc(label || 'Next') + ' →</button></div>';

  // ---------- screens ----------
  function vSetup() {
    const inputs = [0, 1, 2, 3].map(i =>
      '<input type="text" maxlength="14" data-name="' + i + '" placeholder="' + (i < 3 ? 'Name' : 'Name (optional)') + '" value="' + esc(S.names[i]) + '">').join('');
    return '<div class="stage narrow"><div class="kicker"><span>90 minutes · 3 or 4 players</span></div><h1>The Council</h1>' +
      '<p class="lead" style="margin-top:1rem">' + esc(D.META.lead) + '</p>' +
      '<div class="sheet" style="margin-top:1.4rem"><div class="lab" style="margin-bottom:.6rem">Who is at the table, in seating order</div><div class="row">' + inputs + '</div>' +
      '<div class="btns"><button class="btn go" data-act="begin" data-next>Begin →</button><a class="btn ghost" href="print.html?g=council&v=' + V + '" target="_blank">Print the minister’s sheet</a></div></div></div>';
  }
  function vRules() {
    return '<div class="stage narrow"><div class="kicker"><span>How it works</span></div><h2>' + esc(D.META.title) + '</h2>' +
      '<div class="sheet" style="margin-top:1.2rem"><ol class="steps">' + D.RULES.map(r => '<li>' + esc(r) + '</li>').join('') + '</ol></div>' + nextBtn('The Charter') + '</div>';
  }
  function vCharter() {
    const a = D.CHARTER[S.i];
    if (S.sub === 'out') {
      const o = a.options.find(x => x.id === S.f[a.id]);
      return '<div class="stage">' + gauges(true) + kicker('Charter · ' + a.title + ' adopted') + '<h2>' + esc(a.question) + '</h2>' +
        '<div class="sheet" style="margin-top:1.1rem"><div class="lab">The Charter now says</div><p class="lead" style="margin:.3rem 0 0"><b>' + esc(o.label) + '.</b> ' + esc(o.pitch) + '</p></div>' +
        nextBtn(S.i < D.CHARTER.length - 1 ? 'Next article' : 'Sign the Charter') + '</div>';
    }
    return '<div class="stage">' + gauges(false) + kicker('Charter · ' + a.title + ' of ' + D.CHARTER.length) + '<h2>' + esc(a.question) + '</h2>' +
      '<div class="split"><div><p class="lead">' + esc(a.text) + '</p>' + timerBox() + phraseStrip('ch' + S.i) + '</div>' +
      '<div class="opts col">' + a.options.map((o, k) => '<button class="opt" data-act="charter" data-id="' + o.id + '"><span class="k">' + 'ABC'[k] + '</span><b>' + esc(o.label) + '</b><span>' + esc(o.pitch) + '</span>' + fxLine(o.fx) + '</button>').join('') + '</div></div></div>';
  }
  function vLots() {
    const pf = D.portfoliosFor(S.room, S.n);
    const seats = names().map((nm, i) => '<div class="seat"><h3>' + esc(nm) + '</h3><div class="qr">' + K.qrSvg(K.seatUrl('council', S.room, i, S.n)) + '</div>' + (V === 'rehearsal' ? '<a class="lab" target="_blank" href="' + esc(K.seatUrl('council', S.room, i, S.n)) + '">Open in a new tab</a>' : '') + '</div>').join('');
    return '<div class="stage"><div class="kicker"><span>The Charter is signed</span></div><h2>Now find out who you are.</h2>' +
      '<p class="lead" style="margin:.8rem 0 1.2rem">Scan your own code. Read it once, tell nobody, put the phone face down.</p>' +
      '<div class="seats">' + seats + '</div>' +
      '<details><summary>No phone?</summary><p class="dim" style="margin-top:.5rem">Open the link on any device: ' + esc(K.seatUrl('council', S.room, 0, S.n).replace('s=0', 's=SEAT')) + ' with SEAT from 0 to ' + (pf.length - 1) + '.</p></details>' +
      nextBtn('First dispatch') + '</div>';
  }
  function crisisDef() { return S.phase === 'reckoning' ? D.RECKONING[S.reck] : D.CRISES[S.order[S.i]]; }
  function vCrisis() {
    const c = crisisDef(), id = S.phase === 'reckoning' ? 'reck' : S.order[S.i];
    const label = S.phase === 'reckoning' ? 'The reckoning' : 'Dispatch ' + (S.i + 1) + ' of ' + S.order.length;
    const guard = c.guard ? c.guard(S.f) : null;
    if (S.sub === 'out') {
      const o = c.options.find(x => x.id === S.picks[id]);
      return '<div class="stage">' + gauges(true) + kicker(label + ' · carried') + '<h2>' + esc(c.title) + '</h2>' +
        '<div class="split"><div><p class="lead">' + esc(o.out) + '</p>' +
        (c.real ? '<div class="note"><span class="lab">This happened</span>' + esc(c.real) + '</div>' : '') + nextBtn() + '</div>' +
        '<div class="opts col locked">' + c.options.map((x, k) => '<div class="opt ' + (x.id === o.id ? 'won' : 'lost') + '"><span class="k">' + 'ABC'[k] + '</span><b>' + esc(x.label) + '</b></div>').join('') + '</div></div></div>';
    }
    const needs = o => (guard && guard.options.indexOf(o.id) >= 0) || o.unanimous;
    let ask = '';
    if (S.ask) {
      const o = c.options.find(x => x.id === S.ask);
      ask = '<div class="sheet" style="margin-top:1rem;border-color:var(--red)"><div class="lab red">“' + esc(o.label) + '” needs every minister’s vote</div>' +
        '<div class="btns" style="margin-top:.6rem"><button class="btn go" data-act="unanimous">It was unanimous</button><button class="btn" data-act="ask-no">It was not</button></div></div>';
    }
    return '<div class="stage">' + gauges(false) + kicker(label) + '<h2>' + esc(c.title) + '</h2>' +
      '<div class="split"><div><p class="lead">' + esc(c.text(S.f)) + '</p>' +
      (S.bill && S.phase === 'crisis' ? '<div class="note"><span class="lab">Quarter day</span>' + esc(D.META.bill) + ' ' + esc(gname(GID[0])) + ' −1.</div>' : '') +
      (guard ? '<div class="note" style="border-color:var(--red)"><span class="lab">The Charter</span>' + esc(guard.why) + '</div>' : '') +
      timerBox() + phraseStrip('cr' + id) + '</div>' +
      '<div><div class="opts col">' + c.options.map((o, k) => '<button class="opt" data-act="pick" data-id="' + o.id + '"><span class="k">' + 'ABC'[k] + '</span><b>' + esc(o.label) + '</b><span>' + esc(o.pitch) + '</span>' + fxLine(o.fx) + (needs(o) ? '<span class="lab red">Unanimous only</span>' : '') + '</button>').join('') + '</div>' + ask + '</div></div></div>';
  }
  function vEmergency() {
    const others = D.GAUGES.filter(g => g.id !== S.zero && S.g[g.id] > 0);
    return '<div class="stage">' + gauges(false) + '<div class="kicker"><span>State of emergency</span></div>' +
      '<h2 class="red">' + esc(gname(S.zero)) + ' has reached zero.</h2>' +
      '<p class="lead" style="margin-top:.8rem">To restore it to 2, the Council gives up two points of another gauge. One more emergency and the government falls.</p>' +
      '<div class="opts">' + others.map(g => '<button class="opt" data-act="sacrifice" data-id="' + g.id + '"><b>Give up ' + esc(g.name) + '</b>' + fxLine({ [g.id]: -2 }) + '</button>').join('') + '</div>' + timerBox() + '</div>';
  }
  function epilogueLines() {
    const band = v => v <= 2 ? 0 : v >= 7 ? 2 : 1;
    const lines = D.GAUGES.map(g => D.EPILOGUE[g.id][band(S.g[g.id])]);
    Object.keys(D.EPILOGUE.flags).forEach(k => { if (S.flags[k]) lines.push(D.EPILOGUE.flags[k]); });
    return lines;
  }
  function verdict() {
    const W = D.META.verdicts;
    if (S.fell) return W.fell;
    const low = Math.min.apply(null, D.GAUGES.map(g => S.g[g.id]));
    return low <= 0 ? W.dead : low <= 2 ? W.just : W.ok;
  }
  function vEpilogue() {
    return '<div class="stage narrow">' + gauges(false) + kicker('One year on') + '<h2>' + esc(verdict()) + '</h2>' +
      '<div class="sheet" style="margin-top:1.2rem"><ul class="plain">' + epilogueLines().map(l => '<li class="lead" style="max-width:none">' + esc(l) + '</li>').join('') + '</ul></div>' +
      nextBtn('Open the sealed briefs') + '</div>';
  }
  function scores() {
    const pf = D.portfoliosFor(S.room, S.n);
    return pf.map((p, i) => {
      const P = D.PORTFOLIOS[p], kept = P.promise.keeps.indexOf(S.picks[P.promise.crisis]) >= 0;
      return { name: S.names[i], i, P, kept, g: S.g[P.gauge], m: S.markers[i], total: S.g[P.gauge] + (kept ? 5 : 0) + S.markers[i] };
    });
  }
  function vReveal() {
    const rows = scores(), best = Math.max.apply(null, rows.map(r => r.total));
    const vacant = Object.keys(D.PORTFOLIOS).filter(p => D.portfoliosFor(S.room, S.n).indexOf(p) < 0);
    return '<div class="stage">' + kicker('The sealed briefs') + '<h2>Who was working for whom</h2>' +
      '<div class="sheet" style="margin-top:1.2rem"><table class="score"><tr><th>Minister</th><th>Gauge</th><th>Private promise</th><th>Markers kept</th><th></th></tr>' +
      rows.map(r => '<tr class="' + (r.total === best ? 'top' : '') + '"><td><b>' + esc(r.name) + '</b><br><span class="lab">' + esc(r.P.title) + '</span></td>' +
        '<td>' + esc(gname(r.P.gauge)) + ' <b>' + r.g + '</b></td>' +
        '<td>' + esc(r.P.promise.short) + ' <b class="' + (r.kept ? '' : 'red') + '">' + (r.kept ? 'Kept +5' : 'Broken') + '</b></td>' +
        '<td><button class="chip" data-act="m-" data-id="' + r.i + '">−</button> <b>' + r.m + '</b> <button class="chip" data-act="m+" data-id="' + r.i + '">+</button></td>' +
        '<td class="n">' + r.total + '</td></tr>').join('') + '</table>' +
      (vacant.length ? '<p class="dim" style="margin:.8rem 0 0">Nobody was minding ' + vacant.map(p => gname(D.PORTFOLIOS[p].gauge)).join(' or ') + '.</p>' : '') + '</div>' +
      nextBtn('Last ten minutes') + '</div>';
  }
  function vClose() {
    const writing = S.sub === 'read';
    return '<div class="stage narrow">' + kicker(writing ? 'On paper · optional' : 'Gems and slips') +
      (writing
        ? '<h2>Fifty words, in pencil.</h2><div class="sheet" style="margin-top:1.1rem"><ul class="plain">' + D.CLOSERS.map(c => '<li class="lead" style="max-width:none">' + esc(c) + '</li>').join('') + '</ul></div><p class="dim" style="margin-top:.8rem">Pick one. Read them aloud at the bell.</p>'
        : '<h2>What was said well, and what was not.</h2><div class="sheet" style="margin-top:1.1rem"><ol class="steps"><li>Each of you: one phrase somebody else used that you would steal.</li><li>Each of you: one slip you heard, said kindly, with the fix.</li><li>One word from tonight that you did not know this morning.</li></ol></div>') +
      timerBox() + nextBtn(writing ? 'Gems and slips' : 'Finish') + '</div>';
  }
  function vDone() {
    return '<div class="stage narrow center" style="padding-top:5rem"><h1>Council adjourned.</h1><div class="btns" style="justify-content:center"><button class="btn go" data-act="reset">New game</button><a class="btn" href="./">All games</a></div></div>';
  }

  function render() {
    const view = { setup: vSetup, rules: vRules, charter: vCharter, lots: vLots, crisis: vCrisis, reckoning: vCrisis, emergency: vEmergency, epilogue: vEpilogue, reveal: vReveal, close: vClose, done: vDone }[S.phase];
    app.innerHTML = view();
    const where = { setup: '', rules: 'Briefing', charter: 'Act I · The Charter', lots: 'The lots', crisis: 'Act II · The first year', emergency: 'Emergency', reckoning: 'Act III · The reckoning', epilogue: 'One year on', reveal: 'The record', close: 'Closing', done: '' }[S.phase];
    $('#where').textContent = where;
    $('#new').textContent = S.sure ? 'Sure?' : 'New game';
    $('#new').classList.toggle('hide', S.phase === 'setup');
    clock.loop();
    window.scrollTo(0, 0);
  }

  // ---------- flow ----------
  function afterOutcome() {
    const zero = D.GAUGES.map(g => g.id).find(id => S.g[id] <= 0);
    if (zero) {
      S.emergencies++;
      if (S.emergencies >= 2) { S.fell = true; S.phase = 'epilogue'; return; }
      S.zero = zero; S.phase = 'emergency'; setTimer(T.emergency); return;
    }
    advance();
  }
  function advance() {
    if (S.phase === 'emergency') S.phase = S.back || 'crisis';
    if (S.phase === 'crisis') {
      if (S.i < S.order.length - 1) {
        S.i++; S.sub = 'read'; S.turn++; S.bill = false; setTimer(T.crisis);
        if (D.BILLS.indexOf(S.i) >= 0) {
          // Quarter day: the wages fall due before this dispatch is read.
          S.g[GID[0]] = clamp(S.g[GID[0]] - 1); S.bill = true;
          if (S.g[GID[0]] <= 0) {
            S.emergencies++;
            if (S.emergencies >= 2) { S.fell = true; S.phase = 'epilogue'; return; }
            S.zero = GID[0]; S.back = 'crisis'; S.hold = true; S.phase = 'emergency'; setTimer(T.emergency);
          }
        }
      }
      else {
        const order = GID;
        S.reck = order.slice().sort((a, b) => S.g[a] - S.g[b] || order.indexOf(a) - order.indexOf(b))[0];
        S.phase = 'reckoning'; S.sub = 'read'; S.turn++; setTimer(T.crisis);
      }
    } else if (S.phase === 'reckoning') { S.phase = 'epilogue'; }
  }
  function resolve(optId) {
    const c = crisisDef(), id = S.phase === 'reckoning' ? 'reck' : S.order[S.i];
    const o = c.options.find(x => x.id === optId);
    S.picks[id] = o.id; if (o.flag) S.flags[o.flag] = true;
    apply(o.fx); S.sub = 'out'; S.ask = null; clock.pause(); K.beep('ok');
  }

  const acts = {
    begin() {
      const list = S.names.map(s => s.trim()).filter(Boolean);
      if (list.length < 3) { K.beep('no'); return; }
      S.names = list.concat(['', '', '', '']).slice(0, 4); S.n = list.length; S.started = Date.now(); S.phase = 'rules';
    },
    next() {
      S.delta = null;
      if (S.phase === 'rules') { S.phase = 'charter'; S.i = 0; S.sub = 'read'; setTimer(T.charter); }
      else if (S.phase === 'charter') {
        if (S.i < D.CHARTER.length - 1) { S.i++; S.sub = 'read'; S.turn++; setTimer(T.charter); }
        else { S.phase = 'lots'; }
      }
      else if (S.phase === 'lots') { S.order = D.orderFor(S.room); S.phase = 'crisis'; S.i = 0; S.sub = 'read'; S.turn++; setTimer(T.crisis); }
      else if (S.phase === 'crisis' || S.phase === 'reckoning') { S.back = S.phase; afterOutcome(); }
      else if (S.phase === 'epilogue') { S.phase = 'reveal'; }
      else if (S.phase === 'reveal') { S.phase = 'close'; S.sub = 'read'; setTimer(T.write); }
      else if (S.phase === 'close') { if (S.sub === 'read') { S.sub = 'review'; setTimer(T.review); } else { S.phase = 'done'; } }
    },
    charter(id) {
      const a = D.CHARTER[S.i], o = a.options.find(x => x.id === id);
      S.f[a.id] = o.id; apply(o.fx); S.sub = 'out'; clock.pause(); K.beep('ok');
    },
    pick(id) {
      if (S.sub !== 'read') return;
      const c = crisisDef(), guard = c.guard ? c.guard(S.f) : null, o = c.options.find(x => x.id === id);
      if ((guard && guard.options.indexOf(id) >= 0) || o.unanimous) { S.ask = id; return; }
      resolve(id);
    },
    unanimous() { if (S.ask) resolve(S.ask); },
    'ask-no'() { S.ask = null; },
    sacrifice(id) {
      S.g[id] = clamp(S.g[id] - 2); S.g[S.zero] = 2; S.zero = null; S.delta = null;
      const again = D.GAUGES.map(g => g.id).find(x => S.g[x] <= 0);
      if (again) { S.emergencies++; if (S.emergencies >= 2) { S.fell = true; S.phase = 'epilogue'; return; } S.zero = again; setTimer(T.emergency); return; }
      if (S.hold) { S.hold = false; S.phase = S.back; setTimer(T.crisis); return; }
      advance();
    },
    't-go'() { const t = S.timer || {}; if (t.left === t.total) clock.start(t.total); else clock.resume(); },
    't-pause'() { clock.pause(); },
    't-add'() { clock.add(60); },
    'm+'(id) { S.markers[id] = Math.min(8, S.markers[id] + 1); },
    'm-'(id) { S.markers[id] = Math.max(0, S.markers[id] - 1); },
    reset() { clock.stop(); S = fresh(); }
  };

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const fn = acts[el.dataset.act]; if (!fn) return;
    S.sure = false; fn(el.dataset.id); save(); render();
  });
  document.addEventListener('input', e => {
    const el = e.target.closest('[data-name]'); if (!el) return;
    S.names[Number(el.dataset.name)] = el.value; save();
  });
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') { if (e.key === 'Enter') { const b = $('[data-next]'); if (b) b.click(); } return; }
    if (e.key === 'ArrowRight' || e.key === 'Enter') { const b = $('[data-next]'); if (b) { e.preventDefault(); b.click(); } }
    if (e.key === ' ') { const b = $('[data-act="t-go"]') || $('[data-act="t-pause"]'); if (b) { e.preventDefault(); b.click(); } }
    if (e.key === 'f') K.fullscreen();
  });
  $('#new').addEventListener('click', () => { if (S.sure) { clock.stop(); S = fresh(); } else { S.sure = true; } save(); render(); });
  $('#full').addEventListener('click', K.fullscreen);

  $('#tag').textContent = V === 'class' ? 'Class' : 'Rehearsal';
  $('#tag').className = 'tag ' + V;
  K.keepAwake();
  K.sessionClock(() => S.started, 90);
  render();
})();

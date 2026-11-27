/* The Council — host screen. */
(function () {
  'use strict';
  const D = window.COUNCIL, K = window.K, $ = K.$, esc = K.esc;
  const V = K.variant();
  const LS = K.store('parley.council.v2.' + V);
  const GID = D.GAUGES.map(g => g.id);
  const app = $('#app');
  const T = { charter: 240, crisis: 180, emergency: 90, write: 360, review: 300 };
  // Minutes: one dispatch from reading to outcome; the reckoning, epilogue, scores and language review together; the optional writing.
  const PACE = { dispatch: 6, ending: 16, write: 6 };
  const INTRO_STEPS = 4;   // the story, the gauges, how the Council decides, the Charter
  let S = LS.get(), showCharter = false;

  function fresh() {
    return {
      v: 1, room: K.newCode(5), names: ['', '', '', ''], n: 0, phase: 'setup', i: 0, sub: 'read', turn: 0,
      g: GID.reduce((o, id) => { o[id] = 5; return o; }, {}), f: {}, flags: {}, picks: {}, order: [], reck: null,
      emergencies: 0, fell: false, zero: null, timer: null, started: 0, delta: null, ask: null, markers: [2, 2, 2, 2], sure: false, bill: false, hold: false,
      len: 90, cut: 0, veil: [], amended: 0
    };
  }
  if (!S || S.v !== 1 || !S.g || GID.some(id => S.g[id] == null)) S = fresh();
  if (!S.len) S.len = 90;
  if (!S.veil) S.veil = [];
  if (!S.amended) S.amended = 0;
  const save = () => LS.set(S);

  const clock = K.Countdown({ id: 'main', get: () => S.timer, set: t => { S.timer = t; save(); } });
  const setTimer = sec => { S.timer = { left: sec, running: false, total: sec }; };

  // ---------- small pieces ----------
  const names = () => S.names.slice(0, S.n);
  const chair = () => names()[S.turn % S.n] || '';
  const gname = id => D.GAUGES.find(g => g.id === id).name;
  const signed = () => D.CHARTER.every(a => S.f[a.id]);
  function clamp(v) { return Math.max(0, Math.min(10, v)); }
  function apply(fx) {
    const d = {};
    Object.keys(fx || {}).forEach(k => { const before = S.g[k]; S.g[k] = clamp(before + fx[k]); d[k] = S.g[k] - before; });
    S.delta = d;
  }
  function segs(v) { let s = ''; for (let i = 1; i <= 10; i++) s += '<i class="' + (i <= v ? 'on' : '') + '"></i>'; return s; }
  function gauges(showDelta) {
    return '<div class="gauges">' + D.GAUGES.map(g => {
      const v = S.g[g.id], d = showDelta && S.delta ? (S.delta[g.id] || 0) : 0;
      const dd = d ? '<span class="d ' + (d > 0 ? 'up' : 'down') + '">' + (d > 0 ? '+' : '−') + Math.abs(d) + '</span>' : '';
      return '<div class="gauge' + (v <= 2 ? ' low' : '') + '"><div class="top"><span class="lab">' + esc(g.name) + '</span><span><span class="v">' + v + '</span>' + dd + '</span></div><div class="segs">' + segs(v) + '</div></div>';
    }).join('') + '</div>';
  }
  function fxLine(fx) {
    return '<div class="fx">' + Object.keys(fx || {}).filter(k => fx[k]).map(k =>
      '<span class="' + (fx[k] > 0 ? 'up' : 'down') + '">' + esc(gname(k)) + ' ' + (fx[k] > 0 ? '▲' : '▼').repeat(Math.abs(fx[k])) + '</span>').join('') + '</div>';
  }
  const hiddenFx = '<div class="fx"><span class="q">??????????</span></div>';
  function timerBox() {
    const t = S.timer || {};
    const ctl = !t.running
      ? '<button class="btn y" data-act="t-go">' + (t.left === t.total ? 'Start the clock' : 'Resume') + '</button>'
      : '<button class="btn" data-act="t-pause">Pause</button>';
    return '<div class="btns"><span class="timer s" data-timer="main">' + K.fmt(clock.left()) + '</span>' + ctl + '<button class="btn ghost" data-act="t-add">+ 1 min</button></div>';
  }
  function phraseStrip(key) {
    return '<div class="phrases"><span class="lab">Phrases to try</span>' + K.phrases(S.room + key, 3).map(p => '<q>' + esc(p) + '</q>').join('') + '</div>';
  }
  function kicker(text, role) {
    return '<div class="kicker"><span>' + esc(text) + '</span><span class="who">' + (role || 'Chair') + ': ' + esc(chair()) + '</span></div>';
  }
  const nextBtn = (label, act) => '<div class="btns"><button class="btn go" data-act="' + (act || 'next') + '" data-next>' + esc(label || 'Next') + ' →</button></div>';
  const charterCode = () => D.CHARTER.map(a => S.f[a.id]).join('.');
  const seatLink = i => K.seatUrl('council', S.room, i, S.n, { c: charterCode() });
  function charterDoc() {
    const C = D.INTRO.charter;
    return '<div class="doc charter"><h4>' + esc(C.title) + '<em>' + esc(C.date) + '</em></h4>' +
      D.CHARTER.filter(a => S.f[a.id]).map(a => '<p><b>' + esc(a.title) + '.</b> ' + esc(a.options.find(o => o.id === S.f[a.id]).law) + '</p>').join('') +
      (signed() ? '<p class="sig">Signed by ' + names().map(esc).join(', ') + '</p>' : '') + '</div>';
  }

  // ---------- screens ----------
  function vSetup() {
    const inputs = [0, 1, 2, 3].map(i =>
      '<input type="text" maxlength="14" data-name="' + i + '" placeholder="' + (i < 3 ? 'Name' : 'Name (optional)') + '" value="' + esc(S.names[i]) + '">').join('');
    return '<div class="stage narrow"><div class="kicker"><span>90 minutes · 3 or 4 players</span></div><h1>The Council</h1>' +
      '<p class="lead" style="margin-top:1rem">' + esc(D.META.lead) + '</p>' +
      '<div class="sheet" style="margin-top:1.4rem"><div class="lab" style="margin-bottom:.6rem">Who is at the table, in seating order</div><div class="row">' + inputs + '</div>' +
      '<div class="lab" style="margin:1rem 0 .6rem">Minutes available</div><div class="row"><input type="number" min="45" max="180" step="5" data-len value="' + esc(S.len) + '" style="flex:0 0 7rem"></div>' +
      '<div class="btns"><button class="btn go" data-act="begin" data-next>Begin →</button><a class="btn ghost" href="print.html?g=council&v=' + V + '" target="_blank">Print the minister’s sheet</a></div></div></div>';
  }
  function gaugeCard(g) {
    return '<div class="gcard"><div class="gauge"><div class="top"><span class="lab">' + esc(g.name) + '</span><span class="v">5</span></div><div class="segs">' + segs(5) + '</div></div>' +
      '<p>' + esc(g.what) + '</p><dl><dt>At 10</dt><dd>' + esc(g.high) + '</dd><dt>At 0</dt><dd>' + esc(g.zero) + '</dd></dl></div>';
  }
  function vRules() {
    const I = D.INTRO;
    if (S.i === 0) {
      return '<div class="stage">' + kicker(I.place, 'Reads aloud') + '<h2>' + esc(I.headline) + '</h2>' +
        '<div class="split"><div>' + I.story.map(p => '<p class="lead">' + esc(p) + '</p>').join('') + nextBtn('The four gauges') + '</div>' +
        '<div class="doc"><h4>' + esc(I.sheet) + '</h4><table>' + I.facts.map(f => '<tr><th>' + esc(f[0]) + '</th><td>' + esc(f[1]) + '</td></tr>').join('') + '</table></div></div></div>';
    }
    if (S.i === 1) {
      return '<div class="stage">' + kicker('The gauges', 'Reads aloud') + '<h2>Four gauges show how the country is doing.</h2>' +
        '<div class="gcards">' + D.GAUGES.map(gaugeCard).join('') + '</div>' +
        '<p class="lead" style="margin-top:1.2rem">Each one runs from 0 to 10 and starts at 5. Almost every decision you take will push some of them up and others down.</p>' +
        nextBtn('How the Council decides') + '</div>';
    }
    if (S.i === 2) {
      return '<div class="stage narrow">' + kicker('The Council', 'Reads aloud') + '<h2>How the Council decides</h2>' +
        '<div class="sheet" style="margin-top:1.2rem"><ol class="steps big">' + D.RULES.map(r => '<li>' + esc(r) + '</li>').join('') + '</ol></div>' + nextBtn('The Charter') + '</div>';
    }
    return '<div class="stage narrow">' + kicker('Act I', 'Reads aloud') + '<h2>The Charter comes first.</h2>' +
      '<p class="lead" style="margin-top:1rem">' + esc(I.charter.lead) + '</p>' +
      '<div class="sheet" style="margin-top:1.2rem"><ul class="plain">' + I.charter.points.map(p => '<li class="lead" style="max-width:none">' + esc(p) + '</li>').join('') + '</ul></div>' +
      nextBtn('Article 1') + '</div>';
  }
  function vCharter() {
    const a = D.CHARTER[S.i];
    if (S.sub === 'out') {
      const o = a.options.find(x => x.id === S.f[a.id]);
      return '<div class="stage">' + gauges(true) + kicker('Charter · ' + a.title + ' adopted') + '<h2>' + esc(a.question) + '</h2>' +
        '<div class="sheet" style="margin-top:1.1rem"><div class="lab">The Charter now says</div><p class="lead" style="margin:.3rem 0 0"><b>' + esc(a.title) + '.</b> ' + esc(o.law) + '</p></div>' +
        nextBtn(S.i < D.CHARTER.length - 1 ? 'Next article' : 'Sign the Charter') + '</div>';
    }
    return '<div class="stage">' + gauges(false) + kicker('Charter · ' + a.title + ' of ' + D.CHARTER.length) + '<h2>' + esc(a.question) + '</h2>' +
      '<div class="split"><div><p class="lead">' + esc(a.text) + '</p>' + timerBox() + phraseStrip('ch' + S.i) + '</div>' +
      '<div class="opts col">' + a.options.map((o, k) => '<button class="opt" data-act="charter" data-id="' + o.id + '"><span class="k">' + 'ABC'[k] + '</span><b>' + esc(o.label) + '</b><span>' + esc(o.pitch) + '</span>' + fxLine(o.fx) + '</button>').join('') + '</div></div></div>';
  }
  function vSigned() {
    return '<div class="stage narrow">' + kicker('Act I · The Charter', 'Reads aloud') + '<h2>The Charter is signed.</h2>' +
      '<div style="margin-top:1.2rem">' + charterDoc() + '</div>' +
      '<p class="lead" style="margin-top:1.2rem">From now on it binds you. The Council can only go against an article if every minister agrees.</p>' +
      nextBtn('Hand out the ministries') + '</div>';
  }
  function vLots() {
    const pf = D.portfoliosFor(S.room, S.n);
    const seats = names().map((nm, i) => '<div class="seat"><h3>' + esc(nm) + '</h3><div class="qr">' + K.qrSvg(seatLink(i)) + '</div>' + (V === 'rehearsal' ? '<a class="lab" target="_blank" href="' + esc(seatLink(i)) + '">Open in a new tab</a>' : '') + '</div>').join('');
    return '<div class="stage"><div class="kicker"><span>The ministries</span></div><h2>Now find out which ministry is yours.</h2>' +
      '<p class="lead" style="margin:.8rem 0 1.2rem">Scan the QR code under your name and read what it says. Do not show it to anybody, and put your phone face down when you have finished.</p>' +
      '<div class="seats">' + seats + '</div>' +
      '<details><summary>No phone?</summary><p class="dim" style="margin-top:.5rem">Open this link on any device, replacing SEAT with a number from 0 to ' + (pf.length - 1) + ': ' + esc(seatLink(0).replace('s=0', 's=SEAT')) + '</p></details>' +
      nextBtn('First dispatch') + '</div>';
  }
  function crisisDef() { return S.phase === 'reckoning' ? D.RECKONING[S.reck] : D.CRISES[S.order[S.i]]; }
  function vCrisis() {
    const c = crisisDef(), id = S.phase === 'reckoning' ? 'reck' : S.order[S.i];
    const label = S.phase === 'reckoning' ? 'The reckoning' : 'Dispatch ' + (S.i + 1) + ' of ' + S.order.length;
    const guard = c.guard ? c.guard(S.f) : null;
    if (S.sub === 'out') {
      const o = c.options.find(x => x.id === S.picks[id]);
      return '<div class="stage">' + gauges(true) + kicker(label + ' · decided') + '<h2>' + esc(c.title) + '</h2>' +
        '<div class="split"><div><p class="lead">' + esc(o.out) + '</p>' +
        (c.real ? '<div class="note"><span class="lab">What really happened</span>' + esc(c.real) + '</div>' : '') + nextBtn() + '</div>' +
        '<div class="opts col locked">' + c.options.map((x, k) => '<div class="opt ' + (x.id === o.id ? 'won' : 'lost') + '"><span class="k">' + 'ABC'[k] + '</span><b>' + esc(x.label) + '</b></div>').join('') + '</div></div></div>';
    }
    const needs = o => (guard && guard.options.indexOf(o.id) >= 0) || o.unanimous;
    const hidden = o => S.phase === 'crisis' && S.veil.indexOf(id + ':' + o.id) >= 0;
    let ask = '';
    if (S.ask) {
      const o = c.options.find(x => x.id === S.ask);
      ask = '<div class="sheet" style="margin-top:1rem;border-color:var(--red)"><div class="lab red">“' + esc(o.label) + '” needs every minister’s vote</div>' +
        '<div class="btns" style="margin-top:.6rem"><button class="btn go" data-act="unanimous">Everyone voted for it</button><button class="btn" data-act="ask-no">Not everyone did</button></div></div>';
    }
    return '<div class="stage">' + gauges(false) + kicker(label) + '<h2>' + esc(c.title) + '</h2>' +
      '<div class="split"><div><p class="lead">' + esc(c.text(S.f)) + '</p>' +
      (S.bill && S.phase === 'crisis' ? '<div class="note"><span class="lab">Quarter day</span>' + esc(D.META.bill) + ' ' + esc(gname(GID[0])) + ' −1.</div>' : '') +
      (S.cut && S.i > 0 && S.phase === 'crisis' ? '<div class="note"><span class="lab">The clock</span>There is not enough time left for every dispatch, so ' + (S.cut === 1 ? 'one has' : S.cut + ' have') + ' been dropped.</div>' : '') +
      (guard ? '<div class="note"' + (guard.options.length ? ' style="border-color:var(--red)"' : '') + '><span class="lab">The Charter</span>' + esc(guard.why) + '</div>' : '') +
      timerBox() + phraseStrip('cr' + id) + '</div>' +
      '<div><div class="opts col">' + c.options.map((o, k) => '<button class="opt" data-act="pick" data-id="' + o.id + '"><span class="k">' + 'ABC'[k] + '</span><b>' + esc(o.label) + '</b><span>' + esc(o.pitch) + '</span>' + (hidden(o) ? hiddenFx : fxLine(o.fx)) + (needs(o) ? '<span class="lab red">Needs every vote</span>' : '') + '</button>').join('') + '</div>' + ask + '</div></div></div>';
  }
  function vEmergency() {
    const others = D.GAUGES.filter(g => g.id !== S.zero && S.g[g.id] >= 2);
    const said = !S.fell ? 'If there is a second emergency, the government falls.'
      : S.emergencies === 2 ? 'This is the second emergency, and the government has fallen. You stay on as caretakers until the end of the year.'
      : 'The caretaker government has another emergency to deal with.';
    return '<div class="stage">' + gauges(false) + '<div class="kicker"><span>State of emergency</span></div>' +
      '<h2 class="red">' + esc(gname(S.zero)) + ' has fallen to zero.</h2>' +
      '<p class="lead" style="margin-top:.8rem">The Council must give up two points of another gauge to bring it back to 2. ' + said + '</p>' +
      '<div class="opts">' + (others.length
        ? others.map(g => '<button class="opt" data-act="sacrifice" data-id="' + g.id + '"><b>Give up ' + esc(g.name) + '</b>' + fxLine({ [g.id]: -Math.min(2, S.g[g.id] - 1) }) + '</button>').join('')
        : '<button class="opt" data-act="sacrifice" data-id=""><b>No other gauge has anything to give</b></button>') + '</div>' + timerBox() + '</div>';
  }
  function epilogueLines() {
    const band = v => v <= 2 ? 0 : v >= 7 ? 2 : 1;
    const lines = D.GAUGES.map(g => D.EPILOGUE[g.id][band(S.g[g.id])]);
    lines.push(D.META.charterLine(S.amended));
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
      nextBtn('Reveal the ministries') + '</div>';
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
    return '<div class="stage">' + kicker('The ministries') + '<h2>What each minister had promised</h2>' +
      '<div class="sheet" style="margin-top:1.2rem"><table class="score"><tr><th>Minister</th><th>Gauge</th><th>Promise</th><th>Markers left</th><th>Total</th></tr>' +
      rows.map(r => '<tr class="' + (r.total === best ? 'top' : '') + '"><td><b>' + esc(r.name) + '</b><br><span class="lab">' + esc(r.P.title) + '</span></td>' +
        '<td>' + esc(gname(r.P.gauge)) + ' <b>' + r.g + '</b></td>' +
        '<td>' + esc(r.P.promise.short) + ' <b class="' + (r.kept ? '' : 'red') + '">' + (r.kept ? 'Kept, +5' : 'Not kept') + '</b></td>' +
        '<td><button class="chip" data-act="m-" data-id="' + r.i + '">−</button> <b>' + r.m + '</b> <button class="chip" data-act="m+" data-id="' + r.i + '">+</button></td>' +
        '<td class="n">' + r.total + '</td></tr>').join('') + '</table>' +
      (vacant.length ? '<p class="dim" style="margin:.8rem 0 0">Gauge with no minister: ' + vacant.map(p => esc(gname(D.PORTFOLIOS[p].gauge))).join(', ') + '</p>' : '') + '</div>' +
      nextBtn('Last ten minutes') + '</div>';
  }
  function vClose() {
    const writing = S.sub === 'read';
    return '<div class="stage narrow">' + kicker(writing ? 'On paper · optional' : 'Language') +
      (writing
        ? '<h2>Fifty words, in pencil</h2><div class="sheet" style="margin-top:1.1rem"><ul class="plain">' + D.CLOSERS.map(c => '<li class="lead" style="max-width:none">' + esc(c) + '</li>').join('') + '</ul></div><p class="dim" style="margin-top:.8rem">Choose one. When the time is up, read them out.</p>'
        : '<h2>The English you heard today</h2><div class="sheet" style="margin-top:1.1rem"><ol class="steps big"><li>Each of you names one phrase somebody else used that you would like to use yourself.</li><li>Each of you mentions one mistake you heard and says how to put it right.</li><li>Each of you gives one word you learned today.</li></ol></div>') +
      timerBox() + nextBtn(writing ? 'Language' : 'Finish') + '</div>';
  }
  function vDone() {
    return '<div class="stage narrow center" style="padding-top:5rem"><h1>The Council is adjourned.</h1><div class="btns" style="justify-content:center"><button class="btn go" data-act="reset">New game</button><a class="btn" href="./">All games</a></div></div>';
  }

  function render() {
    const view = { setup: vSetup, rules: vRules, charter: vCharter, signed: vSigned, lots: vLots, crisis: vCrisis, reckoning: vCrisis, emergency: vEmergency, epilogue: vEpilogue, reveal: vReveal, close: vClose, done: vDone }[S.phase];
    const canShow = signed() && ['setup', 'rules', 'charter', 'signed', 'done'].indexOf(S.phase) < 0;
    if (!canShow) showCharter = false;
    app.innerHTML = view() + (showCharter ? '<div class="veil" data-act="charter-toggle">' + charterDoc() + '</div>' : '');
    const where = { setup: '', rules: 'Briefing', charter: 'Act I · The Charter', signed: 'Act I · The Charter', lots: 'The ministries', crisis: 'Act II · The first year', emergency: 'Emergency', reckoning: 'Act III · The reckoning', epilogue: 'One year on', reveal: 'The scores', close: 'Closing', done: '' }[S.phase];
    $('#where').textContent = where;
    $('#new').textContent = S.sure ? 'Sure?' : 'New game';
    $('#new').classList.toggle('hide', S.phase === 'setup');
    $('#charter').classList.toggle('hide', !canShow);
    clock.loop();
    if (!showCharter) window.scrollTo(0, 0);
  }

  // ---------- flow ----------
  function alarm(id) {
    // A gauge has reached zero. The second time, the government falls; the year is played out all the same.
    S.emergencies++; if (S.emergencies >= 2) S.fell = true;
    S.zero = id; S.phase = 'emergency'; setTimer(T.emergency);
  }
  function live() { const m = (Date.now() - S.started) / 60000; return m <= S.len + 30 ? m : null; }
  function fit() {
    // As dispatch S.i is about to be read: set aside later dispatches that no longer fit in the session.
    // Never the opening one, never one that a minister at the table has a promise on.
    S.cut = 0;
    const mins = live(); if (mins == null) return;   // an old saved game, not a session in progress
    const kept = [D.FIRST].concat(D.portfoliosFor(S.room, S.n).map(p => D.PORTFOLIOS[p].promise.crisis));
    while (mins + (S.order.length - S.i) * PACE.dispatch + PACE.ending > S.len) {
      let k = -1;
      for (let j = S.order.length - 1; j > S.i; j--) if (kept.indexOf(S.order[j]) < 0) { k = j; break; }
      if (k < 0) break;
      S.order.splice(k, 1); S.cut++;
    }
  }
  function veilFor(order) {
    // Two options in the year show question marks instead of their effects: one in a dispatch somebody
    // has a promise on, one in another dispatch. Never in the opening dispatch.
    const r = K.rng(S.room + ':veil');
    const keys = list => [].concat.apply([], list.map(id => D.CRISES[id].options.map(o => id + ':' + o.id)));
    const one = list => { const all = keys(list); return all[Math.floor(r() * all.length)]; };
    const promised = order.filter(id => D.PROMISE_CRISES.indexOf(id) >= 0);
    const rest = order.filter(id => id !== D.FIRST && D.PROMISE_CRISES.indexOf(id) < 0);
    return [one(promised), one(rest)].filter(Boolean);
  }
  function afterOutcome() {
    const zero = GID.find(id => S.g[id] <= 0);
    if (zero) { alarm(zero); return; }
    advance();
  }
  function advance() {
    if (S.phase === 'emergency') S.phase = S.back || 'crisis';
    if (S.phase === 'crisis') {
      if (S.i < S.order.length - 1) {
        S.i++; S.sub = 'read'; S.turn++; S.bill = false; setTimer(T.crisis); fit();
        if (D.BILLS.indexOf(S.i) >= 0) {
          // Quarter day: the wages fall due before this dispatch is read.
          S.g[GID[0]] = clamp(S.g[GID[0]] - 1); S.bill = true;
          if (S.g[GID[0]] <= 0) { S.back = 'crisis'; S.hold = true; alarm(GID[0]); }
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
      S.names = list.concat(['', '', '', '']).slice(0, 4); S.n = list.length; S.started = Date.now(); S.phase = 'rules'; S.i = 0;
      S.len = Math.max(45, Math.min(180, Math.round(Number(S.len)) || 90));
    },
    next() {
      S.delta = null;
      if (S.phase === 'rules') {
        if (S.i < INTRO_STEPS - 1) { S.i++; S.turn++; }
        else { S.phase = 'charter'; S.i = 0; S.sub = 'read'; S.turn++; setTimer(T.charter); }
      }
      else if (S.phase === 'charter') {
        if (S.i < D.CHARTER.length - 1) { S.i++; S.sub = 'read'; S.turn++; setTimer(T.charter); }
        else { S.phase = 'signed'; S.turn++; }
      }
      else if (S.phase === 'signed') { S.phase = 'lots'; }
      else if (S.phase === 'lots') { S.order = D.orderFor(S.room); S.phase = 'crisis'; S.i = 0; S.sub = 'read'; S.turn++; setTimer(T.crisis); fit(); S.veil = veilFor(S.order); }
      else if (S.phase === 'crisis' || S.phase === 'reckoning') { S.back = S.phase; afterOutcome(); }
      else if (S.phase === 'epilogue') { S.phase = 'reveal'; }
      else if (S.phase === 'reveal') {
        // The writing is optional: with too little of the session left, go straight to the language review.
        const mins = live(), late = mins != null && mins + PACE.write + T.review / 60 > S.len + 2;
        S.phase = 'close'; S.sub = late ? 'review' : 'read'; setTimer(late ? T.review : T.write);
      }
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
    unanimous() {
      if (!S.ask) return;
      const c = crisisDef(), guard = c.guard ? c.guard(S.f) : null;
      if (guard && guard.options.indexOf(S.ask) >= 0) S.amended++;   // the Council has gone against its own Charter
      resolve(S.ask);
    },
    'ask-no'() { S.ask = null; },
    sacrifice(id) {
      // The gauge given up never drops below 1, so paying for one emergency cannot start another.
      if (id) S.g[id] = Math.max(1, S.g[id] - 2);
      S.g[S.zero] = 2; S.zero = null; S.delta = null;
      const again = GID.find(x => S.g[x] <= 0);   // two gauges reached zero in the same vote
      if (again) { alarm(again); return; }
      if (S.hold) { S.hold = false; S.phase = S.back; setTimer(T.crisis); return; }
      advance();
    },
    'charter-toggle'() { showCharter = !showCharter; },
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
    const len = e.target.closest('[data-len]'); if (len) { S.len = len.value; save(); return; }
    const el = e.target.closest('[data-name]'); if (!el) return;
    S.names[Number(el.dataset.name)] = el.value; save();
  });
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') { if (e.key === 'Enter') { const b = $('[data-next]'); if (b) b.click(); } return; }
    if (showCharter) { if (e.key === 'Escape' || e.key === 'c' || e.key === 'Enter') { showCharter = false; render(); } return; }
    if (e.key === 'ArrowRight' || e.key === 'Enter') { const b = $('[data-next]'); if (b) { e.preventDefault(); b.click(); } }
    if (e.key === ' ') { const b = $('[data-act="t-go"]') || $('[data-act="t-pause"]'); if (b) { e.preventDefault(); b.click(); } }
    if (e.key === 'f') K.fullscreen();
    if (e.key === 'c' && !$('#charter').classList.contains('hide')) { showCharter = true; render(); }
  });
  $('#new').addEventListener('click', () => { if (S.sure) { clock.stop(); S = fresh(); } else { S.sure = true; } save(); render(); });
  $('#full').addEventListener('click', K.fullscreen);
  $('#charter').addEventListener('click', () => { showCharter = !showCharter; render(); });

  $('#tag').textContent = V === 'class' ? 'Class' : 'Rehearsal';
  $('#tag').className = 'tag ' + V;
  K.keepAwake();
  K.sessionClock(() => S.started, () => S.len);
  render();
})();

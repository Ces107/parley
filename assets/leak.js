/* The Leak — host screen. */
(function () {
  'use strict';
  const D = window.LEAK, K = window.K, $ = K.$, esc = K.esc;
  const V = K.variant(), M = D.META;
  const LS = K.store('parley.leak.v2.' + V);
  const app = $('#app');
  const T = { read: 300, statement: 210, round: 540, accuse: 120, card: 210, write: 360, review: 300 };
  let S = LS.get();

  function fresh() {
    return { v: 1, room: K.newCode(5), names: ['', '', '', ''], n: 0, phase: 'setup', i: 0, timer: null, started: 0,
      show: [], hint: 0, acc: {}, out: {}, votes: {}, sub: 'write', sure: false };
  }
  if (!S || S.v !== 1) S = fresh();
  const save = () => LS.set(S);
  const clock = K.Countdown({ id: 'main', get: () => S.timer, set: t => { S.timer = t; save(); } });
  const setTimer = sec => { S.timer = { left: sec, running: false, total: sec }; };

  const names = () => S.names.slice(0, S.n);
  const cast = () => D.castFor(S.room, S.n);
  const kick = (a, b) => '<div class="kicker"><span>' + esc(a) + '</span>' + (b ? '<span class="who">' + esc(b) + '</span>' : '') + '</div>';
  const nextBtn = (label, act) => '<div class="btns"><button class="btn go" data-act="' + (act || 'next') + '" data-next>' + esc(label || 'Next') + ' →</button></div>';
  function timerBox(extra) {
    const t = S.timer || {};
    const ctl = !t.running ? '<button class="btn y" data-act="t-go">' + (t.left === t.total ? 'Start the clock' : 'Resume') + '</button>' : '<button class="btn" data-act="t-pause">Pause</button>';
    return '<div class="btns"><span class="timer s" data-timer="main">' + K.fmt(clock.left()) + '</span>' + ctl + '<button class="btn ghost" data-act="t-add">+ 1 min</button>' + (extra || '') + '</div>';
  }
  const docHtml = x => '<div class="doc"><h4><span>Exhibit ' + x.id + ' · ' + esc(x.title) + '</span><em>' + esc(x.tag) + '</em></h4>' + x.html + '</div>';
  const list = (arr, cls) => '<ol class="steps">' + arr.map(r => '<li class="' + (cls || '') + '">' + esc(r) + '</li>').join('') + '</ol>';

  // ---------- screens ----------
  function vSetup() {
    const inputs = [0, 1, 2, 3].map(i => '<input type="text" maxlength="14" data-name="' + i + '" placeholder="' + (i < 3 ? 'Name' : 'Name (optional)') + '" value="' + esc(S.names[i]) + '">').join('');
    return '<div class="stage narrow">' + kick('90 minutes · 3 or 4 players') + '<h1>The Leak</h1>' +
      '<p class="lead" style="margin-top:1rem">' + esc(M.lead) + '</p>' +
      '<div class="sheet" style="margin-top:1.4rem"><div class="lab" style="margin-bottom:.6rem">Who is at the table, in seating order</div><div class="row">' + inputs + '</div>' +
      '<div class="btns"><button class="btn go" data-act="begin" data-next>Begin →</button><a class="btn ghost" href="print.html?g=leak&v=' + V + '" target="_blank">Print notebook and exhibits</a></div></div></div>';
  }
  function vPremise() {
    return '<div class="stage narrow">' + kick(M.when) + '<h2>' + esc(M.place) + '</h2>' +
      '<div class="sheet" style="margin-top:1.2rem">' + D.PREMISE.map(p => '<p class="lead" style="max-width:none">' + esc(p) + '</p>').join('') + '</div>' + nextBtn('The rules') + '</div>';
  }
  function vRules() {
    return '<div class="stage narrow">' + kick('How it works') + '<h2>The rules</h2><div class="sheet" style="margin-top:1.2rem">' + list(D.RULES) + '</div>' + nextBtn('Hand out the briefs') + '</div>';
  }
  function vBriefs() {
    const seats = names().map((nm, i) => '<div class="seat"><h3>' + esc(nm) + '</h3><div class="qr">' + K.qrSvg(K.seatUrl('leak', S.room, i, S.n)) + '</div>' + (V === 'rehearsal' ? '<a class="lab" target="_blank" href="' + esc(K.seatUrl('leak', S.room, i, S.n)) + '">Open in a new tab</a>' : '') + '</div>').join('');
    return '<div class="stage">' + kick('Private briefs') + '<h2>Scan your own code. Read in silence.</h2>' +
      '<p class="lead" style="margin:.8rem 0 1.2rem">Five minutes. Keep the phone to yourself; you may look at it again whenever you like.</p><div class="seats">' + seats + '</div>' +
      timerBox() + nextBtn('Statements') + '</div>';
  }
  function vStatements() {
    const away = S.n < 4 && S.i === 0;
    if (away) {
      return '<div class="stage narrow">' + kick('One chair is empty') + '<h2>' + esc(M.awayTitle) + '</h2>' +
        '<div class="doc" style="margin-top:1.2rem"><h4><span>' + esc(M.awayTag[0]) + '</span><em>' + esc(M.awayTag[1]) + '</em></h4>' + D.AWAY.map(p => '<p>' + esc(p) + '</p>').join('') + '</div>' + nextBtn('First statement') + '</div>';
    }
    const k = S.n < 4 ? S.i - 1 : S.i, c = D.CAST[cast()[k]];
    return '<div class="stage narrow">' + kick('Statement ' + (k + 1) + ' of ' + S.n, names()[k]) + '<h2>' + esc(c.name) + '</h2><div class="lab" style="margin-top:.3rem">' + esc(c.job) + '</div>' +
      '<div class="sheet" style="margin-top:1.2rem">' + list(M.prompts) + '</div>' +
      '<p class="dim" style="margin-top:.8rem">Two minutes to speak, then questions from the others.</p>' + timerBox() + nextBtn(k < S.n - 1 ? 'Next statement' : 'The paper trail') + '</div>';
  }
  function released() { return D.EXHIBITS.filter(x => x.round <= S.i + 1); }
  function vRound() {
    const r = D.ROUNDS[S.i];
    const chips = released().map(x => '<button class="chip ' + (S.show.indexOf(x.id) >= 0 ? 'on' : '') + '" data-act="show" data-id="' + x.id + '">' + x.id + ' · ' + esc(x.title) + '</button>').join('');
    const docs = D.EXHIBITS.filter(x => S.show.indexOf(x.id) >= 0).map(docHtml).join('');
    const hints = r.hints.slice(0, S.hint).map(h => '<div class="note"><span class="lab">Hint</span>' + esc(h) + '</div>').join('');
    const hintBtn = S.hint < r.hints.length ? '<button class="btn ghost" data-act="hint">Hint ' + (S.hint + 1) + ' of 3</button>' : '';
    return '<div class="stage">' + kick('Paper trail · round ' + r.n + ' of 3', r.title) + '<h2>' + esc(r.ask) + '</h2>' +
      '<div class="chips" style="margin:1rem 0">' + chips + '</div><div class="docs">' + docs + '</div>' + hints +
      timerBox(hintBtn) + nextBtn(S.i < 2 ? 'Next exhibits' : 'Accusations') + '</div>';
  }
  function vAccuse() {
    if (S.sub === 'write') {
      return '<div class="stage narrow">' + kick('The accusation') + '<h2>On paper: one name, one sentence of proof.</h2>' +
        '<p class="lead" style="margin-top:.8rem">Everybody writes, including whoever did it. No talking. Turn them over together at the bell.</p>' + timerBox() + nextBtn('Record the names') + '</div>';
    }
    const all = M.all;
    const rows = names().map((nm, i) => '<tr><td><b>' + esc(nm) + '</b> names</td><td><div class="chips">' +
      all.map(c => '<button class="chip ' + (S.acc[i] === c ? 'hot' : '') + '" data-act="acc" data-id="' + i + ':' + c + '">' + esc(D.CAST[c].name) + '</button>').join('') + '</div></td></tr>').join('');
    const done = names().every((_, i) => S.acc[i]);
    return '<div class="stage narrow">' + kick('The accusation') + '<h2>Who named whom?</h2><div class="sheet" style="margin-top:1.2rem"><table class="score">' + rows + '</table></div>' +
      '<div class="btns"><button class="btn go" data-act="next" data-next ' + (done ? '' : 'disabled') + '>The truth →</button></div></div>';
  }
  function vSolution() {
    const who = names()[cast().indexOf(M.leaker)];
    return '<div class="stage narrow">' + kick('The truth', who) + '<h2>' + esc(M.truth) + '</h2><div class="sheet" style="margin-top:1.2rem">' + list(D.SOLUTION) + '</div>' +
      '<p class="lead" style="margin-top:1.2rem">' + esc(who) + ': tell them why. The truth, this time.</p>' + nextBtn('The hearing') + '</div>';
  }
  function vHearing() {
    if (S.i < 0) {
      return '<div class="stage narrow">' + kick('The hearing') + '<h2>Were they right?</h2><div class="sheet" style="margin-top:1.2rem">' + D.HEARING_INTRO.map(p => '<p class="lead" style="max-width:none">' + esc(p) + '</p>').join('') + '</div>' +
        '<p class="dim" style="margin-top:.8rem">Five facts will arrive, one at a time. Argue each before you ask for the next.</p>' + nextBtn('First fact') + '</div>';
    }
    const c = D.CARDS[S.i];
    return '<div class="stage narrow">' + kick('The hearing · fact ' + (S.i + 1) + ' of ' + D.CARDS.length) + '<h2>' + esc(c.title) + '</h2>' +
      '<div class="sheet" style="margin-top:1.2rem"><p class="lead" style="max-width:none;margin:0">' + esc(c.text) + '</p></div>' +
      '<div class="phrases"><span class="lab">On the record</span>' + K.phrases(S.room + 'h' + S.i, 3).map(p => '<q>' + esc(p) + '</q>').join('') + '</div>' +
      timerBox() + nextBtn(S.i < D.CARDS.length - 1 ? 'Next fact' : 'The votes') + '</div>';
  }
  function vVote() {
    const q = D.QUESTIONS[S.i];
    return '<div class="stage narrow">' + kick('Vote ' + (S.i + 1) + ' of 3 · show of hands') + '<h2>' + esc(q.q) + '</h2>' +
      '<div class="opts">' + q.options.map((o, k) => '<button class="opt" data-act="vote" data-id="' + o.id + '"><span class="k">' + 'ABCD'[k] + '</span><b>' + esc(o.label) + '</b></button>').join('') + '</div>' +
      '<p class="dim" style="margin-top:1rem">' + esc(M.tie) + '</p></div>';
  }
  function vEpilogue() {
    const E = D.EPILOGUE, lines = [E.open, E.q2[S.votes.q2], E.q3[S.votes.q3], E.close];
    return '<div class="stage narrow">' + kick('Afterwards') + '<h2>' + esc(S.votes.q1 === 'yes' ? M.verdict.yes : M.verdict.no) + '</h2>' +
      '<div class="sheet" style="margin-top:1.2rem"><ul class="plain">' + lines.map(l => '<li class="lead" style="max-width:none">' + esc(l) + '</li>').join('') + '</ul></div>' +
      (M.real ? '<div class="note"><span class="lab">This happened</span>' + esc(M.real) + '</div>' : '') + nextBtn('The scores') + '</div>';
  }
  function scores() {
    const cs = cast();
    const others = cs.filter(c => c !== M.leaker).length;
    const namedRight = names().filter((_, i) => cs[i] !== M.leaker && S.acc[i] === M.leaker).length;
    const clearNamed = names().some((_, i) => S.acc[i] === M.clear);
    return names().map((nm, i) => {
      const c = cs[i]; const parts = [];
      if (c === M.leaker) { if (namedRight < others / 2) parts.push(['Got away with it', 3]); }
      else if (S.acc[i] === M.leaker) parts.push(['Named the leaker', 2]);
      if (c === M.clear && !clearNamed) parts.push(['Nobody suspected you', 1]);
      M.secrets.forEach(x => { if (c === x.who && !S.out[x.id]) parts.push([x.kept, 1]); });
      if (D.AIMS[c](S.votes)) parts.push(['The hearing went your way', 2]);
      return { nm, c, parts, total: parts.reduce((a, p) => a + p[1], 0) };
    });
  }
  function vScores() {
    const rows = scores(), best = Math.max.apply(null, rows.map(r => r.total)), cs = cast();
    const toggles = M.secrets.filter(x => cs.indexOf(x.who) >= 0).map(x => '<button class="chip ' + (S.out[x.id] ? 'hot' : '') + '" data-act="out" data-id="' + x.id + '">' + esc(x.chip) + '</button>').join('');
    return '<div class="stage narrow">' + kick('The record') + '<h2>Who did well out of it</h2><div class="chips" style="margin:1rem 0">' + toggles + '</div>' +
      '<div class="sheet"><table class="score">' + rows.map(r => '<tr class="' + (r.total === best ? 'top' : '') + '"><td><b>' + esc(r.nm) + '</b><br><span class="lab">' + esc(D.CAST[r.c].name) + '</span></td><td>' +
        (r.parts.length ? r.parts.map(p => esc(p[0]) + ' +' + p[1]).join('<br>') : '<span class="dim">Nothing</span>') + '</td><td class="n">' + r.total + '</td></tr>').join('') + '</table></div>' + nextBtn('Last ten minutes') + '</div>';
  }
  function vClose() {
    const writing = S.sub === 'write';
    return '<div class="stage narrow">' + kick(writing ? 'On paper · optional' : 'Gems and slips') +
      (writing ? '<h2>Sixty words, in pencil.</h2><div class="sheet" style="margin-top:1.1rem"><ul class="plain">' + D.CLOSERS.map(c => '<li class="lead" style="max-width:none">' + esc(c) + '</li>').join('') + '</ul></div><p class="dim" style="margin-top:.8rem">Pick one. Read them aloud at the bell.</p>'
        : '<h2>What was said well, and what was not.</h2><div class="sheet" style="margin-top:1.1rem">' + list(['Each of you: one phrase somebody else used that you would steal.', 'Each of you: one slip you heard, said kindly, with the fix.', 'One word from tonight that you did not know this morning.']) + '</div>') +
      timerBox() + nextBtn(writing ? 'Gems and slips' : 'Finish') + '</div>';
  }
  function vDone() {
    return '<div class="stage narrow center" style="padding-top:5rem"><h1>Case closed.</h1><div class="btns" style="justify-content:center"><button class="btn go" data-act="reset">New game</button><a class="btn" href="./">All games</a></div></div>';
  }

  function render() {
    const views = { setup: vSetup, premise: vPremise, rules: vRules, briefs: vBriefs, statements: vStatements, round: vRound, accuse: vAccuse, solution: vSolution, hearing: vHearing, vote: vVote, epilogue: vEpilogue, scores: vScores, close: vClose, done: vDone };
    app.innerHTML = views[S.phase]();
    $('#where').textContent = { setup: '', premise: 'The case', rules: 'The case', briefs: 'Briefs', statements: 'Act I · Statements', round: 'Act II · The paper trail', accuse: 'Act III · Accusation', solution: 'Act III · The truth', hearing: 'Act IV · The hearing', vote: 'Act IV · The hearing', epilogue: 'Afterwards', scores: 'The record', close: 'Closing', done: '' }[S.phase];
    $('#new').textContent = S.sure ? 'Sure?' : 'New game';
    $('#new').classList.toggle('hide', S.phase === 'setup');
    clock.loop(); window.scrollTo(0, 0);
  }

  const acts = {
    begin() {
      const l = S.names.map(s => s.trim()).filter(Boolean);
      if (l.length < 3) { K.beep('no'); return; }
      S.names = l.concat(['', '', '', '']).slice(0, 4); S.n = l.length; S.started = Date.now(); S.phase = 'premise';
    },
    next() {
      const p = S.phase;
      if (p === 'premise') S.phase = 'rules';
      else if (p === 'rules') { S.phase = 'briefs'; setTimer(T.read); }
      else if (p === 'briefs') { S.phase = 'statements'; S.i = 0; setTimer(T.statement); }
      else if (p === 'statements') {
        const last = S.n < 4 ? S.n : S.n - 1;
        if (S.i < last) { S.i++; setTimer(T.statement); }
        else { S.phase = 'round'; S.i = 0; S.hint = 0; S.show = D.ROUNDS[0].ids.slice(); setTimer(T.round); }
      }
      else if (p === 'round') {
        if (S.i < 2) { S.i++; S.hint = 0; S.show = D.ROUNDS[S.i].ids.slice(); setTimer(T.round); }
        else { S.phase = 'accuse'; S.sub = 'write'; setTimer(T.accuse); }
      }
      else if (p === 'accuse') { if (S.sub === 'write') { S.sub = 'record'; clock.pause(); } else { S.phase = 'solution'; K.beep('end'); } }
      else if (p === 'solution') { S.phase = 'hearing'; S.i = -1; }
      else if (p === 'hearing') {
        if (S.i < D.CARDS.length - 1) { S.i++; setTimer(T.card); }
        else { S.phase = 'vote'; S.i = 0; clock.pause(); }
      }
      else if (p === 'epilogue') S.phase = 'scores';
      else if (p === 'scores') { S.phase = 'close'; S.sub = 'write'; setTimer(T.write); }
      else if (p === 'close') { if (S.sub === 'write') { S.sub = 'review'; setTimer(T.review); } else S.phase = 'done'; }
    },
    show(id) {
      const k = S.show.indexOf(id);
      if (k >= 0) S.show.splice(k, 1); else { S.show.push(id); if (S.show.length > 2) S.show.shift(); }
    },
    hint() { S.hint++; },
    acc(v) { const [i, c] = v.split(':'); S.acc[i] = c; },
    vote(id) {
      S.votes[D.QUESTIONS[S.i].id] = id; K.beep('ok');
      if (S.i < D.QUESTIONS.length - 1) S.i++; else S.phase = 'epilogue';
    },
    out(id) { S.out[id] = !S.out[id]; },
    't-go'() { const t = S.timer || {}; if (t.left === t.total) clock.start(t.total); else clock.resume(); },
    't-pause'() { clock.pause(); },
    't-add'() { clock.add(60); },
    reset() { clock.stop(); S = fresh(); }
  };

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el || el.disabled) return;
    const fn = acts[el.dataset.act]; if (!fn) return;
    S.sure = false; fn(el.dataset.id); save(); render();
  });
  document.addEventListener('input', e => { const el = e.target.closest('[data-name]'); if (el) { S.names[Number(el.dataset.name)] = el.value; save(); } });
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') { if (e.key === 'Enter') { const b = $('[data-next]'); if (b) b.click(); } return; }
    if (e.key === 'ArrowRight' || e.key === 'Enter') { const b = $('[data-next]'); if (b && !b.disabled) { e.preventDefault(); b.click(); } }
    if (e.key === ' ') { const b = $('[data-act="t-go"]') || $('[data-act="t-pause"]'); if (b) { e.preventDefault(); b.click(); } }
    if (e.key === 'f') K.fullscreen();
  });
  $('#new').addEventListener('click', () => { if (S.sure) { clock.stop(); S = fresh(); } else S.sure = true; save(); render(); });
  $('#full').addEventListener('click', K.fullscreen);

  $('#tag').textContent = V === 'class' ? 'Class' : 'Rehearsal';
  $('#tag').className = 'tag ' + V;
  K.keepAwake(); K.sessionClock(() => S.started, 90); render();
})();

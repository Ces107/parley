/* The Panel — host screen. Phones are buzzers and private cards; keys 1-4 work as buzzers too. */
(function () {
  'use strict';
  const D = window.PANEL, K = window.K, $ = K.$, esc = K.esc;
  const V = K.variant();
  const LS = K.store('parley.panel.v2.' + V);
  const app = $('#app');
  const T = { minute: 60, write: 120, prep: 120, grill: 150, lectprep: 180, lecture: 90, review: 300 };
  let S = LS.get(), net = null, plan = null, linking = false;

  function fresh() {
    return { v: 1, room: K.newCode(5), names: ['', '', '', ''], n: 0, phase: 'setup', i: 0, st: '', scores: [0, 0, 0, 0], timer: null, started: 0,
      b: -1, seen: {}, jam: null, bv: {}, votes: {}, caught: 0, smug: 0, peek: false, last: null, sure: false };
  }
  if (!S || S.v !== 1) S = fresh();
  const save = () => LS.set(S);
  const clock = K.Countdown({ id: 'main', get: () => S.timer, set: t => { S.timer = t; save(); }, onEnd: () => { timeUp(); save(); render(); } });
  const setTimer = sec => { S.timer = { left: sec, running: false, total: sec }; };
  const names = () => S.names.slice(0, S.n);
  const nm = i => S.names[i] || '';
  const add = (seat, pts) => { S.scores[seat] += pts; S.last = S.last || {}; S.last[seat] = (S.last[seat] || 0) + pts; };
  const kick = (a, b) => '<div class="kicker"><span>' + esc(a) + '</span>' + (b ? '<span class="who">' + esc(b) + '</span>' : '') + '</div>';
  const nextBtn = (label, off) => '<div class="btns"><button class="btn go" data-act="next" data-next ' + (off ? 'disabled' : '') + '>' + esc(label || 'Next') + ' →</button></div>';
  const list = arr => '<ol class="steps">' + arr.map(r => '<li>' + esc(r) + '</li>').join('') + '</ol>';

  function board() {
    return '<div class="chips" style="margin-bottom:1.1rem">' + names().map((n, i) => {
      const d = S.last && S.last[i] ? ' <span class="' + (S.last[i] > 0 ? '' : 'red') + '">' + (S.last[i] > 0 ? '+' : '−') + Math.abs(S.last[i]) + '</span>' : '';
      return '<span class="chip ' + (S.seen[i] ? 'on' : '') + '">' + esc(n) + ' <b>' + S.scores[i] + '</b>' + d + '</span>';
    }).join('') + '</div>';
  }
  function timerBox(big) {
    const t = S.timer || {};
    const ctl = !t.running ? '<button class="btn y" data-act="go">' + (t.left === t.total ? 'Start' : 'Resume') + '</button>' : '<button class="btn" data-act="pause">Pause</button>';
    return '<div class="btns"><span class="timer ' + (big ? '' : 's') + '" data-timer="main">' + K.fmt(clock.left()) + '</span>' + ctl + '</div>';
  }
  const buzzKeys = who => '<div class="chips" style="margin-top:1rem"><span class="lab">Buzz</span>' + names().map((n, i) => i === who ? '' : '<button class="chip" data-act="buzz" data-id="' + i + '">' + (i + 1) + ' · ' + esc(n) + '</button>').join('') + '</div>';

  // ---------- screens ----------
  function vSetup() {
    const inputs = [0, 1, 2, 3].map(i => '<input type="text" maxlength="14" data-name="' + i + '" placeholder="' + (i < 3 ? 'Name' : 'Name (optional)') + '" value="' + esc(S.names[i]) + '">').join('');
    return '<div class="stage narrow">' + kick('90 minutes · 3 or 4 players') + '<h1>The Panel</h1>' +
      '<p class="lead" style="margin-top:1rem">Four rounds borrowed from British radio and television. Phones are the buzzers. Bring pencils and scrap paper.</p>' +
      '<div class="sheet" style="margin-top:1.4rem"><div class="lab" style="margin-bottom:.6rem">Who is at the table, in seating order</div><div class="row">' + inputs + '</div>' +
      '<div class="btns"><button class="btn go" data-act="begin" data-next>Begin →</button></div></div></div>';
  }
  function vJoin() {
    const seats = names().map((n, i) => '<div class="seat ' + (S.seen[i] ? 'on' : '') + '"><h3>' + esc(n) + (S.seen[i] ? ' ✓' : '') + '</h3><div class="qr">' + K.qrSvg(K.seatUrl('panel', S.room, i, S.n, { b: S.b >= 0 ? S.b : null }, names())) + '</div><div class="lab" style="margin-top:.4rem">Key ' + (i + 1) + '</div>' + (V === 'rehearsal' ? '<a class="lab" target="_blank" href="' + esc(K.seatUrl('panel', S.room, i, S.n, { b: S.b >= 0 ? S.b : null }, names())) + '">Open in a new tab</a>' : '') + '</div>').join('');
    if (linking) return '<div class="stage">' + kick('Buzzers') + '<h2>Connecting…</h2></div>';
    const link = S.b >= 0 ? '<p class="lead" style="margin:.8rem 0 1.2rem">Scan your own code and press the red button once.</p>'
      : '<div class="note" style="border-color:var(--red)"><span class="lab">No live link</span>Phones will still show your private cards. For buzzing, use keys 1 to ' + S.n + ' on this keyboard.</div><div class="gap"></div>';
    return '<div class="stage">' + kick('Buzzers') + '<h2>Phones out.</h2>' + link + '<div class="seats">' + seats + '</div>' + nextBtn('Round one') + '</div>';
  }
  function vIntro(key, n) {
    const R = D.ROUNDS[key];
    return '<div class="stage narrow">' + board() + kick('Round ' + n + ' of 4') + '<h1>' + esc(R.name) + '</h1><div class="sheet" style="margin-top:1.2rem">' + list(R.rules) + '</div>' + nextBtn('Start') + '</div>';
  }
  function vJam() {
    const t = plan.jam[S.i], j = S.jam;
    const head = board() + kick('One Minute · ' + (S.i + 1) + ' of ' + plan.jam.length, 'Speaking: ' + nm(j.speaker)) + '<div class="subject">' + esc(t.subject) + '</div>';
    if (S.st === 'challenge') {
      return '<div class="stage">' + head + '<div class="sheet" style="margin-top:1.3rem;border-color:var(--red)"><div class="big red">' + esc(nm(j.challenger)) + ' challenges.</div>' +
        '<p class="lead" style="margin:.5rem 0 0">Hesitation, repetition or deviation? The rest of the table rules.</p>' +
        '<div class="btns"><button class="btn go" data-act="upheld">Upheld: ' + esc(nm(j.challenger)) + ' takes over</button><button class="btn" data-act="overruled">Overruled: ' + esc(nm(j.speaker)) + ' carries on</button></div></div>' +
        '<div class="btns"><span class="timer s" data-timer="main">' + K.fmt(clock.left()) + '</span></div></div>';
    }
    if (S.st === 'over') {
      return '<div class="stage">' + head + '<p class="lead" style="margin-top:1.2rem"><b>' + esc(nm(j.speaker)) + '</b> was speaking at the whistle' + (j.clean ? ', and nobody challenged at all.' : '.') + '</p>' + nextBtn(S.i < plan.jam.length - 1 ? 'Next subject' : 'Round two') + '</div>';
    }
    return '<div class="stage">' + head + '<div style="margin-top:1.2rem">' + timerBox(true) + '</div>' + (S.st === 'run' ? buzzKeys(j.speaker) : '') + '</div>';
  }
  function vBluff() {
    const t = plan.bluff[S.i], reader = t.reader;
    const head = board() + kick('The Dictionary · ' + (S.i + 1) + ' of ' + plan.bluff.length, 'Reader: ' + nm(reader)) + '<div class="word">' + esc(t.word.w) + '</div><div class="lab" style="margin-top:.4rem">' + esc(t.word.pos) + '</div>';
    if (S.st === 'write') {
      return '<div class="stage">' + head + '<p class="lead" style="margin-top:1.2rem">' + esc(nm(reader)) + ': the true definition is on your phone. Copy it onto a slip. Everyone else: invent one.</p>' +
        timerBox() + '<details><summary>Reader has no phone</summary><div class="btns"><button class="btn ghost" data-act="peek">' + (S.peek ? 'Hide it' : 'Show it here (everyone else looks away)') + '</button></div>' +
        (S.peek ? '<div class="sheet" style="margin-top:.8rem"><p class="lead" style="margin:0">' + esc(t.word.def) + '</p></div>' : '') + '</details>' + nextBtn('Slips in. Read them out') + '</div>';
    }
    if (S.st === 'read') {
      const voters = names().map((_, i) => i).filter(i => i !== reader);
      const rows = voters.map(v => '<tr><td><b>' + esc(nm(v)) + '</b> chose</td><td><div class="chips"><button class="chip ' + (S.bv[v] === 'true' ? 'hot' : '') + '" data-act="bv" data-id="' + v + ':true">the true one</button>' +
        voters.filter(x => x !== v).map(x => '<button class="chip ' + (String(S.bv[v]) === String(x) ? 'hot' : '') + '" data-act="bv" data-id="' + v + ':' + x + '">' + esc(nm(x)) + '’s</button>').join('') + '</div></td></tr>').join('');
      const done = voters.every(v => S.bv[v] != null);
      return '<div class="stage">' + head + '<p class="lead" style="margin-top:1.2rem">' + esc(nm(reader)) + ' reads every slip, twice. On three, point at the one you believe.</p>' +
        '<div class="sheet"><table class="score">' + rows + '</table></div>' + nextBtn('Reveal', !done) + '</div>';
    }
    return '<div class="stage">' + head + '<div class="sheet" style="margin-top:1.2rem"><div class="lab">It means</div><p class="lead" style="margin:.3rem 0 0;max-width:none">' + esc(t.word.def) + '</p></div>' + nextBtn(S.i < plan.bluff.length - 1 ? 'Next word' : 'Round three') + '</div>';
  }
  function vPrep(kind) {
    if (kind === 'wilty') {
      return '<div class="stage narrow">' + board() + kick('True or Not · on paper') + '<h2>Two true things about you that nobody here would guess.</h2><p class="lead" style="margin-top:.8rem">One sentence each. Keep the paper face down.</p>' + timerBox() + nextBtn('First in the chair') + '</div>';
    }
    const cards = S.peek === false ? '' : '';
    return '<div class="stage narrow">' + board() + kick('The Lecture · prepare') + '<h2>Your subject and three truths are on your phone.</h2><p class="lead" style="margin-top:.8rem">Ninety seconds of confident nonsense, with three true facts buried in it. Pencil notes allowed.</p>' + timerBox() +
      '<details><summary>Somebody has no phone</summary><div class="chips" style="margin-top:.6rem">' + plan.truth.map((t, k) => '<button class="chip ' + (S.peek === k ? 'hot' : '') + '" data-act="peekt" data-id="' + k + '">' + esc(nm(t.lecturer)) + ' only</button>').join('') + '</div>' +
      (typeof S.peek === 'number' ? '<div class="sheet" style="margin-top:.8rem"><div class="lab">' + esc(plan.truth[S.peek].subject) + '</div>' + list(plan.truth[S.peek].truths) + '</div>' : '') + '</details>' + cards + nextBtn('First lecture') + '</div>';
  }
  function vWilty() {
    const t = plan.wilty[S.i], sp = t.speaker;
    const head = board() + kick('True or Not · ' + (S.i + 1) + ' of ' + plan.wilty.length, 'In the chair: ' + nm(sp));
    if (S.st === 'card') {
      return '<div class="stage narrow">' + head + '<h2>' + esc(nm(sp)) + ': look at your phone, then tell us.</h2><p class="lead" style="margin-top:.8rem">One sentence. Say it as if it happened.</p>' +
        '<details><summary>No phone</summary><div class="btns"><button class="btn ghost" data-act="peek">' + (S.peek ? 'Hide it' : 'Show the card here (everyone else looks away)') + '</button></div>' +
        (S.peek ? '<div class="sheet" style="margin-top:.8rem"><p class="lead" style="margin:0">' + (t.truth ? 'TRUTH. Use one of your own.' : 'LIE. Claim this: ' + esc(t.lie)) + '</p></div>' : '') + '</details>' + nextBtn('Cross-examine') + '</div>';
    }
    if (S.st === 'grill') {
      return '<div class="stage narrow">' + head + '<h2>Cross-examine.</h2><p class="lead" style="margin-top:.8rem">Dates, names, details. Ask for the thing a liar would not have ready.</p><div style="margin-top:1rem">' + timerBox(true) + '</div>' + nextBtn('Vote') + '</div>';
    }
    const voters = names().map((_, i) => i).filter(i => i !== sp);
    if (S.st === 'vote') {
      const rows = voters.map(v => '<tr><td><b>' + esc(nm(v)) + '</b></td><td><div class="chips"><button class="chip ' + (S.votes[v] === 'true' ? 'hot' : '') + '" data-act="wv" data-id="' + v + ':true">True</button><button class="chip ' + (S.votes[v] === 'lie' ? 'hot' : '') + '" data-act="wv" data-id="' + v + ':lie">Lie</button></div></td></tr>').join('');
      const done = voters.every(v => S.votes[v]);
      return '<div class="stage narrow">' + head + '<h2>True, or not?</h2><p class="lead" style="margin-top:.8rem">Vote on your phone, or point and tap it in here.</p><div class="sheet"><table class="score">' + rows + '</table></div>' + nextBtn('Reveal', !done) + '</div>';
    }
    return '<div class="stage narrow">' + head + '<div class="big ' + (t.truth ? '' : 'red') + '" style="margin-top:.6rem">' + (t.truth ? 'True.' : 'A lie.') + '</div>' +
      (t.truth ? '' : '<div class="sheet" style="margin-top:1rem"><div class="lab">The card said</div><p class="lead" style="margin:.3rem 0 0;max-width:none">' + esc(t.lie) + '</p></div>') + nextBtn(S.i < plan.wilty.length - 1 ? 'Next in the chair' : 'Round four') + '</div>';
  }
  function vTruth() {
    const t = plan.truth[S.i], sp = t.lecturer;
    const head = board() + kick('The Lecture · ' + (S.i + 1) + ' of ' + plan.truth.length, 'Lecturer: ' + nm(sp)) + '<div class="subject">' + esc(t.subject) + '</div>';
    if (S.st === 'challenge') {
      return '<div class="stage">' + head + '<div class="sheet" style="margin-top:1.3rem;border-color:var(--red)"><div class="big red">' + esc(nm(S.jam.challenger)) + ' thinks that was true.</div>' +
        '<p class="lead" style="margin:.5rem 0 0">' + esc(nm(sp)) + ', honestly: was it one of your three?</p>' +
        '<div class="btns"><button class="btn go" data-act="wastrue">It was: +1 to ' + esc(nm(S.jam.challenger)) + '</button><button class="btn" data-act="wasnot">It was not: −1</button></div></div></div>';
    }
    if (S.st === 'over') {
      return '<div class="stage">' + head + '<div class="sheet" style="margin-top:1.2rem"><div class="lab">The three truths</div>' + list(t.truths) + '</div>' +
        '<div class="btns"><span class="lab">Slipped past</span><button class="chip" data-act="smug-">−</button><b class="big" style="font-size:2rem">' + S.smug + '</b><button class="chip" data-act="smug+">+</button></div>' +
        nextBtn(S.i < plan.truth.length - 1 ? 'Next lecture' : 'The scores') + '</div>';
    }
    return '<div class="stage">' + head + '<div style="margin-top:1.2rem">' + timerBox(true) + '</div>' + (S.st === 'run' ? buzzKeys(sp) : '') + '</div>';
  }
  function vFinal() {
    const rows = names().map((n, i) => ({ n, s: S.scores[i] })).sort((a, b) => b.s - a.s), best = rows[0].s;
    return '<div class="stage narrow">' + kick('Final scores') + '<h1>' + esc(rows.filter(r => r.s === best).map(r => r.n).join(' and ')) + '</h1>' +
      '<div class="sheet" style="margin-top:1.2rem"><table class="score">' + rows.map(r => '<tr class="' + (r.s === best ? 'top' : '') + '"><td><b>' + esc(r.n) + '</b></td><td class="n">' + r.s + '</td></tr>').join('') + '</table></div>' + nextBtn('Last five minutes') + '</div>';
  }
  function vClose() {
    return '<div class="stage narrow">' + kick('Gems and slips') + '<h2>What was said well, and what was not.</h2><div class="sheet" style="margin-top:1.1rem">' +
      list(['Each of you: one phrase somebody else used that you would steal.', 'Each of you: one slip you heard, said kindly, with the fix.', 'Tonight’s words: which will you actually use?']) + '</div>' +
      '<div class="chips" style="margin-top:1rem">' + plan.bluff.map(b => '<span class="chip">' + esc(b.word.w) + '</span>').join('') + '</div>' + timerBox() + nextBtn('Finish') + '</div>';
  }
  function vDone() {
    return '<div class="stage narrow center" style="padding-top:5rem"><h1>Good night.</h1><div class="btns" style="justify-content:center"><button class="btn go" data-act="reset">New game</button><a class="btn" href="./">All games</a></div></div>';
  }

  const WHERE = { setup: '', join: 'Buzzers', 'jam-intro': 'Round 1', jam: 'Round 1 · One Minute', 'bluff-intro': 'Round 2', bluff: 'Round 2 · The Dictionary', 'wilty-intro': 'Round 3', 'wilty-prep': 'Round 3 · True or Not', wilty: 'Round 3 · True or Not', 'truth-intro': 'Round 4', 'truth-prep': 'Round 4 · The Lecture', truth: 'Round 4 · The Lecture', final: 'Scores', close: 'Closing', done: '' };
  function render() {
    if (S.n && !plan) plan = D.plan(S.room, S.n, V);
    const p = S.phase;
    const html = p === 'setup' ? vSetup() : p === 'join' ? vJoin() : p === 'jam-intro' ? vIntro('jam', 1) : p === 'jam' ? vJam() : p === 'bluff-intro' ? vIntro('bluff', 2) : p === 'bluff' ? vBluff()
      : p === 'wilty-intro' ? vIntro('wilty', 3) : p === 'wilty-prep' ? vPrep('wilty') : p === 'wilty' ? vWilty() : p === 'truth-intro' ? vIntro('truth', 4) : p === 'truth-prep' ? vPrep('truth') : p === 'truth' ? vTruth()
      : p === 'final' ? vFinal() : p === 'close' ? vClose() : vDone();
    app.innerHTML = html;
    $('#where').textContent = WHERE[p] || '';
    $('#new').textContent = S.sure ? 'Sure?' : 'New game';
    $('#new').classList.toggle('hide', p === 'setup');
    const ne = $('#net'); ne.className = 'net ' + (net && net.ok ? 'ok' : 'bad'); ne.textContent = p === 'setup' ? '' : (net && net.ok ? 'Live' : 'Offline');
    clock.loop(); publish();
  }

  // ---------- live link ----------
  function speaker() {
    if (S.phase === 'jam' && S.jam) return S.jam.speaker;
    if (S.phase === 'bluff') return plan.bluff[S.i].reader;
    if (S.phase === 'wilty') return plan.wilty[S.i].speaker;
    if (S.phase === 'truth') return plan.truth[S.i].lecturer;
    return -1;
  }
  function publish() {
    if (!net || !net.ok || S.phase === 'setup') return;
    net.publishState({ ph: S.phase, i: S.i, st: S.st, sp: speaker(), n: S.n, scores: S.scores.slice(0, S.n), t: Date.now() });
  }
  function onAct(m) {
    if (!m || typeof m.s !== 'number' || m.s < 0 || m.s >= S.n) return;
    if (m.k === 'hi') { if (!S.seen[m.s]) { S.seen[m.s] = true; K.beep('tick'); save(); render(); } return; }
    if (m.k === 'buzz') { if (buzz(m.s)) { save(); render(); } return; }
    if (m.k === 'vote' && S.phase === 'wilty' && S.st === 'vote' && m.s !== speaker() && (m.v === 'true' || m.v === 'lie')) { S.votes[m.s] = m.v; save(); render(); }
  }
  function connect(pref) {
    if (net) net.close();
    linking = true;
    net = K.open({ room: S.room, role: 'host', broker: pref, onAct, onStatus: () => { const ne = $('#net'); if (ne) { ne.className = 'net ' + (net.ok ? 'ok' : 'bad'); ne.textContent = net.ok ? 'Live' : 'Offline'; } publish(); } });
    return net.ready.then(ok => { linking = false; S.b = ok ? net.index : -1; save(); return ok; });
  }

  // ---------- flow ----------
  function buzz(seat) {
    if ((S.phase !== 'jam' && S.phase !== 'truth') || S.st !== 'run' || seat === speaker()) return false;
    clock.pause(); S.jam = S.jam || {}; S.jam.challenger = seat; S.jam.clean = false; S.st = 'challenge'; K.beep('buzz'); return true;
  }
  function timeUp() {
    if (S.phase === 'jam' && S.st === 'run') { S.last = null; add(S.jam.speaker, 1); if (S.jam.clean) add(S.jam.speaker, 1); S.st = 'over'; }
    else if (S.phase === 'truth' && S.st === 'run') { S.st = 'over'; S.smug = Math.max(0, 3 - S.caught); }
  }
  function startJam() { S.jam = { speaker: plan.jam[S.i].starter, challenger: null, clean: true }; S.st = 'ready'; setTimer(T.minute); }
  function startBluff() { S.bv = {}; S.peek = false; S.st = 'write'; setTimer(T.write); }
  function startWilty() { S.votes = {}; S.peek = false; S.st = 'card'; }
  function startTruth() { S.jam = { challenger: null }; S.caught = 0; S.smug = 0; S.st = 'ready'; setTimer(T.lecture); }

  const acts = {
    begin() {
      const l = S.names.map(s => s.trim()).filter(Boolean);
      if (l.length < 3) { K.beep('no'); return; }
      S.names = l.concat(['', '', '', '']).slice(0, 4); S.n = l.length; S.started = Date.now(); S.phase = 'join'; plan = D.plan(S.room, S.n, V);
      connect(null).then(() => render());
    },
    next() {
      const p = S.phase; S.last = null;
      if (p === 'join') S.phase = 'jam-intro';
      else if (p === 'jam-intro') { S.phase = 'jam'; S.i = 0; startJam(); }
      else if (p === 'jam') { if (S.i < plan.jam.length - 1) { S.i++; startJam(); } else S.phase = 'bluff-intro'; }
      else if (p === 'bluff-intro') { S.phase = 'bluff'; S.i = 0; startBluff(); }
      else if (p === 'bluff') {
        if (S.st === 'write') { S.st = 'read'; clock.pause(); }
        else if (S.st === 'read') {
          const t = plan.bluff[S.i]; let found = false;
          Object.keys(S.bv).forEach(v => { if (S.bv[v] === 'true') { add(Number(v), 2); found = true; } else add(Number(S.bv[v]), 1); });
          if (!found) add(t.reader, 2);
          S.st = 'reveal'; K.beep('ok');
        }
        else if (S.i < plan.bluff.length - 1) { S.i++; startBluff(); } else S.phase = 'wilty-intro';
      }
      else if (p === 'wilty-intro') { S.phase = 'wilty-prep'; setTimer(T.prep); }
      else if (p === 'wilty-prep') { S.phase = 'wilty'; S.i = 0; startWilty(); }
      else if (p === 'wilty') {
        const t = plan.wilty[S.i];
        if (S.st === 'card') { S.st = 'grill'; S.peek = false; setTimer(T.grill); }
        else if (S.st === 'grill') { S.st = 'vote'; clock.pause(); }
        else if (S.st === 'vote') {
          Object.keys(S.votes).forEach(v => { if ((S.votes[v] === 'true') === t.truth) add(Number(v), 1); else add(t.speaker, 1); });
          S.st = 'reveal'; K.beep('end');
        }
        else if (S.i < plan.wilty.length - 1) { S.i++; startWilty(); } else S.phase = 'truth-intro';
      }
      else if (p === 'truth-intro') { S.phase = 'truth-prep'; S.peek = false; setTimer(T.lectprep); }
      else if (p === 'truth-prep') { S.phase = 'truth'; S.i = 0; startTruth(); }
      else if (p === 'truth') {
        if (S.st === 'over') { add(plan.truth[S.i].lecturer, S.smug); if (S.i < plan.truth.length - 1) { S.i++; startTruth(); S.last = null; } else S.phase = 'final'; }
      }
      else if (p === 'final') { S.phase = 'close'; setTimer(T.review); }
      else if (p === 'close') S.phase = 'done';
    },
    go() { const t = S.timer || {}; if (t.left === t.total) clock.start(t.total); else clock.resume(); if (S.phase === 'jam' || S.phase === 'truth') S.st = 'run'; },
    pause() { clock.pause(); if (S.phase === 'jam' || S.phase === 'truth') S.st = 'ready'; },
    buzz(id) { buzz(Number(id)); },
    upheld() { S.last = null; add(S.jam.challenger, 1); S.jam.speaker = S.jam.challenger; S.jam.challenger = null; S.st = 'ready'; },
    overruled() { S.last = null; add(S.jam.speaker, 1); S.jam.challenger = null; S.st = 'ready'; },
    wastrue() { S.last = null; add(S.jam.challenger, 1); S.caught++; S.jam.challenger = null; S.st = 'ready'; },
    wasnot() { S.last = null; add(S.jam.challenger, -1); S.jam.challenger = null; S.st = 'ready'; },
    'smug+'() { S.smug = Math.min(3, S.smug + 1); },
    'smug-'() { S.smug = Math.max(0, S.smug - 1); },
    bv(v) { const [a, b] = v.split(':'); S.bv[a] = b === 'true' ? 'true' : Number(b); },
    wv(v) { const [a, b] = v.split(':'); S.votes[a] = b; },
    peek() { S.peek = !S.peek; },
    peekt(id) { S.peek = S.peek === Number(id) ? false : Number(id); },
    reset() { clock.stop(); if (net) net.close(); net = null; plan = null; S = fresh(); }
  };

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el || el.disabled) return;
    const fn = acts[el.dataset.act]; if (!fn) return;
    S.sure = false; fn(el.dataset.id); save(); render();
  });
  document.addEventListener('input', e => { const el = e.target.closest('[data-name]'); if (el) { S.names[Number(el.dataset.name)] = el.value; save(); } });
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') { if (e.key === 'Enter') { const b = $('[data-next]'); if (b) b.click(); } return; }
    if (/^[1-4]$/.test(e.key)) { if (buzz(Number(e.key) - 1)) { save(); render(); } return; }
    if (e.key === 'ArrowRight' || e.key === 'Enter') { const b = $('[data-next]'); if (b && !b.disabled) { e.preventDefault(); b.click(); } }
    if (e.key === ' ') { const b = $('[data-act="go"]') || $('[data-act="pause"]'); if (b) { e.preventDefault(); b.click(); } }
    if (e.key === 'f') K.fullscreen();
  });
  $('#new').addEventListener('click', () => { if (S.sure) acts.reset(); else S.sure = true; save(); render(); });
  $('#full').addEventListener('click', K.fullscreen);

  $('#tag').textContent = V === 'class' ? 'Class' : 'Rehearsal';
  $('#tag').className = 'tag ' + V;
  K.keepAwake(); K.sessionClock(() => S.started, 90);
  if (S.phase !== 'setup') { plan = D.plan(S.room, S.n, V); connect(S.b >= 0 ? S.b : null).then(() => render()); }
  render();
})();

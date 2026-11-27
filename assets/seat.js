/* Phone page for all three games. Private content is derived from the room code and the seat number. */
(function () {
  'use strict';
  const K = window.K, $ = K.$, esc = K.esc, P = K.params();
  const app = $('#app');
  const game = P.g, room = (P.r || '').toUpperCase(), seat = Number(P.s || 0), n = Math.max(3, Math.min(4, Number(P.n || 4)));
  const NAMES = K.hashNames();
  let open = false;

  const ul = arr => '<ul>' + arr.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
  function cover(title, inner) {
    if (!open) return '<div class="cover" data-act="open"><div><div class="lab" style="color:var(--yellow)">Private</div><div class="big" style="margin:.6rem 0">' + esc(title) + '</div><div class="mono">Tap to open</div></div></div>';
    return '<div class="brief">' + inner + '<div class="btns"><button class="btn" data-act="open">Hide</button></div></div>';
  }

  // ---------- The Council ----------
  function council() {
    const C = window.COUNCIL, id = C.portfoliosFor(room, n)[seat], p = C.PORTFOLIOS[id];
    if (!p) return '<p>Unknown seat.</p>';
    // The host screen passes the Charter the table has just signed, so the brief can say what it means for this promise.
    const picks = String(P.c || '').split('.'), f = {};
    C.CHARTER.forEach((a, i) => { if (a.options.some(o => o.id === picks[i])) f[a.id] = picks[i]; });
    const crisis = C.CRISES[p.promise.crisis], guard = Object.keys(f).length === C.CHARTER.length && crisis.guard ? crisis.guard(f) : null;
    let charter = '';
    if (guard) {
      const A = id => 'option ' + id.toUpperCase(), mine = p.promise.keeps, bound = id => guard.options.indexOf(id) >= 0;
      const every = id => bound(id) || !!crisis.options.find(o => o.id === id).unanimous;
      const stopped = mine.filter(bound), easy = mine.filter(id => !every(id));
      const others = crisis.options.map(o => o.id).filter(id => mine.indexOf(id) < 0);
      charter = stopped.length && !easy.length ? 'It stands in the way of your promise. What you need can now only win if every minister votes for it.'
        : stopped.length ? 'It stands in the way of ' + stopped.map(A).join(' and ') + ', which can now only win if every minister votes for it. ' + easy.map(A).join(' and ').replace(/^o/, 'O') + ' still needs only a majority.'
        : others.length && others.every(bound) ? 'It is on your side. The other side can now only win if every minister votes for it.'
        : 'It leaves this decision to a majority.';
    }
    return cover('Your ministry', '<div class="lab">' + esc(C.META.title) + '</div><h1>' + esc(p.title) + '</h1>' +
      '<p style="margin-top:.8rem">' + esc(p.brief[0]) + '</p><div class="secret">' + esc(p.brief[1]) + '</div>' +
      (charter ? '<div class="sheet" style="margin:.8rem 0"><div class="lab" style="margin-bottom:.3rem">The Charter you signed</div>' + esc(charter) + '</div>' : '') +
      '<div class="want">' + esc(p.brief[2]) + '</div>' +
      '<p class="dim">Keep all of this to yourself until the scores are shown.</p>');
  }

  // ---------- The Leak ----------
  function leak() {
    const L = window.LEAK, id = L.castFor(room, n)[seat], c = L.CAST[id];
    if (!c) return '<p>Unknown seat.</p>';
    return cover('Your brief', '<div class="lab">' + esc(L.META.label) + '</div><h1>' + esc(c.name) + '</h1><div class="lab" style="margin:.2rem 0 .8rem">' + esc(c.job) + '</div>' +
      '<p>' + esc(c.who) + '</p><h2>' + (c.liar ? 'What you did' : 'What you know') + '</h2>' + ul(c.know) +
      '<h2>' + (c.liar ? 'Why' : 'What you would rather keep quiet') + '</h2><div class="secret">' + c.quiet.map(q => '<p style="margin:0 0 .5em">' + esc(q) + '</p>').join('') + '</div>' +
      '<div class="want"><b>' + esc(c.want) + '</b></div>' +
      '<p class="dim">' + (c.liar ? 'You are the only one in the room who may say something false.' : 'Never say anything false. You may decline a question once; asked again, tell the truth.') + '</p>' +
      '<h2>Later, in the hearing</h2><p>' + esc(c.hearing) + '</p>');
  }

  // ---------- The Panel ----------
  let net = null, st = null, plan = null, voted = null, hello = false;
  function myCards() {
    const out = [];
    plan.bluff.forEach((b, i) => { if (b.reader === seat) out.push('<li><b>Dictionary ' + (i + 1) + ', you read:</b> ' + esc(b.word.w) + ' (' + esc(b.word.pos) + '). ' + esc(b.word.def) + '</li>'); });
    plan.wilty.forEach((w, i) => { if (w.speaker === seat) out.push('<li><b>True or Not ' + (i + 1) + ':</b> ' + (w.truth ? 'TRUTH. Use one of your own.' : 'LIE. Claim this: ' + esc(w.lie)) + '</li>'); });
    plan.truth.forEach(t => { if (t.lecturer === seat) out.push('<li><b>Lecture, ' + esc(t.subject) + ':</b> ' + t.truths.map(esc).join(' · ') + '</li>'); });
    return '<details><summary>All my cards</summary><ul class="plain" style="margin-top:.5rem">' + out.join('') + '</ul></details>';
  }
  function buzzer(label, on) { return '<button class="buzz" data-act="buzz" ' + (on ? '' : 'disabled') + '>' + esc(label) + '</button>'; }
  function panel() {
    const name = NAMES[seat] || ('Seat ' + (seat + 1));
    const live = net && net.ok;
    let body = '';
    if (!st) {
      body = live ? buzzer(hello ? 'Connected' : 'Press once', true) + '<p class="center dim" style="margin-top:1rem">Waiting for the screen.</p>'
        : '<div class="sheet"><p style="margin:0">No live link. Your private cards are below; buzz by calling out.</p></div>';
    } else {
      const me = st.sp === seat, who = NAMES[st.sp] || (st.sp >= 0 ? 'Seat ' + (st.sp + 1) : '');
      if (st.ph === 'jam') {
        const t = plan.jam[st.i];
        body = '<div class="lab">One Minute</div><h1>' + esc(t.subject) + '</h1>' + (me ? '<div class="want" style="margin-top:1rem">You are speaking. No hesitation, repetition or deviation.</div>' : '<div style="margin-top:1rem">' + buzzer('Challenge', st.st === 'run') + '</div>');
      } else if (st.ph === 'bluff') {
        const t = plan.bluff[st.i];
        body = '<div class="lab">The Dictionary</div><h1>' + esc(t.word.w) + '</h1><div class="lab">' + esc(t.word.pos) + '</div>' +
          (me ? (st.st === 'reveal' ? '' : cover('The true definition', '<div class="secret"><p style="margin:0">' + esc(t.word.def) + '</p></div><p class="dim">Copy it onto a slip in your own handwriting. Then shuffle it in with the others.</p>'))
            : '<div class="sheet" style="margin-top:1rem"><p style="margin:0">' + (st.st === 'write' ? 'Invent a definition. Write it the way a dictionary would.' : st.st === 'read' ? 'Listen. On three, point at the one you believe.' : esc(t.word.def)) + '</p></div>');
      } else if (st.ph === 'wilty') {
        const t = plan.wilty[st.i];
        if (me) body = '<div class="lab">True or Not</div>' + (st.st === 'reveal' ? '<h1>Done.</h1>' : cover('Your card', t.truth ? '<h1>Truth</h1><p>Use one of the two true things you wrote down. One sentence.</p>' : '<h1 class="red">Lie</h1><div class="secret"><p style="margin:0">' + esc(t.lie) + '</p></div><p>Say it as if it happened to you. Invent whatever they ask for.</p>'));
        else if (st.st === 'vote') body = '<div class="lab">' + esc(who) + ' says…</div><div class="vote" style="margin-top:1rem"><button data-act="vote" data-id="true" class="' + (voted === 'true' ? 'sel' : '') + '">True</button><button data-act="vote" data-id="lie" class="' + (voted === 'lie' ? 'sel' : '') + '">Lie</button></div>';
        else body = '<div class="lab">True or Not</div><h1>' + esc(who) + ' is in the chair.</h1><p class="dim" style="margin-top:.6rem">' + (st.st === 'reveal' ? '' : 'Ask for the detail a liar would not have ready.') + '</p>';
      } else if (st.ph === 'truth-prep' || st.ph === 'truth') {
        const mine = plan.truth.find(t => t.lecturer === seat);
        const lecturing = st.ph === 'truth' && me;
        if (st.ph === 'truth-prep' || lecturing) body = '<div class="lab">The Lecture</div>' + cover('Your three truths', '<h1>' + esc(mine.subject) + '</h1>' + ul(mine.truths) + '<p class="dim">Everything else you say must be false. Bury these.</p>');
        else body = '<div class="lab">' + esc(who) + ' lectures on</div><h1>' + esc(plan.truth[st.i].subject) + '</h1><div style="margin-top:1rem">' + buzzer('That was true', st.st === 'run') + '</div>';
      } else if (st.ph === 'wilty-prep') {
        body = '<div class="lab">True or Not</div><h1>On paper.</h1><p>Two true things about you that nobody here would guess. One sentence each.</p>';
      } else if (st.ph === 'final' || st.ph === 'close' || st.ph === 'done') {
        body = '<div class="lab">Final</div><h1>' + (st.scores ? st.scores[seat] : '') + ' points</h1>';
      } else {
        body = buzzer(hello ? 'Connected' : 'Press once', true);
      }
    }
    return '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1rem"><b>' + esc(name) + '</b><span class="net ' + (live ? 'ok' : 'bad') + '">' + (live ? 'Live' : 'Offline') + '</span></div>' + body + myCards();
  }
  function startPanel() {
    plan = window.PANEL.plan(room, n, K.variant());
    const s = document.createElement('script');
    s.src = 'assets/vendor/mqtt/mqtt.min.js';
    s.onload = () => {
      if (P.b == null) { render(); return; }
      net = K.open({
        room, role: 'seat', broker: Number(P.b),
        onState: m => { if (!st || m.ph !== st.ph || m.i !== st.i) { voted = null; open = false; } st = m; render(); },
        onStatus: ok => { if (ok) net.send({ k: 'hi', s: seat }); render(); }
      });
    };
    s.onerror = render;
    document.head.appendChild(s);
  }

  function render() {
    const html = game === 'council' ? council() : game === 'leak' ? leak() : game === 'panel' ? (plan ? panel() : '') : '<p>Open this page from a game screen.</p>';
    app.innerHTML = '<div class="ph">' + html + '</div>';
  }
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el || el.disabled) return;
    const a = el.dataset.act;
    if (a === 'open') open = !open;
    if (a === 'buzz') { hello = true; if (net) net.send({ k: st && (st.ph === 'jam' || st.ph === 'truth') ? 'buzz' : 'hi', s: seat }); if (navigator.vibrate) navigator.vibrate(60); K.beep('tick'); }
    if (a === 'vote') { voted = el.dataset.id; if (net) net.send({ k: 'vote', s: seat, v: voted }); }
    render();
  });

  K.keepAwake();
  if (game === 'panel') startPanel();
  render();
})();

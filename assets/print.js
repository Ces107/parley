/* Printable packs: the case notebook and exhibits for The Leak, the minister's sheet for The Council.
   Each scenario (rehearsal, class) has its own pack: print.html?g=leak&v=class */
(function () {
  'use strict';
  const K = window.K, esc = K.esc, g = K.params().g, V = K.variant();
  const app = K.$('#app');
  const rows = (n, cols) => Array.from({ length: n }, () => '<tr>' + cols.map(c => '<td style="height:8.5mm;width:' + c + '"></td>').join('') + '</tr>').join('');
  const gems = '<h3>Gems: phrases worth stealing</h3><div class="box"></div><h3>Slips: heard, with the fix</h3><div class="box"></div>';
  const nameLine = '<p style="margin:2mm 0 5mm">Name ______________________________</p>';
  const which = V === 'class' ? 'class scenario' : 'rehearsal scenario';

  function leak() {
    const L = window.LEAK, M = L.META;
    const doc = x => '<div class="doc" style="margin-bottom:8mm"><h4><span>Exhibit ' + x.id + ' · ' + esc(x.title) + '</span><em>' + esc(x.tag) + '</em></h4>' + x.html + '</div>';
    const notebook = '<section class="page"><div class="lab">The Leak · ' + which + ' · print one per player</div><h2>Case notebook</h2>' + nameLine +
      '<h3>Timeline</h3><table><tr><th style="width:22%">Day and time</th><th>What happened</th><th style="width:22%">Who says so</th></tr>' + rows(13, ['22%', 'auto', '22%']) + '</table>' +
      '<h3>The four</h3><table><tr><th style="width:20%"></th>' + M.grid.map(h => '<th>' + esc(h) + '</th>').join('') + '</tr>' +
      M.all.map(c => '<tr><td style="height:15mm"><b>' + esc(L.CAST[c].name) + '</b></td><td></td><td></td><td></td></tr>').join('') + '</table>' +
      '<h3>Accusation (fold, keep hidden until the bell)</h3><div class="box" style="min-height:20mm">I name ______________________ because</div></section>' +
      '<section class="page"><div class="lab">The Leak · the same sheet, other side</div><h2>Language</h2>' + nameLine + gems +
      '<h3>A word I did not know this morning</h3><div class="box" style="min-height:18mm"></div></section>';
    const packs = L.ROUNDS.map(r => '<section class="page"><div class="fold">ROUND ' + r.n + ' · KEEP FACE DOWN UNTIL THE SCREEN SAYS SO</div><div class="lab">The Leak · ' + which + ' · exhibits, round ' + r.n + ' · print one set</div><h2 style="margin-bottom:6mm">' + esc(r.title) + '</h2>' +
      L.EXHIBITS.filter(x => r.ids.indexOf(x.id) >= 0).map(doc).join('') + '</section>').join('');
    return notebook + packs;
  }

  function council() {
    const C = window.COUNCIL, I = C.INTRO;
    const lines = C.CHARTER.map((_, i) => 'Article ' + (i + 1)).concat(Array.from({ length: C.PROMISE_CRISES.length + 4 }, (_, i) => 'Dispatch ' + (i + 1)), ['The reckoning']);
    const cols = C.GAUGES.map(x => '<th style="width:10%">' + esc(x.name) + '</th>').join('');
    const coin = '<div class="coin"><div><b>Marker</b><span>Spend it and your vote counts twice.</span><span>Keep it and score 1 point.</span></div></div>';
    const facts = I.facts.map(x => '<tr><th>' + esc(x[0]) + '</th><td>' + esc(x[1]) + '</td></tr>');
    // Front: the briefing, with the two markers in the top right-hand corner and the country's figures under them.
    const front = '<section class="page front">' +
      '<div class="cut"><div class="lab">✂ Cut out your two markers</div><div class="coins">' + coin + coin + '</div></div>' +
      '<table class="facts">' + facts.join('') + '</table>' +
      '<div class="lab">The Council · ' + which + '</div>' +
      '<h2>' + esc(C.META.title) + '</h2><p class="where">' + esc(I.place) + '</p>' +
      '<p><b>' + esc(I.headline) + '</b> ' + esc(I.story[0]) + '</p>' + I.story.slice(1).map(x => '<p>' + esc(x) + '</p>').join('') +
      '<h3 style="clear:both">The four gauges</h3><table><tr><th style="width:14%"></th><th>What it measures</th><th style="width:27%">At 10</th><th style="width:24%">At 0</th></tr>' +
      C.GAUGES.map(x => '<tr><td><b>' + esc(x.name) + '</b></td><td>' + esc(x.what) + '</td><td>' + esc(x.high) + '</td><td>' + esc(x.zero) + '</td></tr>').join('') + '</table>' +
      '<p style="margin-top:1.5mm">Each one runs from 0 to 10 and starts at 5. Almost every decision you take will push some of them up and others down.</p>' +
      '<h3>How the Council decides</h3><ol>' + C.RULES.map(r => '<li>' + esc(r) + '</li>').join('') + '</ol>' +
      '<h3>The Charter comes first</h3><p>' + esc(I.charter.lead) + '</p>' + I.charter.points.map(x => '<p>' + esc(x) + '</p>').join('') +
      '</section>';
    // Back: the record of the year and the language notes. Its top left-hand corner is the back of the markers, so it stays empty.
    const back = '<section class="page record"><div class="cut back"></div>' +
      '<div class="lab">The Council · ' + which + ' · print on both sides</div><h2>Minister’s sheet</h2>' + nameLine +
      '<table style="clear:both"><tr><th style="width:19%"></th><th>What the Council decided</th>' + cols + '</tr>' +
      '<tr><td>Start</td><td></td>' + C.GAUGES.map(() => '<td>5</td>').join('') + '</tr>' +
      lines.map(l => '<tr><td style="height:8mm">' + l + '</td><td></td>' + C.GAUGES.map(() => '<td></td>').join('') + '</tr>').join('') + '</table>' +
      '<h3>Phrases to try. Tick each one when you use it.</h3><p style="columns:3;font-size:8.6pt;margin:0">' + K.PHRASES.slice(0, 18).map(x => '☐ ' + esc(x)).join('<br>') + '</p>' +
      '<div class="three"><div><h3>Phrases to borrow</h3><div class="box"></div></div><div><h3>Corrections</h3><div class="box"></div></div><div><h3>New words</h3><div class="box"></div></div></div>' +
      '</section>';
    return front + back;
  }

  const html = g === 'leak' ? leak() : g === 'council' ? council() : '<section class="page"><h2>Nothing to print for this game.</h2><p>Scrap paper and pencils are enough.</p></section>';
  app.innerHTML = '<div class="noprint stage narrow"><div class="btns"><button class="btn go" onclick="window.print()">Print · ' + which + '</button><a class="btn" href="./">All games</a></div></div>' + html;
})();

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
    const C = window.COUNCIL;
    const lines = C.CHARTER.map((_, i) => 'Article ' + (i + 1)).concat(Array.from({ length: C.PROMISE_CRISES.length + 4 }, (_, i) => 'Dispatch ' + (i + 1)), ['The reckoning']);
    const cols = C.GAUGES.map(x => '<th style="width:10%">' + esc(x.name) + '</th>').join('');
    return '<section class="page"><div class="lab">The Council · ' + which + ' · print one per player</div><h2>Minister’s sheet</h2>' + nameLine +
      '<p style="margin:0 0 4mm">Markers: ◯ ◯ &nbsp; (cross one out when you spend it; hand over a coin when you give one away)</p>' +
      '<table><tr><th style="width:18%"></th><th>What the Council decided</th>' + cols + '</tr>' +
      '<tr><td>Start</td><td></td>' + C.GAUGES.map(() => '<td>5</td>').join('') + '</tr>' +
      lines.map(l => '<tr><td style="height:9mm">' + l + '</td><td></td>' + C.GAUGES.map(() => '<td></td>').join('') + '</tr>').join('') + '</table>' +
      '<h3>On the record: use them, tick them</h3><p style="columns:2;font-size:9.5pt;margin:0">' + K.PHRASES.slice(0, 24).map(p => '☐ ' + esc(p)).join('<br>') + '</p></section>' +
      '<section class="page"><div class="lab">The Council · the same sheet, other side</div><h2>Language</h2>' + nameLine + gems +
      '<h3>Fifty words (optional)</h3><div class="box" style="min-height:55mm"></div></section>';
  }

  const html = g === 'leak' ? leak() : g === 'council' ? council() : '<section class="page"><h2>Nothing to print for this game.</h2><p>Scrap paper and pencils are enough.</p></section>';
  app.innerHTML = '<div class="noprint stage narrow"><div class="btns"><button class="btn go" onclick="window.print()">Print · ' + which + '</button><a class="btn" href="./">All games</a></div></div>' + html;
})();

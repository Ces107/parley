/* Parley kit — shared helpers for the three games. */
(function (root) {
  'use strict';

  // ---------- seeded randomness ----------
  function hash(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    let a = hash(String(seed)) || 1;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(list, r) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function sample(list, n, r) { return shuffle(list, r).slice(0, n); }
  function newCode(n) {
    const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    let s = '';
    const buf = new Uint32Array(n || 5);
    (root.crypto || root.msCrypto).getRandomValues(buf);
    for (let i = 0; i < buf.length; i++) s += abc[buf[i] % abc.length];
    return s;
  }

  // ---------- small DOM helpers ----------
  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function params() {
    const o = {};
    new URLSearchParams(location.search).forEach((v, k) => { o[k] = v; });
    return o;
  }
  function fmt(sec) {
    sec = Math.max(0, Math.round(sec));
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }

  // ---------- storage ----------
  function store(key) {
    return {
      get() { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } },
      set(v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* private mode */ } },
      clear() { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } }
    };
  }

  // ---------- sound ----------
  let actx = null;
  function beep(kind) {
    try {
      actx = actx || new (root.AudioContext || root.webkitAudioContext)();
      const plan = {
        tick: [[880, 0, .05]], buzz: [[150, 0, .45]], end: [[660, 0, .18], [440, .2, .35]],
        ok: [[520, 0, .1], [780, .11, .16]], no: [[300, 0, .12], [200, .13, .22]]
      }[kind || 'tick'];
      plan.forEach(([f, at, len]) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = kind === 'buzz' ? 'sawtooth' : 'square'; o.frequency.value = f;
        g.gain.setValueAtTime(.12, actx.currentTime + at);
        g.gain.exponentialRampToValueAtTime(.001, actx.currentTime + at + len);
        o.connect(g); g.connect(actx.destination);
        o.start(actx.currentTime + at); o.stop(actx.currentTime + at + len + .02);
      });
    } catch (e) { /* no audio */ }
  }

  // ---------- countdown ----------
  // One live countdown at a time per element id. Survives re-rendering because it
  // works from an end timestamp held in the caller's state.
  function Countdown(opts) {
    // opts: { get(): {end, left, running}, set(obj), onEnd() }
    let handle = null, fired = false;
    function left() {
      const t = opts.get() || {};
      if (t.running) return Math.max(0, (t.end - Date.now()) / 1000);
      return t.left == null ? 0 : t.left;
    }
    function paint() {
      const l = left();
      $$('[data-timer="' + opts.id + '"]').forEach(el => {
        el.firstChild ? (el.firstChild.nodeValue = fmt(l)) : (el.textContent = fmt(l));
        el.classList.toggle('warn', l <= 15 && l > 0);
        el.classList.toggle('over', l <= 0);
      });
      const t = opts.get() || {};
      if (t.running && l <= 0 && !fired) { fired = true; beep('end'); if (opts.onEnd) opts.onEnd(); }
    }
    function loop() { clearInterval(handle); handle = setInterval(paint, 200); paint(); }
    return {
      start(sec) { fired = false; opts.set({ end: Date.now() + sec * 1000, left: sec, running: true, total: sec }); loop(); },
      pause() { const l = left(); const t = opts.get() || {}; opts.set(Object.assign({}, t, { left: l, running: false })); paint(); },
      resume() { const t = opts.get() || {}; fired = false; opts.set(Object.assign({}, t, { end: Date.now() + (t.left || 0) * 1000, running: true })); loop(); },
      add(sec) { const t = opts.get() || {}; if (t.running) opts.set(Object.assign({}, t, { end: t.end + sec * 1000 })); else opts.set(Object.assign({}, t, { left: (t.left || 0) + sec })); fired = false; paint(); },
      stop() { clearInterval(handle); },
      left, paint, loop
    };
  }

  // ---------- QR ----------
  function qrSvg(text) {
    if (!root.qrcode) return '<div class="mono">' + esc(text) + '</div>';
    const q = root.qrcode(0, 'M'); q.addData(text); q.make();
    return q.createSvgTag({ cellSize: 4, margin: 1, scalable: true });
  }
  // Every game has two complete scenarios: "rehearsal" for trying it out, "class" for the night itself.
  function variant() { return params().v === 'class' ? 'class' : 'rehearsal'; }
  // Writes the script tag for a game's scenario while the page is still loading.
  function need(game) {
    if (game !== 'council' && game !== 'leak') return;
    document.write('<script src="assets/' + game + '.' + variant() + '.js"><\/script>');
  }
  // Names travel in the URL fragment only: a fragment is never sent to any server.
  function seatUrl(game, room, seat, n, extra, names) {
    const u = new URL('seat.html', location.href);
    u.search = ''; u.hash = '';
    u.searchParams.set('g', game); u.searchParams.set('v', variant()); u.searchParams.set('r', room);
    u.searchParams.set('s', String(seat)); u.searchParams.set('n', String(n));
    Object.keys(extra || {}).forEach(k => { if (extra[k] != null) u.searchParams.set(k, String(extra[k])); });
    if (names && names.length) u.hash = names.map(encodeURIComponent).join('|');
    return u.toString();
  }
  function hashNames() {
    return location.hash.length > 1 ? location.hash.slice(1).split('|').map(s => { try { return decodeURIComponent(s); } catch (e) { return s; } }) : [];
  }

  // ---------- screen niceties ----------
  function fullscreen() {
    const d = document;
    if (d.fullscreenElement) d.exitFullscreen(); else if (d.documentElement.requestFullscreen) d.documentElement.requestFullscreen();
  }
  function keepAwake() {
    if (navigator.wakeLock) {
      const ask = () => navigator.wakeLock.request('screen').catch(() => {});
      ask(); document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') ask(); });
    }
  }
  // Session clock in the top bar: elapsed against the 90-minute class.
  function sessionClock(getStart, total) {
    const el = $('#clock'); if (!el) return;
    const paint = () => {
      const s = getStart();
      el.innerHTML = s ? fmt((Date.now() - s) / 1000) + ' <i>/ ' + (total || 90) + ':00</i>' : '';
    };
    paint(); setInterval(paint, 1000);
  }

  // ---------- live link (only The Panel needs it) ----------
  const BROKERS = [
    'wss://broker.emqx.io:8084/mqtt',
    'wss://broker.hivemq.com:8884/mqtt',
    'wss://test.mosquitto.org:8081/mqtt'
  ];
  function topic(room, leaf) { return 'cesio/parley/v1/' + room + '/' + leaf; }
  // open({room, role:'host'|'seat', broker?, onState, onAct, onStatus}) -> {send, publishState, close, index}
  function open(o) {
    const api = { index: -1, ok: false };
    let client = null, closed = false;
    function status(ok, text) { api.ok = ok; if (o.onStatus) o.onStatus(ok, text || ''); }
    function attach(i) {
      return new Promise(resolve => {
        if (!root.mqtt) { resolve(false); return; }
        let done = false;
        const c = root.mqtt.connect(BROKERS[i], {
          clientId: 'parley_' + o.role + '_' + Math.random().toString(16).slice(2, 10),
          clean: true, keepalive: 30, reconnectPeriod: 2000, connectTimeout: 6000
        });
        const giveUp = setTimeout(() => { if (!done) { done = true; try { c.end(true); } catch (e) { /* ignore */ } resolve(false); } }, 7000);
        c.on('connect', () => {
          if (done && client !== c) return;
          if (!done) { done = true; clearTimeout(giveUp); client = c; api.index = i; resolve(true); }
          c.subscribe(topic(o.room, o.role === 'host' ? 'a' : 's'), { qos: 1 });
          status(true, 'live');
        });
        c.on('message', (t, payload) => {
          let m = null; try { m = JSON.parse(payload.toString()); } catch (e) { return; }
          if (!m) return;
          if (o.role === 'host' && o.onAct) o.onAct(m); else if (o.role === 'seat' && o.onState) o.onState(m);
        });
        c.on('close', () => { if (client === c && !closed) status(false, 'reconnecting'); });
        c.on('error', () => { /* handled by timeout / reconnect */ });
      });
    }
    api.ready = (async () => {
      const order = o.broker != null && o.broker >= 0 ? [Number(o.broker)] : BROKERS.map((_, i) => i);
      for (const i of order) { if (await attach(i)) return true; }
      status(false, 'offline'); return false;
    })();
    api.publishState = state => { if (client && client.connected) client.publish(topic(o.room, 's'), JSON.stringify(state), { qos: 1, retain: true }); };
    api.send = act => { if (client && client.connected) { client.publish(topic(o.room, 'a'), JSON.stringify(act), { qos: 1 }); return true; } return false; };
    api.close = () => { closed = true; try { if (client) { if (o.role === 'host') client.publish(topic(o.room, 's'), '', { retain: true }); client.end(); } } catch (e) { /* ignore */ } };
    return api;
  }

  // The phrase bank shown as "on the record" strips: advanced ways of arguing.
  const PHRASES = [
    'I have grave misgivings about…', 'For the sake of argument, let us assume…', 'Be that as it may…',
    'I would venture to suggest…', 'That argument holds no water.', 'The crux of the matter is…',
    'With the best will in the world…', 'I take your point, but…', 'It might be prudent to…',
    'That is beside the point.', 'Let me play devil’s advocate.', 'Can we meet halfway?',
    'I am not prepared to concede that.', 'It is a moot point.', 'Reading between the lines…',
    'Put simply, albeit reductively…', 'I remain unconvinced.', 'That is the thin end of the wedge.',
    'We are miles apart on this.', 'You have hit the nail on the head.', 'To put it bluntly…',
    'By the same token…', 'That begs the question of…', 'I stand corrected.',
    'Far be it from me to…', 'It strikes me as short-sighted.', 'On balance, I would rather…',
    'That is a false economy.', 'Let us not get bogged down in detail.', 'Hindsight is a wonderful thing.',
    'I would be loath to…', 'It does not bear thinking about.', 'There is no getting away from the fact that…',
    'That is easier said than done.', 'At the risk of stating the obvious…', 'It cuts both ways.'
  ];
  function phrases(seed, n) { return sample(PHRASES, n || 3, rng('ph' + seed)); }

  root.K = { hash, rng, shuffle, sample, newCode, $, $$, esc, params, fmt, store, beep, Countdown, qrSvg, seatUrl, hashNames, variant, need, fullscreen, keepAwake, sessionClock, open, BROKERS, PHRASES, phrases };
})(typeof window !== 'undefined' ? window : globalThis);

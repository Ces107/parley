# Parley

Three ninety-minute conversation games for three or four advanced speakers of English. Open one on a shared screen; each player scans a code with their phone.

- **The Council**: govern a very small, very new country for a year. Every crisis is based on something that really happened to a small state.
- **The Leak**: a confidential paper reached a newspaper. Work out who sent it from six exhibits, then decide whether they were right.
- **The Panel**: four rounds in the manner of British radio panel shows, with phones as buzzers.

Every game has two complete scenarios that share nothing: **rehearsal**, for trying the game out, and **class** (`?v=class`), kept unseen for the night itself. The scenario files are `assets/council.rehearsal.js`, `assets/council.class.js`, `assets/leak.rehearsal.js` and `assets/leak.class.js`; The Panel splits its material in two inside `assets/panel.data.js`.

Static site, no build step. `node tools/check.js` checks both scenarios of every game and simulates play.

Live at https://cesio.es/parley/

# The Voicing Book

A Real Book-inspired jazz piano voicing practicer built with React, Vite and Tailwind CSS.

## Features

- MIDI keyboard input with exact-voicing or chord-tone validation.
- Auto-advance after a correct chord.
- Harmony studies, a dedicated circle-of-fifths drill, standards and custom changes.
- Ascending split-voicing notation across a grand staff.
- Proper sharp/flat spelling controls and visible accidentals.
- User-loaded drum loop plus optional bass root pulse.

## Project layout

```text
src/
  components/
    layout/PracticePage.jsx
    score/GrandStaff.jsx, PianoKeyboard.jsx
    settings/*.jsx
    ui/*.jsx
  constants/music.js
  hooks/useBackingTrack.js, useMidiInput.js, usePracticeSession.js, useProgression.js
  lib/musicTheory.js
  services/chartApi.js
  App.jsx
```

## Run locally

```bash
npm install
npm run dev
```

Open the localhost URL shown by Vite in Chrome or Edge. Web MIDI requires a secure context such as localhost or HTTPS and browser permission for the keyboard.

## Chart endpoint contract

Standard mode optionally accepts a CORS-enabled endpoint. Use `{title}` in the URL or accept a `title` query parameter. It should return one of:

```json
{ "chords": ["Dm7", "G7", "Cmaj7"] }
```

or a plain array of chord symbols.

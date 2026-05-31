import {
  FLAT_ROOTS,
  INTERVALS,
  LETTERS,
  NATURAL_INDEX,
  NATURAL_PITCH_CLASS,
  PITCH_CLASS,
  SHARP_ROOTS,
} from '../constants/music';

export const mod = value => ((value % 12) + 12) % 12;
export const unique = values => [...new Set(values)];
export const glyphName = name => String(name)
  .replaceAll('bb', '♭♭')
  .replaceAll('##', '♯♯')
  .replaceAll('b', '♭')
  .replaceAll('#', '♯');

export function rootAt(pitchClass, lowerMidi) {
  let midi = lowerMidi;
  while (mod(midi) !== pitchClass) midi += 1;
  return midi;
}

function replaceIgnoreCase(value, find, replacement) {
  let result = String(value);
  let index = result.toLowerCase().indexOf(find.toLowerCase());
  while (index >= 0) {
    result = result.slice(0, index) + replacement + result.slice(index + find.length);
    index = result.toLowerCase().indexOf(find.toLowerCase(), index + replacement.length);
  }
  return result;
}

export function parseChord(text) {
  let value = String(text).trim();
  [
    ['major minor', 'mMaj'], ['minor major', 'mMaj'], ['half-diminished', 'm7b5'],
    ['half diminished', 'm7b5'], ['diminished', 'dim'], ['major', 'maj'],
    ['minor', 'm'], ['flat', 'b'], ['sharp', '#'],
  ].forEach(([find, replacement]) => {
    value = replaceIgnoreCase(value, find, replacement);
  });
  value = value
    .replaceAll('Δ', 'maj')
    .replaceAll('ø7', 'm7b5')
    .replaceAll('ø', 'm7b5')
    .replaceAll('♭', 'b')
    .replaceAll('♯', '#')
    .replaceAll(' ', '');

  const letter = value.charAt(0).toUpperCase();
  if (!LETTERS.includes(letter)) return null;
  const accidental = ['#', 'b'].includes(value.charAt(1)) ? value.charAt(1) : '';
  const root = letter + accidental;
  if (PITCH_CLASS[root] === undefined) return null;

  let suffix = value.slice(accidental ? 2 : 1);
  if (suffix.charAt(0) === 'M' && (suffix.length === 1 || '0123456789'.includes(suffix.charAt(1)))) {
    suffix = 'maj' + suffix.slice(1);
  }
  if (suffix.charAt(0) === '-' && (suffix.length === 1 || '0123456789'.includes(suffix.charAt(1)))) {
    suffix = 'm' + suffix.slice(1);
  }
  return { root, pitchClass: PITCH_CLASS[root], suffix, symbol: root + suffix };
}

function chordQuality(chord) {
  const suffix = (chord?.suffix || '').toLowerCase();
  if (suffix.includes('mmaj')) return 'minor-major';
  if (suffix.includes('m7b5')) return 'half-diminished';
  if (suffix.includes('dim') || suffix.includes('°')) return 'diminished';
  if (suffix.startsWith('m') && !suffix.startsWith('maj')) return 'minor';
  if (suffix.includes('maj')) return 'major';
  if (['7', '9', '11', '13', 'alt'].some(extension => suffix.includes(extension))) return 'dominant';
  return 'major';
}

function third(chord) {
  return ['minor', 'minor-major', 'half-diminished', 'diminished'].includes(chordQuality(chord)) ? 'b3' : '3';
}
function isSixthChord(chord) {
  return (chord?.suffix || '').includes('6');
}
function seventh(chord) {
  if (isSixthChord(chord)) return '6';
  const quality = chordQuality(chord);
  if (quality === 'major' || quality === 'minor-major') return '7';
  if (quality === 'diminished') return 'bb7';
  return 'b7';
}
function basicFormula(chord) {
  const quality = chordQuality(chord);
  const suffix = chord?.suffix || '';
  const minorLike = ['minor', 'minor-major', 'half-diminished', 'diminished'].includes(quality);
  let degrees;
  if (isSixthChord(chord)) {
    degrees = minorLike ? ['1', 'b3', '5', '6'] : ['1', '3', '5', '6'];
  } else {
    degrees = quality === 'minor-major' ? ['1', 'b3', '5', '7']
      : quality === 'half-diminished' ? ['1', 'b3', 'b5', 'b7']
        : quality === 'diminished' ? ['1', 'b3', 'b5', 'bb7']
          : quality === 'minor' ? ['1', 'b3', '5', 'b7']
            : quality === 'dominant' ? ['1', '3', '5', 'b7']
              : ['1', '3', '5', '7'];
  }
  if (suffix.toLowerCase().includes('alt')) degrees = [...degrees, 'b9', '#11', 'b13'];
  else {
    if (suffix.includes('b9')) degrees.push('b9');
    else if (suffix.includes('#9')) degrees.push('#9');
    else if (suffix.includes('9')) degrees.push('9');
    if (suffix.includes('#11')) degrees.push('#11');
    else if (suffix.includes('11')) degrees.push('11');
    if (suffix.includes('b13')) degrees.push('b13');
    else if (suffix.includes('13')) degrees.push('13');
  }
  return unique(degrees);
}

export function voicingRecipe(chord, voicingId, customFormula) {
  const thirdTone = third(chord);
  const seventhTone = seventh(chord);
  switch (voicingId) {
    case 'shell': return ['1', seventhTone, thirdTone, '9', '13'];
    case 'rootlessA': return [thirdTone, seventhTone, '9', '13'];
    case 'rootlessB': return [seventhTone, thirdTone, '13', '9'];
    case 'kenny': return ['1', '5', '9', '11', seventhTone, thirdTone];
    case 'spread': return ['1', '5', '13', seventhTone, thirdTone];
    case 'custom': {
      const values = customFormula.split(',').map(value => value.trim()).filter(value => INTERVALS[value] !== undefined);
      return values.length ? values : ['1', '5', '13', seventhTone, thirdTone];
    }
    default: return basicFormula(chord).slice(0, 5);
  }
}

export function voicedNotes(chord, voicingId, customFormula, inversion = 0) {
  if (!chord) return [];
  const degrees = voicingRecipe(chord, voicingId, customFormula);
  const inv = inversion % degrees.length;
  const rotatedDegrees = inv > 0 ? [...degrees.slice(inv), ...degrees.slice(0, inv)] : degrees;
  const lowerRoot = voicingId.startsWith('rootless') ? 48 : voicingId === 'ascending' ? 48 : 36;
  const root = rootAt(chord.pitchClass, lowerRoot);
  const leftHandCount = voicingId === 'ascending' ? Math.min(2, degrees.length) : Math.max(2, Math.ceil(degrees.length / 2));
  let previous = root + 11;
  return rotatedDegrees.map((degree, index) => {
    let midi = root + INTERVALS[degree] + 12;
    while (midi <= previous) midi += 12;
    previous = midi;
    return { midi, degree, hand: index < leftHandCount ? 'LH' : 'RH' };
  });
}

export function spellingStyle(preference, rootName) {
  if (preference === 'flats' || preference === 'sharps') return preference;
  if (String(rootName).includes('b')) return 'flats';
  if (String(rootName).includes('#')) return 'sharps';
  return ['G', 'D', 'A', 'E', 'B'].includes(rootName) ? 'sharps' : 'flats';
}
export function pitchName(pitchClass, style) {
  return (style === 'sharps' ? SHARP_ROOTS : FLAT_ROOTS)[mod(pitchClass)];
}
export function displayRoot(chord, preference) {
  return pitchName(chord.pitchClass, spellingStyle(preference, chord.root));
}
export function displayChordSymbol(chord, preference) {
  return chord ? glyphName(displayRoot(chord, preference)) + chord.suffix : '—';
}
function degreeNumber(degree) {
  const number = Number(String(degree).replaceAll('b', '').replaceAll('#', ''));
  return number > 7 ? number - 7 : number;
}
export function spelledDegree(chord, degree, preference) {
  const root = displayRoot(chord, preference);
  const letter = LETTERS[(LETTERS.indexOf(root.charAt(0)) + degreeNumber(degree) - 1) % 7];
  const pitchClass = mod(chord.pitchClass + INTERVALS[degree]);
  const delta = mod(pitchClass - NATURAL_PITCH_CLASS[letter]);
  const accidental = delta === 0 ? '' : delta === 1 ? '#' : delta === 2 ? '##' : delta === 11 ? 'b' : delta === 10 ? 'bb' : '';
  return letter + accidental;
}
export function writtenNote(note, chord, preference) {
  const name = spelledDegree(chord, note.degree, preference);
  return { name, accidental: name.slice(1), label: glyphName(name) + (Math.floor(note.midi / 12) - 1) };
}
export function staffStep(note, chord, preference) {
  const letter = writtenNote(note, chord, preference).name.charAt(0);
  const octave = Math.floor(note.midi / 12) - 1;
  return (octave - 4) * 7 + NATURAL_INDEX[letter];
}
export function parseChordList(text) {
  return text.split(',').map(parseChord).filter(Boolean).map(chord => chord.symbol);
}
export function createHarmonyProgression(key, difficulty, preference) {
  const style = spellingStyle(preference, key);
  return Array.from({ length: 4 }, (_, index) => mod(PITCH_CLASS[key] + index * 7)).flatMap((centre, index) => {
    const one = pitchName(centre, style);
    const two = pitchName(centre + 2, style);
    const five = pitchName(centre + 7, style);
    if (difficulty === 'Easy') return [two + 'm7', five + '7', one + 'maj7'];
    if (difficulty === 'Medium') return [two + 'm7', pitchName(centre + 1, style) + 'dim7', five + '7', one + 'maj7'];
    return index % 2 === 0 ? [two + 'm7b5', five + '7alt', one + 'mMaj7'] : [two + 'm9', five + '13b9', one + 'maj9#11'];
  });
}
export function createFifthsProgression(key, quality, direction, preference) {
  const style = spellingStyle(preference, key);
  const step = direction === 'clockwise' ? 7 : 5;
  return Array.from({ length: 12 }, (_, index) => pitchName(PITCH_CLASS[key] + step * index, style) + quality);
}
export function isAcceptedVoicing(heldNotes, targetNotes, validationMode) {
  if (!heldNotes.length) return false;
  if (validationMode === 'exact') {
    return targetNotes.every(note => heldNotes.includes(note)) && heldNotes.every(note => targetNotes.includes(note));
  }
  const playedPitchClasses = unique(heldNotes.map(mod));
  return unique(targetNotes.map(mod)).every(pitchClass => playedPitchClasses.includes(pitchClass));
}

import { displayChordSymbol, glyphName, staffStep, writtenNote } from '../../lib/musicTheory';

const TOP_LINES = [200, 184, 168, 152, 136];
const BASS_LINES = [232, 248, 264, 280, 296];
const MIDDLE_C_Y = 216;
const STEP_HEIGHT = 8;

function ledgerSteps(step) {
  const result = [];
  if (step === 0) result.push(0);
  if (step > 10) for (let cursor = 12; cursor <= step; cursor += 2) result.push(cursor);
  if (step < -10) for (let cursor = -12; cursor >= step; cursor -= 2) result.push(cursor);
  return result;
}

export function GrandStaff({ chord, notes, spelling, bpm, labels }) {
  const xStart = 430;
  const xEnd = 1135;
  const positions = notes.length < 2 ? [(xStart + xEnd) / 2] : notes.map((_, index) => xStart + ((xEnd - xStart) / (notes.length - 1)) * index);
  const placed = notes.map((note, index) => {
    const step = staffStep(note, chord, spelling);
    return { note, written: writtenNote(note, chord, spelling), step, x: positions[index], y: MIDDLE_C_Y - step * STEP_HEIGHT };
  });
  const handNotes = hand => placed.filter(item => item.note.hand === hand);

  return <svg viewBox="0 0 1400 560" className="h-full w-full border-y border-[#281e1224]" aria-label={`Written voicing for ${displayChordSymbol(chord, spelling)}`}>
    <text x="42" y="64" className="fill-[#241b12] font-display text-[62px] font-bold">{displayChordSymbol(chord, spelling)}</text>
    <text x="1008" y="66" className="fill-[#241b12] font-book text-[22px] tracking-[0.11em]">MED. SWING ♩ = {bpm}</text>
    {[...TOP_LINES, ...BASS_LINES].map((y, index) => <line key={index} x1="62" x2="1338" y1={y} y2={y} className="stroke-[#1d1811] stroke-[2.1]" />)}
    <line x1="62" x2="62" y1="136" y2="296" className="stroke-[#1d1811] stroke-[3]" /><line x1="1338" x2="1338" y1="136" y2="296" className="stroke-[#1d1811] stroke-[3]" />
    <path d="M61 136 Q42 155 61 170 Q42 186 61 200 M61 232 Q42 246 61 264 Q42 282 61 296" className="fill-none stroke-[#1d1811] stroke-[3]" />
    <text x="82" y="194" className="fill-[#1d1811] text-[92px]">𝄞</text><text x="86" y="282" className="fill-[#1d1811] text-[76px]">𝄢</text>
    <text x="184" y="182" className="fill-[#1d1811] text-[48px] font-bold">4</text><text x="184" y="222" className="fill-[#1d1811] text-[48px] font-bold">4</text>
    <text x="184" y="278" className="fill-[#1d1811] text-[48px] font-bold">4</text><text x="184" y="318" className="fill-[#1d1811] text-[48px] font-bold">4</text>
    {placed.map(({ note, written, step, x, y }) => <g key={`${note.midi}-${note.degree}`}>
      {ledgerSteps(step).map(lineStep => <line key={lineStep} x1={x - 22} x2={x + 22} y1={MIDDLE_C_Y - lineStep * STEP_HEIGHT} y2={MIDDLE_C_Y - lineStep * STEP_HEIGHT} className="stroke-[#1d1811] stroke-[2.1]" />)}
      {written.accidental && <text x={x - 44} y={y + 13} textAnchor="middle" className="fill-[#15110d] font-book text-[39px]">{glyphName(written.accidental)}</text>}
      <ellipse cx={x} cy={y} rx="18" ry="11.5" transform={`rotate(-18 ${x} ${y})`} className="fill-[#15110d]" />
      <line x1={step < 5 ? x + 14 : x - 14} x2={step < 5 ? x + 14 : x - 14} y1={y} y2={step < 5 ? y - 66 : y + 66} className="stroke-[#15110d] stroke-[3.1]" />
      {labels && <><rect x={x - 37} y={(step < 5 ? y + 32 : y - 54) - 18} width="74" height="32" rx="14" className="fill-[#ebdeb9] stroke-[#665039] stroke-[1.8]" /><text x={x} y={(step < 5 ? y + 32 : y - 54) + 6} textAnchor="middle" className="fill-[#382b20] font-display text-[28px] font-bold">{written.label}</text></>}
      <text x={x} y="416" textAnchor="middle" className="fill-[#382b20] font-display text-[30px]">{note.degree}</text>
    </g>)}
    {['LH', 'RH'].map(hand => {
      const group = handNotes(hand);
      if (!group.length) return null;
      const begin = group[0].x - 58;
      const end = group[group.length - 1].x + 58;
      return <g key={hand}><text x={(begin + end) / 2} y="468" textAnchor="middle" className="fill-[#382b20] font-display text-[36px] font-bold">{hand}</text><path d={`M${begin} 486 L${end} 486`} className="stroke-[#554334] stroke-[2] [stroke-dasharray:8_8]" /></g>;
    })}
    <text x="765" y="524" textAnchor="middle" className="fill-[#382b20] font-display text-[24px]">ascending split voicing · play together to pass</text>
  </svg>;
}

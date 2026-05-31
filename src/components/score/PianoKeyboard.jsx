import { mod } from '../../lib/musicTheory';

export function PianoKeyboard({ held, target }) {
  const lowestMidi = 36;
  const offsets = Array.from({ length: 60 }, (_, index) => index);
  const whiteKeys = offsets.filter(offset => [0, 2, 4, 5, 7, 9, 11].includes(mod(lowestMidi + offset)));
  const blackKeys = offsets.filter(offset => ![0, 2, 4, 5, 7, 9, 11].includes(mod(lowestMidi + offset)));
  const width = 100 / whiteKeys.length;
  const whiteClass = midi => held.includes(midi) ? 'bg-gradient-to-b from-[#e1ecd6] to-[#95b77e]' : target.includes(midi) ? 'bg-gradient-to-b from-[#fff4d7] to-[#d5bc87]' : 'bg-gradient-to-b from-[#fff6de] to-[#e9dbb9]';
  const blackClass = midi => held.includes(midi) ? 'bg-gradient-to-b from-[#638957] to-[#263b24]' : target.includes(midi) ? 'bg-gradient-to-b from-[#806947] to-[#392d20]' : 'bg-gradient-to-r from-[#17130f] via-[#493e32] to-[#17130f]';

  return <div className="relative h-[100px] overflow-hidden rounded-md border-[6px] border-[#30271d] bg-[#30271d]">
    {whiteKeys.map((offset, index) => <div key={offset} className={`absolute h-full rounded-b border-r border-[#88745b] ${whiteClass(lowestMidi + offset)}`} style={{ left: `${index * width}%`, width: `${width}%` }} />)}
    {blackKeys.map(offset => {
      const previousWhites = whiteKeys.filter(white => white < offset).length;
      return <div key={offset} className={`absolute z-10 h-[60%] rounded-b ${blackClass(lowestMidi + offset)}`} style={{ left: `${previousWhites * width - width * 0.29}%`, width: `${width * 0.57}%` }} />;
    })}
  </div>;
}

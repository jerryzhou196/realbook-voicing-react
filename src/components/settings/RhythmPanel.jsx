import { Panel } from '../ui/Panel';
import { Toggle } from '../ui/Toggle';

export function RhythmPanel({ backing }) {
  return <Panel title="Rhythm Section">
    <Toggle label="Loop uploaded drum track" checked={backing.drumsEnabled} onChange={backing.setDrumsEnabled} />
    <Toggle label="Bass root pulse" checked={backing.bassEnabled} onChange={backing.setBassEnabled} />
    <label className="mt-2 block cursor-pointer rounded-md border border-dashed border-[#80684b] px-3 py-2.5 text-center text-[11px] text-[#d9c397]">LOAD YOUR DRUM LOOP<input type="file" accept="audio/*" className="hidden" onChange={backing.loadDrumLoop} /></label>
    <p className="mt-2 text-[11px] text-[#c3ad85]">{backing.fileName}</p>
    <div className="my-3 flex items-center gap-3 text-xs"><span>♩ {backing.bpm}</span><input type="range" min="45" max="150" value={backing.bpm} onChange={event => backing.setBpm(Number(event.target.value))} className="flex-1 accent-[#caae70]" /></div>
    <button onClick={backing.togglePlayback} className="w-full rounded-md border border-[#bea371] bg-[#e6d1a3] px-3 py-2.5 text-xs text-[#31251a]">{backing.playing ? '■ STOP' : '▶ PLAY'}</button>
    <audio ref={backing.audioRef} loop />
  </Panel>;
}

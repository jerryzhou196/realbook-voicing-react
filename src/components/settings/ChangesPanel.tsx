import { KEY_OPTIONS, STANDARDS } from '../../constants/music';
import { glyphName } from '../../lib/musicTheory';
import { Field, Select, TextInput, TextArea } from '../ui/Field';
import { Panel } from '../ui/Panel';
import type { ProgressionState } from '../../hooks/useProgression';

interface ChangesPanelProps {
  progression: ProgressionState;
}
export function ChangesPanel({ progression }: ChangesPanelProps) {
  return (
    <Panel title="Changes">
      {progression.mode === 'harmony' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Starting key">
              <Select value={progression.keyName} onChange={e => progression.setKeyName(e.target.value)}>
                {KEY_OPTIONS.map(root => <option value={root} key={root}>{glyphName(root)}</option>)}
              </Select>
            </Field>
            <Field label="Difficulty">
              <Select value={progression.difficulty} onChange={e => progression.setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}>
                <option>Easy</option><option>Medium</option><option>Hard</option>
              </Select>
            </Field>
          </div>
          <p className="mb-3 text-[11px] leading-relaxed text-[#c3ad85]">ii–V–I movements through related centres.</p>
        </>
      )}
      {progression.mode === 'fifths' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Starting root">
              <Select value={progression.keyName} onChange={e => progression.setKeyName(e.target.value)}>
                {KEY_OPTIONS.map(root => <option value={root} key={root}>{glyphName(root)}</option>)}
              </Select>
            </Field>
            <Field label="Chord quality">
              <Select value={progression.fifthsQuality} onChange={e => progression.setFifthsQuality(e.target.value)}>
                <optgroup label="Major">
                  <option value="maj7">Major 7</option>
                  <option value="maj9">Major 9</option>
                  <option value="6">Major 6</option>
                </optgroup>
                <optgroup label="Dominant">
                  <option value="7">Dominant 7</option>
                  <option value="9">Dominant 9</option>
                  <option value="13">Dominant 13</option>
                  <option value="7sus4">Dominant 7 sus 4</option>
                  <option value="7alt">Dominant 7 altered</option>
                </optgroup>
                <optgroup label="Minor">
                  <option value="m7">Minor 7</option>
                  <option value="m9">Minor 9</option>
                  <option value="m6">Minor 6</option>
                  <option value="mMaj7">Minor major 7</option>
                </optgroup>
                <optgroup label="Diminished / Half-diminished">
                  <option value="m7b5">Minor 7 flat 5</option>
                  <option value="dim7">Diminished 7</option>
                </optgroup>
                <optgroup label="Augmented">
                  <option value="aug7">Augmented 7</option>
                  <option value="augMaj7">Augmented major 7</option>
                </optgroup>
              </Select>
            </Field>
          </div>
          <Field label="Direction">
            <Select value={progression.fifthsDirection} onChange={e => progression.setFifthsDirection(e.target.value as 'resolving' | 'clockwise')}>
              <option value="resolving">Resolving: C → F → B♭</option>
              <option value="clockwise">Clockwise: C → G → D</option>
            </Select>
          </Field>
        </>
      )}
      {progression.mode === 'standard' && (
        <>
          <Field label="Built-in chart">
            <Select value={progression.standard} onChange={e => { progression.setStandard(e.target.value); progression.clearRemoteChanges(); }}>
              {Object.keys(STANDARDS).map(name => <option key={name}>{name}</option>)}
            </Select>
          </Field>
          <div className="flex items-end gap-2">
            <Field label="Chart title" className="flex-1">
              <TextInput value={progression.chartQuery} onChange={e => progression.setChartQuery(e.target.value)} />
            </Field>
            <button onClick={progression.loadChart} className="mb-3 rounded-md border border-[#bea371] bg-[#e6d1a3] px-3 py-2.5 text-xs text-[#31251a]">FETCH</button>
          </div>
          <Field label="Optional JSON API URL">
            <TextInput value={progression.endpoint} onChange={e => progression.setEndpoint(e.target.value)} placeholder="https://api.example/tune/{title}" />
          </Field>
          <p className="text-[11px] leading-relaxed text-[#c3ad85]">{progression.apiStatus}</p>
        </>
      )}
      {progression.mode === 'custom' && (
        <Field label="Changes (commas or new lines)">
          <TextArea value={progression.customText} onChange={e => progression.setCustomText(e.target.value)} placeholder={'CM7, Am7b5, D7alt, GmMaj7\nor one chord per line'} />
        </Field>
      )}
    </Panel>
  );
}

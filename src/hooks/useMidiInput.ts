import { useEffect, useRef, useState } from 'react';

interface MidiDevice {
  id: string;
  name: string;
}

export interface MidiInputState {
  connect: () => Promise<void>;
  status: string;
  inputs: MidiDevice[];
  selectedInput: string;
  setSelectedInput: (id: string) => void;
  connected: boolean;
}

export function useMidiInput({
  onNoteOn,
  onNoteOff,
}: {
  onNoteOn: (midi: number) => void;
  onNoteOff: (midi: number) => void;
}): MidiInputState {
  const accessRef = useRef<MIDIAccess | null>(null);
  const [status, setStatus] = useState('No MIDI keyboard connected');
  const [inputs, setInputs] = useState<MidiDevice[]>([]);
  const [selectedInput, setSelectedInput] = useState('');

  async function connect(): Promise<void> {
    if (!navigator.requestMIDIAccess) {
      setStatus('Web MIDI is unavailable in this browser.');
      return;
    }
    try {
      accessRef.current = await navigator.requestMIDIAccess();
      const refreshInputs = () => {
        const devices = [...accessRef.current!.inputs.values()];
        setInputs(devices.map(d => ({ id: d.id, name: d.name ?? 'MIDI keyboard' })));
        if (devices[0]) setSelectedInput(current => current || devices[0].id);
        setStatus(
          devices.length
            ? `${devices.length} input device${devices.length > 1 ? 's' : ''} ready`
            : 'Permission granted — attach a keyboard.',
        );
      };
      refreshInputs();
      accessRef.current.onstatechange = refreshInputs;
    } catch {
      setStatus('MIDI access blocked or declined.');
    }
  }

  useEffect(() => {
    if (!accessRef.current) return;
    for (const input of accessRef.current.inputs.values()) input.onmidimessage = null;
    const selected = accessRef.current.inputs.get(selectedInput);
    if (!selected) return;
    selected.onmidimessage = (event: MIDIMessageEvent) => {
      if (!event.data) return;
      const [statusByte, midi, velocity] = event.data;
      const command = statusByte & 240;
      if (command === 144 && velocity > 0) onNoteOn(midi);
      if (command === 128 || (command === 144 && velocity === 0)) onNoteOff(midi);
    };
    return () => { selected.onmidimessage = null; };
  }, [selectedInput, inputs.length, onNoteOn, onNoteOff]);

  return { connect, status, inputs, selectedInput, setSelectedInput, connected: inputs.length > 0 };
}

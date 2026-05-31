import { useEffect, useRef, useState } from 'react';

export function useMidiInput({ onNoteOn, onNoteOff }) {
  const accessRef = useRef(null);
  const [status, setStatus] = useState('No MIDI keyboard connected');
  const [inputs, setInputs] = useState([]);
  const [selectedInput, setSelectedInput] = useState('');

  async function connect() {
    if (!navigator.requestMIDIAccess) {
      setStatus('Web MIDI is unavailable in this browser.');
      return;
    }
    try {
      accessRef.current = await navigator.requestMIDIAccess();
      const refreshInputs = () => {
        const devices = [...accessRef.current.inputs.values()];
        setInputs(devices.map(device => ({ id: device.id, name: device.name || 'MIDI keyboard' })));
        if (devices[0]) setSelectedInput(current => current || devices[0].id);
        setStatus(devices.length ? `${devices.length} input device${devices.length > 1 ? 's' : ''} ready` : 'Permission granted — attach a keyboard.');
      };
      refreshInputs();
      accessRef.current.onstatechange = refreshInputs;
    } catch (error) {
      setStatus('MIDI access blocked or declined.');
    }
  }

  useEffect(() => {
    if (!accessRef.current) return undefined;
    for (const input of accessRef.current.inputs.values()) input.onmidimessage = null;
    const selected = accessRef.current.inputs.get(selectedInput);
    if (!selected) return undefined;
    selected.onmidimessage = event => {
      const [statusByte, midi, velocity] = event.data;
      const command = statusByte & 240;
      if (command === 144 && velocity > 0) onNoteOn(midi);
      if (command === 128 || (command === 144 && velocity === 0)) onNoteOff(midi);
    };
    return () => { selected.onmidimessage = null; };
  }, [selectedInput, inputs.length, onNoteOn, onNoteOff]);

  return { connect, status, inputs, selectedInput, setSelectedInput, connected: inputs.length > 0 };
}

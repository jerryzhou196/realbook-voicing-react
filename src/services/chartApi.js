import { parseChord } from '../lib/musicTheory';

export async function fetchChordChart(endpoint, title) {
  const url = endpoint.includes('{title}')
    ? endpoint.replace('{title}', encodeURIComponent(title))
    : `${endpoint}${endpoint.includes('?') ? '&' : '?'}title=${encodeURIComponent(title)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Chart source returned ${response.status}.`);
  const data = await response.json();
  const changes = Array.isArray(data) ? data : data.chords || data.progression || data.changes || [];
  const parsed = changes.map(value => parseChord(String(value))?.symbol).filter(Boolean);
  if (!parsed.length) throw new Error('The chart source returned no recognized chord symbols.');
  return parsed;
}

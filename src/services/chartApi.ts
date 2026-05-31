import { parseChord } from '../lib/musicTheory';

export async function fetchChordChart(endpoint: string, title: string): Promise<string[]> {
  const url = endpoint.includes('{title}')
    ? endpoint.replace('{title}', encodeURIComponent(title))
    : `${endpoint}${endpoint.includes('?') ? '&' : '?'}title=${encodeURIComponent(title)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Chart source returned ${response.status}.`);
  const data: unknown = await response.json();
  const raw = Array.isArray(data)
    ? data
    : (data as Record<string, unknown>).chords
      ?? (data as Record<string, unknown>).progression
      ?? (data as Record<string, unknown>).changes
      ?? [];
  const changes = Array.isArray(raw) ? (raw as unknown[]) : [];
  const parsed = changes.map(v => parseChord(String(v))?.symbol).filter((s): s is string => Boolean(s));
  if (!parsed.length) throw new Error('The chart source returned no recognized chord symbols.');
  return parsed;
}

// Pure helpers for turning tmux's `-F` output into menu data. No I/O here so
// these are trivially unit-testable; the tmux side-effects live in tmux.ts.

export interface Session {
  name: string;
  windows: number;
  attached: boolean;
  activity: number;
}

export type MenuKind = 'session' | 'new' | 'quit';

export interface MenuItem {
  /** A real session name, or one of the sentinels __new__ / __quit__. */
  token: string;
  label: string;
  kind: MenuKind;
  session?: Session;
}

export const NEW_TOKEN = '__new__';
export const QUIT_TOKEN = '__quit__';

// The field order produced by tmux list-sessions -F (see tmux.ts):
//   <activity>\t<name>\t<windows>\t<attached 1|0>
export function parseSessions(raw: string): Session[] {
  if (!raw) return [];
  const sessions: Session[] = [];
  for (const line of raw.split('\n')) {
    if (line.trim() === '') continue;
    const [activity, name, windows, attached] = line.split('\t');
    if (name === undefined || name === '') continue;
    sessions.push({
      name,
      windows: Number.parseInt(windows ?? '0', 10) || 0,
      attached: attached === '1',
      activity: Number.parseInt(activity ?? '0', 10) || 0,
    });
  }
  return sessions;
}

function sessionLabel(s: Session): string {
  return `${s.name} — ${s.windows} win${s.attached ? ' • attached' : ''}`;
}

// Sessions ordered most-recently-active first, then the two action rows.
export function buildMenuItems(sessions: Session[]): MenuItem[] {
  const ordered = [...sessions].sort((a, b) => b.activity - a.activity);
  const items: MenuItem[] = ordered.map((s) => ({
    token: s.name,
    label: sessionLabel(s),
    kind: 'session',
    session: s,
  }));
  items.push({ token: NEW_TOKEN, label: '＋ new session', kind: 'new' });
  items.push({ token: QUIT_TOKEN, label: '✕ quit to shell', kind: 'quit' });
  return items;
}

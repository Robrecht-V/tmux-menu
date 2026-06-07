// Thin wrappers around the tmux CLI. Everything here is side-effecting; keep
// it dumb so the interesting logic stays in the pure modules.
import { spawnSync } from 'node:child_process';
import { parseSessions, Session } from './sessions';

const LIST_FORMAT =
  '#{session_activity}\t#{session_name}\t#{session_windows}\t#{?session_attached,1,0}';

function tmux(args: string[]): { status: number; stdout: string; stderr: string } {
  const r = spawnSync('tmux', args, { encoding: 'utf8' });
  return {
    status: r.status ?? 1,
    stdout: r.stdout ?? '',
    stderr: r.stderr ?? '',
  };
}

export function hasTmux(): boolean {
  const r = spawnSync('tmux', ['-V'], { encoding: 'utf8' });
  return r.status === 0;
}

export function listSessions(): Session[] {
  const r = tmux(['list-sessions', '-F', LIST_FORMAT]);
  if (r.status !== 0) return [];
  return parseSessions(r.stdout);
}

export function hasSession(name: string): boolean {
  return tmux(['has-session', '-t', name]).status === 0;
}

// Window preview for a highlighted session. Returns the placeholder when the
// session has no preview (e.g. the +new / quit rows, or a vanished session).
export function listWindows(name: string): string {
  const r = tmux(['list-windows', '-t', name]);
  const out = r.stdout.trimEnd();
  if (r.status !== 0 || out === '') return '(new / no preview)';
  return out;
}

export function renameSession(oldName: string, newName: string): boolean {
  return tmux(['rename-session', '-t', oldName, newName]).status === 0;
}

export function killSession(name: string): boolean {
  return tmux(['kill-session', '-t', name]).status === 0;
}

// Attach / create hand the terminal over to tmux (inherited stdio), so these
// block until the user detaches.
export function attachSession(name: string): void {
  spawnSync('tmux', ['attach-session', '-t', name], { stdio: 'inherit' });
}

export function newSession(name: string): void {
  spawnSync('tmux', ['new-session', '-s', name], { stdio: 'inherit' });
}

// sanitizeName mirrors the old zsh prompt: tmux forbids '.' and ':' in session
// names, so we keep things strict and predictable by collapsing anything
// outside [A-Za-z0-9_-] to '_'. Empty / whitespace-only input is invalid.
export function sanitizeName(input: string | null | undefined): string | null {
  if (input == null) return null;
  const trimmed = input.trim();
  if (trimmed === '') return null;
  return trimmed.replace(/[^A-Za-z0-9_-]/g, '_');
}

import { VERSION } from './version';

const HELP = `tmux-menu — a tmux session chooser (Ink TUI).

Usage:
  tmux-menu            interactive chooser loop (default)
  tmux-menu --help     show this help
  tmux-menu --version  print the version

Keys:
  enter   attach to the selected session (or create a new one)
  ctrl-r  rename the selected session
  ctrl-x  kill the selected session
  esc     quit to a plain shell

On detach the menu reopens (kiosk loop) until you quit to a plain shell.`;

export async function main(argv: string[]): Promise<number> {
  const arg = argv[0];

  if (arg === '--help' || arg === '-h') {
    process.stdout.write(HELP + '\n');
    return 0;
  }
  if (arg === '--version' || arg === '-V') {
    process.stdout.write(`tmux-menu ${VERSION}\n`);
    return 0;
  }
  if (arg !== undefined) {
    process.stderr.write(`tmux-menu: unknown argument: ${arg} (try --help)\n`);
    return 2;
  }

  // No arguments: run the interactive app. Imported lazily so the fast paths
  // above (and --version from a no-TTY context) don't spin up Ink.
  const { runApp } = await import('./app');
  await runApp();
  return 0;
}

main(process.argv.slice(2))
  .then((code) => {
    if (code !== 0) process.exitCode = code;
  })
  .catch((err) => {
    process.stderr.write(`tmux-menu: ${err?.message ?? err}\n`);
    process.exitCode = 1;
  });

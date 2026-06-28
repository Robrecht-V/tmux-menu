# tmux-menu

A tmux session chooser built with [Ink](https://github.com/vadimdemedes/ink)
(React for the terminal). Greets a shell with a list of existing tmux sessions:
attach, create, rename, or kill — then re-shows itself on detach (kiosk loop)
until you quit to a plain shell.

```
enter: attach   ctrl-r: rename   ctrl-x: kill   esc: quit

❯ work — 3 win • attached   ╭───────────────────╮
  scratch — 1 win           │ 0: zsh             │
  ＋ new session             │ 1: vim            │
  ✕ quit to shell           ╰───────────────────╯
```

## Requirements

- `node` (>= 18) and `tmux` on `PATH`.

The shipped `bin/tmux-menu` is a single self-contained bundle (all node
dependencies are baked in), so no `node_modules` is needed at runtime.

## Install

```sh
git clone https://github.com/Robrecht-V/tmux-menu.git
cd tmux-menu
./install.sh                       # -> ~/.local/bin/tmux-menu
```

Or, one-liner (installs to `~/.local/bin`):

```sh
curl -fsSL https://raw.githubusercontent.com/Robrecht-V/tmux-menu/master/install.sh | bash
```

System-wide (e.g. inside a container image, for all users):

```sh
sudo ./install.sh --prefix /usr/local   # -> /usr/local/bin/tmux-menu
```

Make sure the install dir is on your `PATH` (`~/.local/bin` often already is).

## Usage

```sh
tmux-menu            # interactive chooser (the normal entrypoint)
tmux-menu --help
tmux-menu --version
```

Keys inside the chooser:

- `enter` — attach to the highlighted session, or create a new one on `＋ new session`
- `ctrl-r` — rename the highlighted session
- `ctrl-x` — kill the highlighted session
- `esc` — quit to a plain shell

On detach the menu reopens (kiosk loop) until you quit.

## Run it on shell login

Add to `~/.zshrc` to show the chooser on each interactive SSH login (not when
already inside tmux, not in VS Code's remote terminal, with `TMUX_NO_MENU=` as
a manual opt-out):

```zsh
if [[ $- == *i* && -z "$TMUX" && -z "$TMUX_NO_MENU" && -t 1 ]] \
   && [[ "$TERM_PROGRAM" != "vscode" ]] \
   && command -v tmux-menu &> /dev/null; then
  tmux-menu
fi
```

## Development

The source is TypeScript under `src/`, bundled with esbuild into the single
`bin/tmux-menu` executable.

```sh
npm ci
npm run build     # -> bin/tmux-menu (#!/usr/bin/env node)
npm test          # vitest unit + Ink component tests
npm run typecheck
```

## License

MIT — see [LICENSE](LICENSE).

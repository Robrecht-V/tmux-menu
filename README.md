# tmux-menu

An fzf-driven tmux session chooser. Greets a shell with a list of existing
tmux sessions: attach, create, rename, or kill — then re-shows itself on
detach (kiosk loop) until you quit to a plain shell.

```
tmux ❯
  work — 3 win • attached
  scratch — 1 win
  ＋ new session
  ✕ quit to shell

  enter: attach   ctrl-r: rename   ctrl-x: kill   esc: quit
```

## Requirements

- `zsh`, `tmux`, `fzf` on `PATH`.

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

`--list` and `--rename` are internal modes used by the fzf key bindings.

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

## License

MIT — see [LICENSE](LICENSE).

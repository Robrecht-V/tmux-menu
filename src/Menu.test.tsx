import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render } from 'ink-testing-library';
import { Menu, HEADER_HINT } from './Menu';
import { buildMenuItems, MenuItem, Session } from './sessions';

const SESSIONS: Session[] = [
  { name: 'work', windows: 3, attached: true, activity: 30 },
  { name: 'scratch', windows: 1, attached: false, activity: 20 },
];

const DOWN = '[B';
const ENTER = '\r';
const CTRL_R = '';
const CTRL_X = '';

const delay = (ms = 60) => new Promise((r) => setTimeout(r, ms));

describe('Menu', () => {
  test('menu renders rows for each session plus new/quit and the header hint', () => {
    const items = buildMenuItems(SESSIONS);
    const { lastFrame } = render(
      <Menu items={items} onSelect={() => {}} previewFor={() => 'preview'} />,
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('work — 3 win • attached');
    expect(frame).toContain('scratch — 1 win');
    expect(frame).toContain('＋ new session');
    expect(frame).toContain('✕ quit to shell');
    expect(frame).toContain(HEADER_HINT);
  });

  test('down then enter selects the second list item and reports its token', async () => {
    const items = buildMenuItems(SESSIONS);
    const onSelect = vi.fn();
    const { stdin } = render(
      <Menu items={items} onSelect={onSelect} previewFor={() => 'preview'} />,
    );
    await delay(); // let Ink subscribe its input handler before the first key
    stdin.write(DOWN);
    await delay();
    stdin.write(ENTER);
    await delay();
    expect(onSelect).toHaveBeenCalledWith(items[1].token);
    expect(items[1].token).toBe('scratch');
  });

  test('ctrl-r rename invokes the rename handler with the highlighted session name', async () => {
    const items = buildMenuItems(SESSIONS);
    const onRename = vi.fn();
    const { stdin } = render(
      <Menu
        items={items}
        onSelect={() => {}}
        onRename={onRename}
        previewFor={() => 'preview'}
      />,
    );
    await delay();
    stdin.write(CTRL_R);
    await delay();
    expect(onRename).toHaveBeenCalledWith('work');
  });

  test('ctrl-x kill invokes the kill handler with the highlighted session name', async () => {
    const items = buildMenuItems(SESSIONS);
    const onKill = vi.fn();
    const { stdin } = render(
      <Menu
        items={items}
        onSelect={() => {}}
        onKill={onKill}
        previewFor={() => 'preview'}
      />,
    );
    await delay();
    stdin.write(CTRL_X);
    await delay();
    expect(onKill).toHaveBeenCalledWith('work');
  });

  test('preview pane shows list-windows output for the highlight and the placeholder otherwise', async () => {
    const items = buildMenuItems(SESSIONS);
    const previewFor = (item: MenuItem) =>
      item.kind === 'session'
        ? `windows-for-${item.session!.name}`
        : '(new / no preview)';
    const { stdin, lastFrame } = render(
      <Menu items={items} onSelect={() => {}} previewFor={previewFor} />,
    );
    expect(lastFrame() ?? '').toContain('windows-for-work');

    await delay();
    // Move down past both sessions to the "+ new session" row.
    stdin.write(DOWN);
    await delay();
    stdin.write(DOWN);
    await delay();
    expect(lastFrame() ?? '').toContain('(new / no preview)');
  });
});

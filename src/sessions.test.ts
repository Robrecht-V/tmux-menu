import { describe, expect, test } from 'vitest';
import {
  buildMenuItems,
  NEW_TOKEN,
  parseSessions,
  QUIT_TOKEN,
  Session,
} from './sessions';

describe('parseSessions', () => {
  test('parseSessions parses tab-delimited -F output into session objects', () => {
    const raw =
      '1700000100\twork\t3\t1\n' + '1700000050\tscratch\t1\t0\n';
    expect(parseSessions(raw)).toEqual([
      { name: 'work', windows: 3, attached: true, activity: 1700000100 },
      { name: 'scratch', windows: 1, attached: false, activity: 1700000050 },
    ]);
  });

  test('parseSessions returns [] for empty input and skips blank lines', () => {
    expect(parseSessions('')).toEqual([]);
    expect(parseSessions('\n\n')).toEqual([]);
    expect(parseSessions('1700000100\twork\t3\t1\n\n')).toHaveLength(1);
  });
});

describe('buildMenuItems', () => {
  const sessions: Session[] = [
    { name: 'older', windows: 1, attached: false, activity: 10 },
    { name: 'newest', windows: 2, attached: true, activity: 30 },
    { name: 'middle', windows: 1, attached: false, activity: 20 },
  ];

  test('buildMenuItems orders by activity descending then appends new and quit', () => {
    const items = buildMenuItems(sessions);
    expect(items.map((i) => i.token)).toEqual([
      'newest',
      'middle',
      'older',
      NEW_TOKEN,
      QUIT_TOKEN,
    ]);
    expect(items[3].label).toBe('＋ new session');
    expect(items[4].label).toBe('✕ quit to shell');
    expect(items[3].kind).toBe('new');
    expect(items[4].kind).toBe('quit');
  });

  test('buildMenuItems labels sessions with window count and attached marker', () => {
    const items = buildMenuItems(sessions);
    expect(items[0].label).toBe('newest — 2 win • attached');
    expect(items[1].label).toBe('middle — 1 win');
  });
});

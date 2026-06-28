import { describe, expect, test, vi } from 'vitest';
import { runKiosk } from './kiosk';

describe('kiosk loop', () => {
  test('kiosk loop re-shows the menu after each attach until quit', async () => {
    // Mocked attach returns twice, then the menu yields the quit sentinel:
    // menu shown 3×, attach called 2×.
    const tokens = ['work', 'work', '__quit__'];
    let i = 0;
    const showMenu = vi.fn(async () => tokens[i++] ?? '__quit__');
    const attach = vi.fn();

    await runKiosk({ showMenu, attach });

    expect(showMenu).toHaveBeenCalledTimes(3);
    expect(attach).toHaveBeenCalledTimes(2);
    expect(attach).toHaveBeenNthCalledWith(1, 'work');
    expect(attach).toHaveBeenNthCalledWith(2, 'work');
  });

  test('kiosk loop exits immediately when the menu is cancelled (null)', async () => {
    const showMenu = vi.fn(async () => null);
    const attach = vi.fn();
    await runKiosk({ showMenu, attach });
    expect(showMenu).toHaveBeenCalledTimes(1);
    expect(attach).not.toHaveBeenCalled();
  });

  test('kiosk loop routes the new sentinel to onNew without attaching', async () => {
    const tokens = ['__new__', '__quit__'];
    let i = 0;
    const showMenu = vi.fn(async () => tokens[i++] ?? '__quit__');
    const attach = vi.fn();
    const onNew = vi.fn();
    await runKiosk({ showMenu, attach, onNew });
    expect(onNew).toHaveBeenCalledTimes(1);
    expect(attach).not.toHaveBeenCalled();
  });
});

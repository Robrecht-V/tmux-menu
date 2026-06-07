// The kiosk loop: show the menu, act on the chosen token, then show it again —
// re-displaying the menu whenever an attach returns (i.e. the user detached).
// All effects are injected so this is testable with mocked menu/attach.
import { NEW_TOKEN, QUIT_TOKEN } from './sessions';

/** A no-op token the menu can return to ask for a plain re-display
 * (e.g. after an in-place rename or kill). */
export const REFRESH_TOKEN = '__refresh__';

export interface KioskDeps {
  /** Render the menu and resolve with the chosen token, or null to quit. */
  showMenu: () => Promise<string | null>;
  /** Attach to an existing session; resolves when the user detaches. */
  attach: (name: string) => unknown | Promise<unknown>;
  /** Handle the "+ new session" row (prompt + create + attach). */
  onNew?: () => unknown | Promise<unknown>;
}

export async function runKiosk(deps: KioskDeps): Promise<void> {
  for (;;) {
    const token = await deps.showMenu();

    if (token == null || token === QUIT_TOKEN) return;
    if (token === REFRESH_TOKEN) continue;

    if (token === NEW_TOKEN) {
      await deps.onNew?.();
      continue;
    }

    await deps.attach(token);
    // loop back: re-show the menu after the attach returns (kiosk behaviour).
  }
}

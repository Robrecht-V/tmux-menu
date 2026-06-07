import React from 'react';
import { render } from 'ink';
import { Menu } from './Menu';
import { Prompt } from './Prompt';
import { buildMenuItems, MenuItem } from './sessions';
import { sanitizeName } from './sanitize';
import {
  attachSession,
  hasSession,
  killSession,
  listSessions,
  listWindows,
  newSession,
  renameSession,
} from './tmux';
import { runKiosk, REFRESH_TOKEN } from './kiosk';

function previewFor(item: MenuItem): string {
  if (item.kind === 'session' && item.session) {
    return listWindows(item.session.name);
  }
  return '(new / no preview)';
}

// Render the menu once and resolve with the chosen token. Rename/kill are
// handled in place: the side-effect runs, then we resolve with REFRESH_TOKEN
// so the kiosk loop simply re-displays the (now updated) menu.
function showMenu(): Promise<string | null> {
  return new Promise((resolve) => {
    const items = buildMenuItems(listSessions());
    let settled = false;
    const finish = (token: string | null, app: { unmount: () => void }) => {
      if (settled) return;
      settled = true;
      app.unmount();
      resolve(token);
    };

    const app = render(
      <Menu
        items={items}
        previewFor={previewFor}
        onSelect={(token) => finish(token, app)}
        onKill={(name) => {
          killSession(name);
          finish(REFRESH_TOKEN, app);
        }}
        onRename={(name) => {
          app.unmount();
          // Prompt for the new name, then re-show the menu.
          promptName(`Rename '${name}' to`).then((next) => {
            if (next && next !== name && !hasSession(next)) {
              renameSession(name, next);
            }
            resolve(REFRESH_TOKEN);
          });
        }}
      />,
    );
  });
}

// Render the name prompt and resolve with a sanitized name, or null if
// cancelled / invalid.
function promptName(label: string): Promise<string | null> {
  return new Promise((resolve) => {
    let settled = false;
    const app = render(
      <Prompt
        label={label}
        onSubmit={(value) => {
          if (settled) return;
          settled = true;
          app.unmount();
          resolve(value == null ? null : sanitizeName(value));
        }}
      />,
    );
  });
}

async function onNew(): Promise<void> {
  const name = await promptName('New session name (required)');
  if (!name) return;
  if (hasSession(name)) {
    attachSession(name);
  } else {
    newSession(name);
  }
}

export async function runApp(): Promise<void> {
  await runKiosk({
    showMenu,
    attach: (name) => attachSession(name),
    onNew,
  });
}

// build.mjs — bundle the TypeScript/Ink source into a single self-contained
// node executable at bin/tmux-menu (with a `#!/usr/bin/env node` shebang).
import esbuild from 'esbuild';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
);

await esbuild.build({
  entryPoints: ['src/cli.tsx'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  outfile: 'bin/tmux-menu',
  banner: { js: '#!/usr/bin/env node' },
  // The version is baked in at build time so the binary is self-contained and
  // need not read package.json at runtime.
  define: { __TM_VERSION__: JSON.stringify(pkg.version) },
  jsx: 'automatic',
  jsxImportSource: 'react',
  legalComments: 'none',
  logLevel: 'info',
});

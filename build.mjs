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
  // The shebang makes the bundle directly executable. The trailing `var _a;`
  // is a workaround for an esbuild renaming bug against yoga-layout-prebuilt's
  // asm.js (ink's layout engine): esbuild renames the engine's `var _a;`
  // declaration but not a matching assignment, leaving an orphaned `_a = ...`
  // that throws "ReferenceError: _a is not defined" under strict mode. A
  // top-level `var _a` gives that orphaned assignment something to bind to.
  banner: { js: '#!/usr/bin/env node\nvar _a;' },
  // The version is baked in at build time so the binary is self-contained and
  // need not read package.json at runtime.
  define: { __TM_VERSION__: JSON.stringify(pkg.version) },
  jsx: 'automatic',
  jsxImportSource: 'react',
  legalComments: 'none',
  logLevel: 'info',
});

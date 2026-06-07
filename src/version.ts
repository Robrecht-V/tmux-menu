// __TM_VERSION__ is replaced with a string literal by esbuild at build time
// (see build.mjs). When running un-bundled (e.g. under vitest) the identifier
// is undefined, so `typeof` keeps this safe and falls back.
declare const __TM_VERSION__: string;

export const VERSION: string =
  typeof __TM_VERSION__ !== 'undefined' ? __TM_VERSION__ : '0.0.0-dev';

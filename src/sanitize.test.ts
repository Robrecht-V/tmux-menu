import { describe, expect, test } from 'vitest';
import { sanitizeName } from './sanitize';

describe('sanitizeName', () => {
  test('sanitizeName replaces every character outside [A-Za-z0-9_-] with _', () => {
    expect(sanitizeName('my session')).toBe('my_session');
    expect(sanitizeName('a.b:c/d')).toBe('a_b_c_d');
    expect(sanitizeName('keep-these_OK09')).toBe('keep-these_OK09');
    expect(sanitizeName('héllo!')).toBe('h_llo_');
  });

  test('sanitizeName treats whitespace-only or empty input as invalid (null)', () => {
    expect(sanitizeName('')).toBeNull();
    expect(sanitizeName('   ')).toBeNull();
    expect(sanitizeName('\t\n ')).toBeNull();
    expect(sanitizeName(null)).toBeNull();
    expect(sanitizeName(undefined)).toBeNull();
  });

  test('sanitizeName trims surrounding whitespace before sanitizing', () => {
    expect(sanitizeName('  work  ')).toBe('work');
  });
});

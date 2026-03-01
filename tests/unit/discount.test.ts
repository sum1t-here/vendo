import { describe, expect, it } from 'vitest';
import { discountPercent } from '@/lib/discount';

describe('discountPercent', () => {
  it('returns the discount percent', () => {
    expect(discountPercent(100, 50)).toBe(50);
  });

  it('returns null if there is no discount', () => {
    expect(discountPercent(50, 100)).toBeNull();
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadCurrencies } from './currencies';

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('loadCurrencies', () => {
  it('should load currencies', async () => {
    // Arrange

    // Act
    const currencies = await loadCurrencies();

    // Assert
    expect(currencies).toBeDefined();
    expect(currencies.rates).toBeDefined();
    expect(currencies.convert).toBeTypeOf('function');

    for (const [currency, rate] of Object.entries(currencies.rates)) {
      expect(currency).toBeTypeOf('string');
      expect(rate).toBeTypeOf('number');
    }

    expect(currencies.convert(1, 'USD', 'EUR')).toBeTypeOf('number');
  });

  it('should throw error if url not reachable', async () => {
    // Arrange
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

    // Act
    const result = loadCurrencies();

    // Assert
    await expect(result).rejects.toThrow();
  });

  it('should throw error if code is invalid', async () => {
    // Arrange
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('throw new Error("test")'),
    } as Response);

    // Act
    const result = loadCurrencies();

    // Assert
    await expect(result).rejects.toThrow();
  });

  it('should throw error if currencies object is invalid (missing Currency)', async () => {
    // Arrange
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('// No Currency object defined'),
    } as Response);

    // Act
    const result = loadCurrencies();

    // Assert
    await expect(result).rejects.toThrow();
  });

  it('should throw error if currencies object is invalid (missing rates)', async () => {
    // Arrange
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('var Currency = { convert: function() {} };'),
    } as Response);

    // Act
    const result = loadCurrencies();

    // Assert
    await expect(result).rejects.toThrow();
  });

  it('should throw error if currencies object is invalid (missing convert)', async () => {
    // Arrange
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('var Currency = { rates: { USD: 1 } };'),
    } as Response);

    // Act
    const result = loadCurrencies();

    // Assert
    await expect(result).rejects.toThrow();
  });
});

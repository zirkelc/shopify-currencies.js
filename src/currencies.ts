import * as vm from 'node:vm';

const CURRENCY_URL = 'https://cdn.shopify.com/s/javascripts/currencies.js';

type Rates = {
  [key: string]: number;
};

type Convert = (amount: number, from: string, to: string) => number;

type Currencies = {
  rates: Rates;
  convert: Convert;
};

export async function loadCurrencies(): Promise<Currencies> {
  const response = await fetch(CURRENCY_URL);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch currencies from ${CURRENCY_URL}: ${response.statusText}`,
    );
  }

  const code = await response.text();

  const ctx: { Currency?: Currencies } = {};
  try {
    vm.createContext(ctx);
    vm.runInContext(code, ctx);
  } catch (error) {
    throw new Error(`Failed to parse currencies from ${CURRENCY_URL}`);
  }

  if (!ctx.Currency || typeof ctx.Currency !== 'object') {
    throw new Error('Invalid currencies object');
  }

  const { rates, convert } = ctx.Currency;

  if (!rates || typeof rates !== 'object') {
    throw new Error('Invalid currencies object');
  }

  if (!convert || typeof convert !== 'function') {
    throw new Error('Invalid currencies object');
  }

  return { rates, convert };
}

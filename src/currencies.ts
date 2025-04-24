import * as vm from 'node:vm';

const SHOPIFY_CDN_URL = 'https://cdn.shopify.com/s/javascripts/currencies.js';

type Rates = {
  [key: string]: number;
};

type Convert = (amount: number, from: string, to: string) => number;

type Currencies = {
  rates: Rates;
  convert: Convert;
};

export async function loadCurrencies(): Promise<Currencies> {
  const response = await fetch(SHOPIFY_CDN_URL);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch currencies from Shopify CDN (${SHOPIFY_CDN_URL}): ${response.statusText}`,
    );
  }

  const code = await response.text();

  const ctx: { Currency?: Currencies } = {};
  try {
    vm.createContext(ctx);
    vm.runInContext(code, ctx);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    throw new Error(
      `Failed to parse currencies from Shopify CDN (${SHOPIFY_CDN_URL}): ${message}`,
    );
  }

  if (!ctx.Currency || typeof ctx.Currency !== 'object') {
    throw new Error('Invalid currencies: Currency is not an object');
  }

  const { rates, convert } = ctx.Currency;

  if (!rates || typeof rates !== 'object') {
    throw new Error('Invalid currencies: rates is not an object');
  }

  if (!convert || typeof convert !== 'function') {
    throw new Error('Invalid currencies: convert is not a function');
  }

  return { rates, convert };
}

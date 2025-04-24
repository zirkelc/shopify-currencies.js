[![NPM Version](https://img.shields.io/npm/v/shopify-currencies.js)](https://www.npmjs.com/package/shopify-currencies.js)
[![NPM Downloads](https://img.shields.io/npm/dy/shopify-currencies.js)](https://www.npmjs.com/package/shopify-currencies.js)

# Shopify Currencies.js

This package provides a simple wrapper to access Shopify's [currency conversion rates](https://cdn.shopify.com/s/javascripts/currencies.js) from Node.js.

## Installation

```bash
npm install shopify-currencies.js
```

## Usage

```ts
import { loadCurrencies } from 'shopify-currencies.js';

const currencies = await loadCurrencies();

// Conversion rates for EUR
console.log(`Conversion rates for EUR: ${currencies.rates.EUR}`);

// Convert 1 USD to EUR
console.log(`1 USD is ${currencies.convert(1, 'USD', 'EUR')} EUR`);
```

## API

### `loadCurrencies`

Loads the current currency conversion rates from the Shopify CDN.
Every call to this function will fetch the latest rates from the Shopify CDN, so cache the result if you need to.

```ts
const currencies = await loadCurrencies();
```

#### `currencies.rates`

The `rates` object contains the conversion rates for the currencies Shopify supports.
The currency codes are three-letter ISO codes.

```ts
type Rates = {
  [currencyCode: string]: number;
};

const { rates } = await loadCurrencies();

// Conversion rates for EUR
console.log(`Conversion rates for EUR: ${rates.EUR}`);
```

#### `currencies.convert`

The `convert` function converts an amount from one currency to another. The conversion is implemented as `amount * rates[from] / rates[to]`.

```ts
type Convert = (amount: number, from: string, to: string) => number;

const { convert } = await loadCurrencies();

const dollars = 5;
const euros = convert(dollars, 'USD', 'EUR');
```

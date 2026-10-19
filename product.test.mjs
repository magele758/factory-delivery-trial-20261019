import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as productModule from './product.mjs';
import { product } from './product.mjs';
import * as sumModule from './sum.mjs';

test('AC-1: two finite integers return their product derived with BigInt', () => {
  assert.equal(product(12345, 67890), Number(12345n * 67890n));
  assert.equal(product(12345, 0), Number(12345n * 0n));
  assert.equal(product(0, 67890), Number(0n * 67890n));
  assert.equal(product(2, 3), Number(2n * 3n));
  assert.equal(product(-4, 5), Number(-4n * 5n));
  assert.equal(product(-7, -8), Number(-7n * -8n));
  assert.equal(product(1, -1), Number(1n * -1n));
});

test('AC-1: two finite numbers return mathematically correct short decimal products', () => {
  assert.equal(product(0.1, 0.2), 0.02);
  assert.equal(product(0.1, 0.1), 0.01);
  assert.equal(product(0.2, 0.2), 0.04);
  assert.equal(product(0.3, 0.1), 0.03);
  assert.equal(product(1.2, 1.3), 1.56);
  assert.equal(product(-0.1, 0.2), -0.02);
  assert.equal(product(-0.1, -0.2), 0.02);
  assert.equal(product(2.5, 4), 10);
  assert.equal(product(0.5, 0.5), 0.25);
});

test('AC-1: nonnumeric arguments are rejected with TypeError', () => {
  assert.throws(() => product('1', 2), TypeError);
  assert.throws(() => product(1, '2'), TypeError);
  assert.throws(() => product('1', '2'), TypeError);
  assert.throws(() => product(null, 1), TypeError);
  assert.throws(() => product(1, undefined), TypeError);
  assert.throws(() => product(undefined, undefined), TypeError);
  assert.throws(() => product({}, 1), TypeError);
  assert.throws(() => product(1, []), TypeError);
  assert.throws(() => product(true, 1), TypeError);
  assert.throws(() => product(1, false), TypeError);
  assert.throws(() => product(1n, 2), TypeError);
  assert.throws(() => product(2, 3n), TypeError);
  assert.throws(() => product(new Number(1), 2), TypeError);
  assert.throws(() => product(Symbol('1'), 2), TypeError);
});

test('AC-1: nonfinite arguments are rejected with TypeError', () => {
  assert.throws(() => product(Number.NaN, 1), TypeError);
  assert.throws(() => product(1, Number.NaN), TypeError);
  assert.throws(() => product(Number.POSITIVE_INFINITY, 1), TypeError);
  assert.throws(() => product(1, Number.NEGATIVE_INFINITY), TypeError);
  assert.throws(() => product(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY), TypeError);
  assert.throws(() => product(Number.NaN, Number.POSITIVE_INFINITY), TypeError);
});

test('AC-1: preserve all unrelated exports', () => {
  assert.equal(typeof productModule.product, 'function');
  assert.equal(productModule.product, product);
  assert.equal(typeof sumModule.sum, 'function');
  const unrelated = sumModule.sum;
  product(2, 3);
  assert.equal(sumModule.sum, unrelated);
  assert.equal(typeof sumModule.sum, 'function');
});

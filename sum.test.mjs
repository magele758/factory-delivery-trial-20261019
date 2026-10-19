import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sum } from './sum.mjs';
import * as sumModule from './sum.mjs';
import * as productModule from './product.mjs';

test('AC-1 returns the sum of two finite integers', () => {
  assert.equal(sum(12345, 67890), 80235);
  assert.equal(sum(2, 3), 5);
  assert.equal(sum(-4, 10), 6);
  assert.equal(sum(-8, -7), -15);
  assert.equal(sum(0, 0), 0);
  assert.equal(sum(0, 42), 42);
  assert.equal(sum(-1, 1), 0);
});

test('AC-1 returns mathematically correct short decimal results', () => {
  assert.equal(sum(0.1, 0.2), 0.3);
  assert.equal(sum(0.1, 0.7), 0.8);
  assert.equal(sum(0.01, 0.02), 0.03);
  assert.equal(sum(1.1, 2.2), 3.3);
  assert.equal(sum(0.3, 0.6), 0.9);
  assert.equal(sum(-0.1, -0.2), -0.3);
  assert.equal(sum(0.1, -0.2), -0.1);
  assert.equal(sum(-0.3, 0.1), -0.2);
  assert.equal(sum(1.25, 2.5), 3.75);
  assert.equal(sum(10.05, 0.05), 10.1);
});

test('AC-1 rejects nonnumeric arguments with TypeError', () => {
  assert.throws(() => sum('1', 2), TypeError);
  assert.throws(() => sum(1, '2'), TypeError);
  assert.throws(() => sum('0.1', '0.2'), TypeError);
  assert.throws(() => sum(null, 1), TypeError);
  assert.throws(() => sum(1, undefined), TypeError);
  assert.throws(() => sum(undefined, undefined), TypeError);
  assert.throws(() => sum({}, 1), TypeError);
  assert.throws(() => sum(1, []), TypeError);
  assert.throws(() => sum(true, 1), TypeError);
  assert.throws(() => sum(1, false), TypeError);
  assert.throws(() => sum(1n, 2), TypeError);
  assert.throws(() => sum(1, 2n), TypeError);
  assert.throws(() => sum(new Number(1), 2), TypeError);
  assert.throws(() => sum(), TypeError);
  assert.throws(() => sum(1), TypeError);
});

test('AC-1 rejects nonfinite arguments with TypeError', () => {
  assert.throws(() => sum(NaN, 1), TypeError);
  assert.throws(() => sum(1, NaN), TypeError);
  assert.throws(() => sum(NaN, NaN), TypeError);
  assert.throws(() => sum(Infinity, 1), TypeError);
  assert.throws(() => sum(1, Infinity), TypeError);
  assert.throws(() => sum(-Infinity, 1), TypeError);
  assert.throws(() => sum(1, -Infinity), TypeError);
  assert.throws(() => sum(Infinity, -Infinity), TypeError);
});

test('AC-1 preserves unrelated exports', () => {
  assert.equal(typeof sumModule.sum, 'function');
  assert.equal(typeof productModule.product, 'function');
  assert.deepEqual(
    Object.keys(sumModule).filter((name) => name !== 'sum').sort(),
    [],
  );
  assert.ok(Object.prototype.hasOwnProperty.call(productModule, 'product'));
});

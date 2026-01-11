import { test } from 'node:test';
import assert from 'node:assert';
import { findMaximumJoltage_v1, findMaximumJoltage_v2 } from '../../../../2025/days/3/3.js';
import fs from 'fs';

test('findMaximumJoltage', async (t) => {
    let banks, total;
    t.before(() => {
        banks = fs.readFileSync(
            './example-input.txt', { encoding: 'utf-8' })
            .split(/\r?\n/);
    });

    t.beforeEach(() => {
        total = 0;
    });

    await t.test('v1', () => {
        for (const b of banks)
            total += findMaximumJoltage_v1(b);
        assert.strictEqual(total, 357);
    });

    await t.test('v2', () => {
        for (const b of banks)
            total += findMaximumJoltage_v2(b);
        assert.strictEqual(total, 3121910778619);
    });
});
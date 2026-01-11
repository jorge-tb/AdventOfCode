import { test } from 'node:test';
import assert from 'node:assert';
import { searchInvalidIDs_v1, searchInvalidIDs_v2 } from '../../../../2025/days/2/2.js';
import fs from 'fs';

test('searchInvalidIDs', async (t) => {
    const sum = (arr) => arr.reduce((prev, curr) => prev + curr, 0);
    let example;
    t.before(t => {
        example = fs.readFileSync(
            './example-input.txt',
            { encoding: 'utf-8' }).split(',')
    });

    await t.test('v1', t => {
        let invalidIds = searchInvalidIDs_v1(example);
        assert.strictEqual(sum(invalidIds), 1227775554);
    });

    await t.test('v2', t => {
        let invalidIds = searchInvalidIDs_v2(example);
        assert.strictEqual(sum(invalidIds), 4174379265);
    });
})
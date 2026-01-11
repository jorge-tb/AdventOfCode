import { test, before, describe, it } from 'node:test';
import assert from 'node:assert';
import { Dial, computePassword_v1, computePassword_v2 } from '../../../../2025/days/1/1.js';
import fs from 'fs';

test('computePassword', async (t) => {
    let example, dial;

    // Global setup: read example from text file.
    t.before(t => {
        example = fs.readFileSync(
            './example-input.txt',
            { encoding: 'utf-8' }).split(/\r?\n/);
    })

    // Test setup: create a new Dial instance for each unit test.
    t.beforeEach(t => {
        dial = new Dial(0, 99, 50);
    });
    
    await t.test('v1', () => {
        console.log('v1 test');
        const password = computePassword_v1(example, dial);
        assert.strictEqual(password, 3);
    });

    await t.test('v2', () => {
        console.log('v2 test');
        const password = computePassword_v2(example, dial);
        assert.strictEqual(password, 6);
    });
});

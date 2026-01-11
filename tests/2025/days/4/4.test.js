import { test } from 'node:test';
import assert from 'node:assert';
import { buildAdjacentMatrix, countLessThan4Contiguous, countDeleteable } from '../../../../2025/days/4/4.js';
import fs from 'fs';

test('buildAdjacentMatrix', async (t) => {
    await t.test("empty input generates an empty matrix", () => {
        const input = [];
        const matrix = buildAdjacentMatrix(input);
        assert.deepStrictEqual(matrix, []);
    });

    await t.test('single @ element gets value of 1', () => {
        const input = ['@'];
        const matrix = buildAdjacentMatrix(input);
        assert.deepStrictEqual(matrix, [[1]]);
    });

    await t.test('single . element gets value of 0', () => {
        const input = ['.'];
        const matrix = buildAdjacentMatrix(input);
        assert.deepStrictEqual(matrix, [[0]]);
    });

    await t.test('adjacent @ elements increment each other', () => {
        const input = ['.@.@@'];
        const matrix = buildAdjacentMatrix(input);
        assert.deepStrictEqual(matrix, [[0,1,0,2,2]]);
    });

    await t.test('diagonal adjacency works', () => {
        const input = [
            '@.',
            '.@'
        ];
        const matrix = buildAdjacentMatrix(input);
        assert.deepStrictEqual(matrix, [[2,0],[0,2]]);
    });
});
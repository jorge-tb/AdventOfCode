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

test('countLessThan4Contiguous', async (t) => {
    await t.test('counts elements with values 1-4', () => {
        const matrix = [
            [1, 2, 5],
            [3, 4, 6],
            [0, 7, 2]
        ];
        const result = countLessThan4Contiguous(matrix);
        assert.strictEqual(result, 5);
    });

    await t.test('empty matrix returns 0', () => {
        const matrix = [];
        const result = countLessThan4Contiguous(matrix);
        assert.strictEqual(result, 0);
    });

    await t.test('matrix with only zeros returns 0', () => {
        const matrix = [];
        const result = countLessThan4Contiguous(matrix);
        assert.strictEqual(result, 0);
    });

    await t.test('realistic adjacency matrix from buildAdjacencyMatrix', () => {
        const example = fs.readFileSync(
            './example-input.txt', { encoding: 'utf-8' })
            .split(/\r?\n/);
        const matrix = buildAdjacentMatrix(example);
        const result = countLessThan4Contiguous(matrix);
        assert.strictEqual(result, 13);
    });
});

test('countDeleteable', async (t) => {
    await t.test('counts elements with values 1-4', () => {
        const matrix = [
            [1, 2, 5],
            [3, 4, 6],
            [0, 7, 2]
        ];
        const result = countDeleteable(matrix);
        assert.strictEqual(result, 8);
    });

    await t.test('empty matrix returns 0', () => {
        const matrix = [];
        const result = countDeleteable(matrix);
        assert.strictEqual(result, 0);
    });

    await t.test('matrix with only zeros returns 0', () => {
        const matrix = [];
        const result = countDeleteable(matrix);
        assert.strictEqual(result, 0);
    });
    
    await t.test('realistic adjacency matrix from buildAdjacencyMatrix', () => {
        const example = fs.readFileSync(
            './example-input.txt', { encoding: 'utf-8' })
            .split(/\r?\n/);
        const matrix = buildAdjacentMatrix(example);
        const result = countDeleteable(matrix);
        assert.strictEqual(result, 43);
    });
});
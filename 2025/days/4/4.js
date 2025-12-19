import fs from 'fs';

function readExample() {
    const exampleText = `
    ..@@.@@@@.
    @@@.@.@.@@
    @@@@@.@.@@
    @.@@@@..@.
    @@.@@@@.@@
    .@@@@@@@.@
    .@.@.@.@@@
    @.@@@.@@@@
    .@@@@@@@@.
    @.@.@@@.@.`

    const example = exampleText
        .split('\n')
        .map(l => l.trim());
    return example
        .slice(1, example.length);
}

function readInput() {
    const inputText = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
    return inputText.split(/\r?\n/);
}

/**
 * Generates a matrix where each element represents the count of contiguous '@' symbols at that position.
 * @param {Array<string>} input - Where each element is a line formed by @ and . symbols.
 */
function buildAdjacentMatrix(input) {
    const matrix = [];
    let line, symbol;
    for (let i = 0; i < input.length; i++) {
        line = input[i];
        matrix.push(Array(line.length).fill(0));
        for (let j = 0; j < line.length; j++) {
            symbol = line[j];
            if (symbol === '@') {
                matrix[i][j] = 1;
                if (isOccupied(matrix, i, j - 1)) {
                    matrix[i][j - 1] += 1;
                    matrix[i][j] += 1;
                }
                if (isOccupied(matrix, i - 1, j - 1)) {
                    matrix[i - 1][j - 1] += 1;
                    matrix[i][j] += 1;
                }
                if (isOccupied(matrix, i - 1, j)) {
                    matrix[i - 1][j] += 1;
                    matrix[i][j] += 1;
                }
                if (isOccupied(matrix, i - 1, j + 1)) {
                    matrix[i - 1][j + 1] += 1;
                    matrix[i][j] += 1;
                } 
            }
        }
    }

    return matrix;
}

/**
 * Returns true if position exists and there's a positive value greater than 0, otherwise false.
 * @param {Array<Array<number>>} matrix
 * @param {number} i 
 * @param {number} j 
 */
function isOccupied(matrix, i, j) {
    if (i < 0 || j < 0)
        return false;
    else if (i >= matrix.length || j >= matrix[i].length)
        return false;
    else if (matrix[i][j] > 0)
        return true;
    else
        return false;
}

/**
 * Removes an element located at [i][j] coordinates and decrements contigous occupied cells in one unit.
 * @param {Array<Array<number>>} matrix 
 * @param {number} i 
 * @param {number} j 
 */
function remove(matrix, i, j) {
    if (!isOccupied(matrix, i, j)) 
        return;

    matrix[i][j] = 1;
    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            if (isOccupied(matrix, i + x, j + y))
                matrix[i + x][j + y] -= 1;
        }
    }
}

function answer_part1() {
    const input = readInput();
    const matrix = buildAdjacentMatrix(input);
    let total = 0;
    matrix.forEach(row => {
        row.forEach(e => {
            if (e > 0 && e < 5)
                total++;
        });
    });
    console.log(`Total '@' elements with less than 4 contigous '@' is: ${total}`);
}

function answer_part2() {
    const input = readInput();
    const matrix = buildAdjacentMatrix(input);
    const toDelete = [];
    let total = 0;
    let done = false;
    while (!done) {
        matrix.forEach((row, i) => {
            row.forEach((e, j) => {
                if (e > 0 && e < 5)
                    toDelete.push([i, j]);
            });      
        });

        if (toDelete.length) {
            total += toDelete.length;
            toDelete.forEach(([i, j]) => remove(matrix, i, j));
            toDelete.length = 0;
        } else {
            done = true;
        }
    }
    console.log(`Total '@' elements that can be removed is: ${total}`);
}

answer_part1();

answer_part2();
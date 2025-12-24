import fs from 'fs';

function readInput_v1() {
    const inputText = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
    const matrix = [];
    inputText
        .split(/\r?\n/)
        .forEach((row, i, arr) => {
            let matrixRow = row.split(' ').filter(e => e !== '');
            if (i < arr.length - 1)
                matrix.push(matrixRow.map(e => Number(e)));
            else 
                matrix.push(matrixRow);
            
        });
    return matrix;
}

function readInput_v2() {
    const inputText = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
    const matrix = [];
    const split = inputText.split(/\r?\n/).map(row => row.split(''));
    let number = [];
    let operator;
    let row = 0;
    for (let i = 0; i < split[0].length; i++) {
        for (let j = 0; j < split.length; j++) {
            if (split[j][i] === '*' || split[j][i] === '+')
                operator = split[j][i];
            else if (split[j][i] !== ' ')
                number.push(split[j][i])
        }

        if (matrix.length < (row + 1))
            matrix.push([]);
        
        if (number.length > 0) {
            matrix[row].push(
                Number(
                    number.reduce((prev, curr) => prev + curr), ''));
            row++;
        } 
        
        if (!number.length || i === split[0].length - 1) {
            Array(matrix.length - 1).fill(
                operator === '*' ? 1 : 0
            ).forEach((v, index) => {
                if (matrix[index].length < matrix[0].length) {
                    matrix[index].push(v);
                    row++;
                }
            });
            matrix[row].push(operator);
            row = 0;
        }

        number.length = 0;
    }
    return matrix;
}

function resolveMatrix(matrix) {
    const multiply = (numbers) => numbers.reduce((prev, curr) => prev * curr, 1);
    const sum = (numbers) => numbers.reduce((prev, curr) => prev + curr, 0);

    let total = 0;
    let numbers = [];
    for (let i = 0; i < matrix[0].length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            if (j < matrix.length - 1) {
                numbers.push(matrix[j][i]);
            } else {
                total += matrix[j][i] === '*' ? multiply(numbers) : sum(numbers);
                numbers.length = 0;
            }
        }
    }
    return total;
}

function answer_part1() {
    const matrix = readInput_v1();
    const total = resolveMatrix(matrix);
    console.log(`(v1) Total is ${total}`);
}

function answer_part2() {
    const matrix = readInput_v2();
    const total = resolveMatrix(matrix);
    console.log(`(v2) Total is ${total}`);
}

answer_part1();

answer_part2();
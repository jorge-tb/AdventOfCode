import fs from 'fs';

function readInput() {
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

function answer_part1() {
    const multiply = (numbers) => numbers.reduce((prev, curr) => prev * curr, 1);
    const sum = (numbers) => numbers.reduce((prev, curr) => prev + curr, 0);

    let total = 0;
    let numbers = [];
    const matrixProblem = readInput();
    for (let i = 0; i < matrixProblem[0].length; i++) {
        for (let j = 0; j < matrixProblem.length; j++) {
            if (j < matrixProblem.length - 1) {
                numbers.push(matrixProblem[j][i]);
            } else {
                total += matrixProblem[j][i] === '*' ? multiply(numbers) : sum(numbers);
                numbers.length = 0;
            }
        }
    }
    console.log(`Total is ${total}`);
}

answer_part1();
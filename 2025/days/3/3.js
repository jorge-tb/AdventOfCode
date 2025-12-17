import fs from 'fs';

function readInput() {
    const textInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
    const input = textInput.split('\r').map((bank, index) => {
        if (index > 0)
            return bank.slice(1, bank.length);
        return bank;
});
    return input;
}

function readExample() {
    return [
        '987654321111111',
        '811111111111119',
        '234234234234278',
        '818181911112111'
    ];
}

/**
 * Example: from a bank=987654321111111 it returns 98.
 * @param {string} bank
 */
function findMaximumJoltage(bank) {
    const max = 9;
    let max1=0, max2=0;
    let current;
    for (let i = 0; i < bank.length; i++) {
        current = Number(bank[i]);
        if (max1 < current && i < (bank.length - 1)) {
            max1 = current;
            max2 = 0;
        }
        else if (max2 < current)
            max2 = current;

        if (max1 === max && max2 === max)
            break;
    }
    console.log(`max joltage for bank=${bank}`);
    console.log(`${max1.toString() +  max2.toString()}`);
    return Number((max1.toString() + max2.toString()));
}

function answer_part1() {
    let banks = readInput();
    let totalJoltage = 0;
    for (const bank of banks) {
        totalJoltage += findMaximumJoltage(bank);
    }
    console.log(`Total joltage: ${totalJoltage}`);
}

answer_part1();
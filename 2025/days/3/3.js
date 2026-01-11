import fs from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function readInput() {
    const textInput = fs.readFileSync(
        join(__dirname, './input.txt'), { encoding: 'utf-8' });
    return textInput.split(/\r?\n/);
}

/**
 * Example: from a bank=987654321111111 it returns 98, two elements that generate the biggest number.
 * @param {string} bank
 */
export function findMaximumJoltage_v1(bank) {
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
    return Number((max1.toString() + max2.toString()));
}

/**
 * Example: from a bank=987654321111111 it returns 987654321111, twelve elements that generate the biggest number.
 * @param {string} bank 
 */
export function findMaximumJoltage_v2(bank, size=12) {
    const maxs = Array(size).fill(0);
    const diff = bank.length - size;
    let current, offset, index;

    for (let i = 0; i < bank.length; i++) {
        current = Number(bank[i]);
        offset = diff - i < 0 ? Math.abs(diff - i) : 0;
        index = maxs
            .slice(offset)
            .findIndex((e) => e < current) + offset;
        if (offset <= index) {
            maxs
                .slice(index)
                .forEach((_, j) => {
                    maxs[index + j] = 0;
                });
            maxs[index] = current;
        }
    }

    return Number(
        maxs.reduce((prev, curr) => prev += curr.toString(), '')
    );
}

function answer_part1() {
    let banks = readInput();
    let totalJoltage = 0;
    for (const bank of banks) {
        totalJoltage += findMaximumJoltage_v1(bank);
    }
    console.log(`(v1) Total joltage: ${totalJoltage}`);
}

function answer_part2() {
    let banks = readInput();
    let totalJoltage = 0;
    for (const bank of banks) {
        totalJoltage += findMaximumJoltage_v2(bank);
    }
    console.log(`(v2) Total joltage: ${totalJoltage}`);
}

answer_part1();

answer_part2();
import { AdventClient } from "../../client.js";

async function createInput() {
    // obtain input from Advent web client
    const adventClient = new AdventClient(2024, 1);
    let plainInput = await adventClient.input();
    let list = plainInput.split(/\s+/);

    // remove last 'empty string' element
    list.pop();

    // generate two reconciliable lists
    let evenList = [];
    let oddList = [];
    list.forEach((n, index) => {
        if (index % 2 === 0) 
            evenList.push(n);
        else
            oddList.push(n);
    });

    return {
        l1: evenList,
        l2: oddList
    }
}

function answer_part1(input) {
    let l1Sorted = input.l1.sort((a, b) => a - b);
    let l2Sorted = input.l2.sort((a, b) => a - b);

    let totalDistance = 0;
    l1Sorted.forEach((n1, index) => {
        let n2 = l2Sorted[index];
        totalDistance += Math.abs(n1 - n2);
    });

    return totalDistance;
}

function answer_part2(input) {
    let similarity = 0;
    input.l1.forEach(n1 => {
        let count = input.l2.filter(n2 => n2 === n1).length;
        similarity += count * n1;
    });

    return similarity;
}

const input = await createInput();
const solution1 = answer_part1(input);
const solution2 = answer_part2(input);

console.log(`input = ${JSON.stringify(input)}`);
console.log(`[Part 1] solution = ${solution1}`);
console.log(`[Part 2] solution = ${solution2}`);
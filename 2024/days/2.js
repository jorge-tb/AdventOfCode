import { AdventClient } from "../../client.js";

const MIN_DIFF = 1;
const MAX_DIFF = 3;

class Threshold {
    constructor(value=0) {
        this.value = value;
    }

    isExceeded() {
        return this.value < 0;
    }

    decrement() {
        --this.value;
    }

    clone() {
        return new Threshold(this.value);
    }
}

async function createInput() {
    // obtain input from Advent web client
    const adventClient = new AdventClient(2024, 2);
    const plainInput = await adventClient.input();

    let input = plainInput.split('\n');
    input.pop();
    input = input
        .map(report => report.split(' ')
        .map(Number));

    return input;
}

/**
 * 
 * @param {Array<number>} report 
 * @param {Threshold} threshold 
 * @returns 
 */
function isAsc(report, threshold, valids=[]) {
    if (threshold.isExceeded())
        return false;

    let current, next;
    let reportCopy1, reportCopy2;
    let condition1, condition2;
    for (let i = 0; i < report.length - 1; i++) {
        current = report[i];
        next = report[i + 1];

        if (current > next) {
            // There're two possibilities, remove element i or element i+1
            reportCopy1 = [...report];
            reportCopy2 = [...report];
            reportCopy1.splice(i, 1);
            reportCopy2.splice(i + 1, 1);

            threshold.decrement()

            condition1 = isAsc(reportCopy1, threshold.clone(), valids);
            condition2 = isAsc(reportCopy2, threshold.clone(), valids);

            return condition1 || condition2;
        }
    }

    valids.push({ report, threshold });
    return true;
}

/**
 * 
 * @param {Array<number>} report 
 * @param {Threshold} threshold 
 * @returns 
 */
function isDesc(report, threshold, valids=[]) {
    if (threshold.isExceeded())
        return false;

    let current, next;
    let reportCopy1, reportCopy2;
    let condition1, condition2;
    for (let i = 0; i < report.length - 1; i++) {
        current = report[i];
        next = report[i + 1];

        if (current < next) {
            // There're two possibilities, remove element i or element i+1
            reportCopy1 = [...report];
            reportCopy2 = [...report];
            reportCopy1.splice(i, 1);
            reportCopy2.splice(i + 1, 1);

            threshold.decrement();

            condition1 = isDesc(reportCopy1, threshold.clone(), valids);
            condition2 = isDesc(reportCopy2, threshold.clone(), valids);

            return condition1 || condition2;
        }
    }

    valids.push({ report, threshold });
    return true;
}

/**
 * 
 * @param {Array<number>} report 
 * @param {Threshold} threshold 
 * @returns 
 */
function hasValidAdjacentDiff(report, threshold, valids=[]) {
    if (threshold.isExceeded())
        return false;

    let diff;
    let reportCopy1, reportCopy2;
    let condition1, condition2;
    for (let i = 0; i < report.length - 1; i++) {
        diff = Math.abs(report[i] - report[i + 1]);
        if (diff < MIN_DIFF || MAX_DIFF < diff) {
            // There're two possibilities, remove element i or element i+1
            reportCopy1 = [...report];
            reportCopy2 = [...report];
            reportCopy1.splice(i, 1);
            reportCopy2.splice(i + 1, 1);

            threshold.decrement();

            condition1 = hasValidAdjacentDiff(reportCopy1, threshold.clone(), valids);
            condition2 = hasValidAdjacentDiff(reportCopy2, threshold.clone(), valids);

            return condition1 || condition2;
        }
    }

    valids.push({ report, threshold });
    return true;
}

/**
 * 
 * @param {Array<number>} report 
 * @param {Threshold} threshold 
 * @returns 
 */
function isSafe(report, threshold) {
    const valids = [];
    if (!hasValidAdjacentDiff(report, threshold, valids))
        return false;

    let isSafe = false;
    valids.forEach(v => {
        isSafe ||= isAsc(v.report, v.threshold.clone());
        isSafe ||= isDesc(v.report, v.threshold.clone());
    });

    return isSafe;
}

function answer_part1(input) {
    return input.filter(report => isSafe(report, new Threshold())).length;
}

function answer_part2(input) {
    return input.filter(report => isSafe(report, new Threshold(1))).length;
}

const input = await createInput();
const solution1 = answer_part1(input);
const solution2 = answer_part2(input);

console.log(`input = ${JSON.stringify(input)}`);
console.log(`[Part 1] solution = ${solution1}`);
console.log(`[Part 2] solution = ${solution2}`);

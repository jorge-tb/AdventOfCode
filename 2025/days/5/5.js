import fs from 'fs';

class Range {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }

    isIn(n) {
        return this.min <= n && n <= this.max;
    }

    static parse(formatted) {
        const [minString, maxString] = formatted.split('-');
        return new Range(Number(minString), Number(maxString));
    }
}

function readInput() {
    const inputText = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
    const splitted = inputText.split(/\r?\n/);
    const trimmed = splitted.map(line => line.trim());
    const separatorIndex = trimmed.findIndex(e => e === '');
    return {
        ranges: trimmed.slice(0, separatorIndex).map(e => Range.parse(e)),
        ids: trimmed.slice(separatorIndex + 1, trimmed.length).map(e => Number(e))
    };
}

function readExample() {
    const example = `
    3-5
    10-14
    16-20
    12-18

    1
    5
    8
    11
    17
    32`;

    const splitted = example.split(/\r?\n/);
    const trimmed = splitted
        .slice(1, splitted.length)
        .map(line => line.trim());
    const separatorIndex = trimmed.findIndex(e => e === '');
    return {
        ranges: trimmed.slice(0, separatorIndex).map(e => Range.parse(e)),
        ids: trimmed.slice(separatorIndex + 1, trimmed.length).map(e => Number(e))
    };
}

function answer_part1() {
    const input = readInput();
    const freshIDs = [];
    input.ids.forEach(id => {
        if (input.ranges.some(r => r.isIn(id)))
            freshIDs.push(id);
    });
    console.log(`Fresh IDs are: ${freshIDs} | length: ${freshIDs.length}`);
}

answer_part1();
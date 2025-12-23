import fs from 'fs';

class Range {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }

    isIn(n) {
        return this.min <= n && n <= this.max;
    }

    combine(range) {
        if (range.max < this.min || range.min > this.max)
            return false;

        if (range.min < this.min && range.max <= this.max) 
            this.min = range.min;
        else if (range.min >= this.min && range.max > this.max)
            this.max = range.max;
        else if (range.min <= this.min && range.max >= this.max) {
            this.max = range.max;
            this.min = range.min;
        }
        return true;
    }

    contains(range) {
        if (range.min >= this.min && range.max <= this.max)
            return true;
        return false;
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

/**
 * Those ranges which overlap others are combined until obtaining an array of ranges equivalent to the original one.
 * @param {Array<Range>} ranges 
 */
function condense(ranges) {
    let condensed = [...ranges];
    let done = false;
    while (!done) {
        for (let i = 0; i < condensed.length; i++) {
            for (let j = 0; j < condensed.length; j++) {
                if (i === j) continue;
                if (condensed[j] && condensed[i] && condensed[i].combine(condensed[j])) {
                    condensed[j] = null;
                }
            }
        }

        done = condensed.every(e => e);
        condensed = condensed.filter(e => e);
    }

    return condensed;
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

function answer_part2() {
    const { ranges } = readInput();
    const condensedRanges = condense(ranges);
    const total = condensedRanges.reduce((prev, r) => {
        return prev += r.max - r.min + 1;
    }, 0);
    console.log(`Fresh IDs are: ${total}`);
}

answer_part1();

answer_part2();
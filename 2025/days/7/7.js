import fs from 'fs';

class Tachyon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isSplit = false;
    }

    split() {
        this.isSplit = true;
        return {
            left: new Tachyon(this.x - 1, this.y),
            right: new Tachyon(this.x + 1, this.y)
        };
    }

    /**
     * Returns true of both tachyons represents the same trace.
     * @param {Tachyon} other 
     */
    equal(other) {
        return this.x === other.x && this.y === other.y;
    }
}

function readInput() {
    const inputText = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
    return inputText.split(/\r?\n/)
}

function readExample() {
    const exampleText =
    `.......S.......
    ...............
    .......^.......
    ...............
    ......^.^......
    ...............
    .....^.^.^.....
    ...............
    ....^.^...^....
    ...............
    ...^.^...^.^...
    ...............
    ..^...^.....^..
    ...............
    .^.^.^.^.^...^.
    ...............`;
    return exampleText.split(/\r?\n/).map(l => l.trim());
}

function readExample_2() {
    const exampleText = 
    `.....S....
     ..........
     ..........
     ..........
     .....^....
     ....^.^...
     ..........
     ...^.^.^..
     ..........
     ..........
     ..........
     ........^.
     .........^`;
     return exampleText
        .split(/\r?\n/)
        .map(l => l.trim());
}

function readExample_3() {
    const exampleText = 
    `.....S....
     ..........
     ..........
     ..........
     .....^....
     ....^^^...
     ..........
     ...^.^.^..
     ..........
     ..........
     ..........
     ........^.
     .........^`;
     return exampleText
        .split(/\r?\n/)
        .map(l => l.trim());
}

function readExample_4() {
    const exampleText = 
    `.....S....
     ..........
     ..........
     ..........
     .....^....
     ....^^^^^.
     ..........
     ...^.^.^..
     ..........
     ..........
     ..........
     ........^.
     .........^`;
     return exampleText
        .split(/\r?\n/)
        .map(l => l.trim());
}

function readExample_5() {
    const exampleText = 
    `.....S....
     ..........
     ..........
     ..........
     .....^....
     ..........
     ..........
     ...^.^.^..
     ......^...
     ..........
     ..^.......
     ........^.
     .........^`;
     return exampleText
        .split(/\r?\n/)
        .map(l => l.trim());
}

/**
 * Process split map and return all tachyons generated due splits.
 * @param {Array<Array<string>>} splitMap 
 */
function processTachyon(splitMap) {
    let lineIdx = 0;
    const tachyons = []
    const startIdx = splitMap[lineIdx].indexOf('S');
    if (startIdx !== -1)
        tachyons.push(new Tachyon(startIdx, lineIdx));

    while(lineIdx < splitMap.length) {
        tachyons
            .filter(t => !t.isSplit)
            .forEach(t => {
                t.y = lineIdx;
                let row = splitMap[lineIdx];
                let trace = row;
                if (row[t.x] === '^') {
                    const { left, right } = t.split();
                    // Improvement: non-duplicated data structure (like Set) suits better for this use case
                    let slLeft = row.slice(0, left.x + 1);
                    let slRight = row.slice(right.x);

                    let leftDotIdx = slLeft.lastIndexOf('.');
                    let leftPipeIdx = slLeft.lastIndexOf('|');
                    let rightDotIdx = slRight.indexOf('.');
                    let rightPipeIdx = slRight.indexOf('|');

                    left.x = leftDotIdx > leftPipeIdx || leftPipeIdx === -1 ? 
                        leftDotIdx : leftPipeIdx;
                    right.x += rightDotIdx < rightPipeIdx || rightPipeIdx === -1 ? 
                        rightDotIdx : rightPipeIdx;

                    if (!tachyons.some(t => t.equal(left))) {
                        tachyons.push(left);
                        // Visual testing
                        trace = trace.slice(0, left.x) +  '|' + trace.slice(left.x + 1); 
                    }
                    if (!tachyons.some(t => t.equal(right))) {
                        tachyons.push(right);
                        // Visual testing
                        trace = trace.slice(0, right.x) + '|' + trace.slice(right.x + 1);
                    }
                } else {
                    // Visual testing
                    trace = trace.slice(0, t.x) + '|' + trace.slice(t.x + 1);
                }

                splitMap[lineIdx] = trace;
            });
        lineIdx++;
    };

    return tachyons;
}

function answer_part1() { // 1769 is not a valid response
    const input = readInput();
    const tachyons = processTachyon(input);
    fs.writeFileSync('output.txt', input.join('\n'), 'utf8');
    const splitTachyonSet = new Set(tachyons
        .filter(t => t.isSplit)
        .map(t => JSON.stringify(t)));
    console.log(`Total tachyon splits: ${splitTachyonSet.size}`);
}


answer_part1()
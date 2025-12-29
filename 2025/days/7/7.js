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
    // Improvement: use a Map instead, where key is JSON.stringify(t) and value is t (t=tachyon instance),
    // then you can ensure non-duplicated elements and retrieving Tachyon[] instead of a list of tachyons JSON strigified.
    const tachyonSet = new Set();
    const tachyons = []
    const startIdx = splitMap[lineIdx].indexOf('S');
    if (startIdx !== -1) {
        let tachyon = new Tachyon(startIdx, lineIdx);
        tachyons.push(tachyon);
        tachyonSet.add(JSON.stringify(tachyon));
    }

    let row, trace;
    while(lineIdx < splitMap.length) {
        tachyons
            .filter(t => !t.isSplit)
            .forEach(t => {
                t.y = lineIdx;
                row = splitMap[lineIdx];
                trace = row;
                if (row[t.x] === '^') {
                    const { left, right } = t.split();
                    // Improvement: non-duplicated data structure (like Set) suits better for this use case
                    if (!tachyonSet.has(JSON.stringify(left))) {
                        tachyons.push(left);
                        tachyonSet.add(JSON.stringify(left));
                        trace = trace.slice(0, left.x) +  '|' + trace.slice(left.x + 1); 
                    }
                    if (!tachyonSet.has(JSON.stringify(right))) {
                        tachyons.push(right);
                        tachyonSet.add(JSON.stringify(right));
                        trace = trace.slice(0, right.x) + '|' + trace.slice(right.x + 1);
                    }
                } else {
                    trace = trace.slice(0, t.x) + '|' + trace.slice(t.x + 1);
                }

                splitMap[lineIdx] = trace;
            });
        lineIdx++;
    };

    return tachyons;
}

function answer_part1() {
    const input = readInput();
    const tachyons = processTachyon(input);
    fs.writeFileSync('output.txt', input.join('\n'), 'utf8');
    const splitTachyonSet = new Set(tachyons
        .filter(t => t.isSplit)
        .map(t => JSON.stringify(t)));
    console.log(`Total tachyon splits: ${splitTachyonSet.size}`);
}

answer_part1()
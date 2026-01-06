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

    toJSON() {
        return JSON.stringify({
            x: this.x,
            y: this.y,
            isSplit: this.isSplit
        });
    }
}

class TachyonNode {
    /**
     * Crates a Tachyon node based on a Tachyon instance without parents nor children by default.
     * @param {Tachyon} tachyon 
     */
    constructor(tachyon) {
        this.value = tachyon;
        this.parents = [];
        this.children = [];
    }

    /**
     * Adds a parent node.
     * @param {TachyonNode} node 
     */
    addParent(node) {
        this.parents.push(node);
    }

    /**
     * Adds a child node.
     * @param {TachyonNode} node 
     */
    addChild(node) {
        this.children.push(node);
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

function readExample_min() {
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
    ...............`
    return exampleText.split(/\r?\n/).map(l => l.trim());
}

function readExample_min_min() {
    const exampleText =
    `.......S.......
    ...............
    .......^.......
    ...............
    ......^.^......
    ...............
    .....^.^.^.....
    ..........^....
    ........^......`
    return exampleText.split(/\r?\n/).map(l => l.trim());
}

function readExample_min_min_min() {
    const exampleText =
    `.......S.......
    ...............
    .......^.......
    ...............
    ......^.^......
    .......^.......`
    return exampleText.split(/\r?\n/).map(l => l.trim());
}

function readExample_min_min_min_ex() {
    const exampleText =
    `.......S.......
    ...............
    .......^.......
    ...............
    ......^.^......
    .......^.......
    ......^.^......
    .........^.....`
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
 * Returns total possible timeline paths described by a tachyon projected in a split map.
 * 
 * WARNING: Consumes too much memory because duplicated Tachyons generate 2^x elements as they still being duplicated.
 * @param {Array<Array<string>>} splitMap 
 */
function computeTimelinePaths_v1(splitMap) {
    let tachyons = [];
    let lineIdx = 0;
    const startIdx = splitMap[lineIdx].indexOf('S');
    if (startIdx !== -1)
        tachyons.push(new Tachyon(startIdx, lineIdx));
    
    let totalPaths = 1;
    while(lineIdx < splitMap.length) {
        tachyons = tachyons.filter(t => !t.isSplit);
        tachyons
            .forEach(t => {
                t.y = lineIdx;
                if (splitMap[lineIdx][t.x] === '^') {
                    const { left, right } = t.split();
                    tachyons.push(left);
                    tachyons.push(right);
                    totalPaths += 1;
                }
            });

        lineIdx++;
    };
    return totalPaths;
}

/**
 * Returns total possible timeline paths described by a tachyon projected in a split map.
 * @param {Array<Array<string>>} splitMap 
 */
function computeTimelinePaths_v2(splitMap) {
    // Insight: there's only one active tachyon trajectory by [x] position. It means that only is necessary to keep in memory
    // splitMap's width length (splitMap[0].length) active tachyons. It would imply a tremendous reduction in memory and computational time consuming.
    const activeTachyons = new Map(); // key={Tachyon.x coordinate}, value={Active Tachyon instance} + incrementer
    let lineIdx = 0;
    const startIdx = splitMap[lineIdx].indexOf('S');
    if (startIdx >= 0)
        activeTachyons.set(startIdx, { 
            tachyon: new Tachyon(startIdx, lineIdx), 
            total: 1 
        });

    let totalPaths = 1;
    while (lineIdx < splitMap.length) {
        activeTachyons
            .values()
            .forEach(entry => {
                const { tachyon, total } = entry;
                tachyon.y = lineIdx;
                if (splitMap[tachyon.y][tachyon.x] === '^') {
                    let { left, right } = tachyon.split();
                    if (left.x < 0) left = null;
                    if (right.x > splitMap[0].length - 1) right = null;

                    if (left) {
                        if (activeTachyons.has(left.x)) {
                            const { tachyon: activeLeft, total: totalLeft } = activeTachyons.get(left.x);
                            activeTachyons.set(left.x, { tachyon: activeLeft, total: totalLeft + total });
                        } else {
                            activeTachyons.set(left.x, { tachyon: left, total: total });
                        }
                    }

                    if (right) {
                        if (activeTachyons.has(right.x)) {
                            const { tachyon: activeRight, total: totalRight } = activeTachyons.get(right.x);
                            activeTachyons.set(right.x, { tachyon: activeRight, total: totalRight + total });
                        } else {
                            activeTachyons.set(right.x, { tachyon: right, total: total });
                        }
                    }
                    
                    activeTachyons.delete(tachyon.x);
                    totalPaths += total;
                }
            });
        lineIdx++;
    }
    return totalPaths;
}

/**
 * Process split map and return all tachyons generated due splits.
 * @param {Array<Array<string>>} splitMap 
 */
function processTachyon(splitMap) {
    let lineIdx = 0;
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
                    // Improvement: non-duplicated data structure (like Set) suits better for this use case.
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

function answer_part2() {
    const input = readInput();
    const totalTimelines = computeTimelinePaths_v2(input);
    console.log(`Total timeline paths: ${totalTimelines}`);
}

answer_part1();

answer_part2();

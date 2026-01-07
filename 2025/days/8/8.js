import fs from 'fs';

class Point3D {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Returns true if 'point' share the same coordinates x, y, and z, otherwise false.
     * @param {Point3D} point 
     * @returns 
     */
    equals(point) {
        return this.x === point.x &&
            this.y === point.y &&
            this.z === point.z;
    }

    toJSON() {
        return JSON.stringify({
            x: this.x,
            y: this.y,
            z: this.z
        });
    }
}

function readInput() {
    const inputText = fs.readFileSync('./input.txt', { encoding: 'utf8' });
    return inputText
        .split(/\r?\n/)
        .map(row => {
            const [x, y, z] = row.trim().split(',');
            return new Point3D(x, y, z);
        });
}

function readExample() {
    const exampleText =
    `162,817,812
    57,618,57
    906,360,560
    592,479,940
    352,342,300
    466,668,158
    542,29,236
    431,825,988
    739,650,466
    52,470,668
    216,146,977
    819,987,18
    117,168,530
    805,96,715
    346,949,466
    970,615,88
    941,993,340
    862,61,35
    984,92,344
    425,690,689`;
    return exampleText
        .split(/\r?\n/)
        .map(row => {
            const [x, y, z] = row.trim().split(',');
            return new Point3D(x, y, z);
        });
}

/**
 * Returns euclidean distance between pointA and pointB.
 * @param {Point3D} pointA 
 * @param {Point3D} pointB 
 */
function euclidean(pointA, pointB) {
    return Math.sqrt(
        (pointA.x - pointB.x)**2 +
        (pointA.y - pointB.y)**2 +
        (pointA.z - pointB.z)**2
    );
}

/**
 * 
 * @param {Array<Point3D>} points 
 */
function closestPair(points, min=-1) {
    let distance;
    let minPair = { points: [], indexs: [], distance: Infinity };
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points.length; j++) {
            if (i === j) continue;

            distance = euclidean(points[i], points[j]);
            if (minPair.distance > distance && distance > min)
                minPair = { 
                    points: [points[i], points[j]],
                    indexs: [i, j],
                    distance
                };
        }
    }
    return minPair;
}

/**
 * 
 * @param {Array<Point3D>} points 
 */
function buildCircuits(points, limitConnections) {
    const circuits = new Map();
    let prevDistance = -1;
    let done = false;
    let totalShortestConnections = 0;
    while (!done && totalShortestConnections < limitConnections) {
        const { points: pair, distance } = closestPair(points, prevDistance);
        if (pair.length === 0) {
            done = true;
        } else if (circuits.has(pair[0]) && circuits.has(pair[1])) {
            let circuit0 = circuits.get(pair[0]);
            let circuit1 = circuits.get(pair[1]);
            if (circuit0 !== circuit1) {
                // Concatenate both circuits
                let mergeCircuit = circuit0.concat(circuit1);
                // Update circuits entries to point the resulting merged circuit
                mergeCircuit.forEach((point, _, arr) => circuits.set(point, arr));
            }
        } else if (circuits.has(pair[0])) {
            let circuit0 = circuits.get(pair[0]);
            circuit0.push(pair[1]);
            circuits.set(pair[1], circuit0);
        } else if (circuits.has(pair[1])) {
            let circuit1 = circuits.get(pair[1]);
            circuit1.push(pair[0]);
            circuits.set(pair[0], circuit1);
        } else {
            circuits.set(pair[0], pair);
            circuits.set(pair[1], pair);
        }

        prevDistance = distance;
        totalShortestConnections++;
    }

    return [...new Set(circuits.values())];
}

function answer_part1() {
    const input = readInput(); // readExample();
    const circuits = buildCircuits(input, 1000);
    const circuitsDesc = circuits.sort((arrA, arrB) => arrB.length - arrA.length);
    const response = circuitsDesc[0].length * circuitsDesc[1].length * circuitsDesc[2].length;
    console.log(`Answer: ${response}`);
}

function answer_part2() {
    const points = readInput();
    const circuits = new Map();
    let prevDistance = -1;
    let done = false;
    let lastPair;
    while (!done) {
        const { points: pair, distance } = closestPair(points, prevDistance);
        if (pair.length === 0) {
            done = true;
        } else if (circuits.has(pair[0]) && circuits.has(pair[1])) {
            let circuit0 = circuits.get(pair[0]);
            let circuit1 = circuits.get(pair[1]);
            if (circuit0 !== circuit1) {
                // Concatenate both circuits
                let mergeCircuit = circuit0.concat(circuit1);
                // Update circuits entries to point the resulting merged circuit
                mergeCircuit.forEach((point, _, arr) => circuits.set(point, arr));

                if (mergeCircuit.length === points.length) {
                    lastPair = pair;
                    done = true;
                }
            }
        } else if (circuits.has(pair[0])) {
            let circuit0 = circuits.get(pair[0]);
            circuit0.push(pair[1]);
            circuits.set(pair[1], circuit0);
        } else if (circuits.has(pair[1])) {
            let circuit1 = circuits.get(pair[1]);
            circuit1.push(pair[0]);
            circuits.set(pair[0], circuit1);
        } else {
            circuits.set(pair[0], pair);
            circuits.set(pair[1], pair);
        }

        prevDistance = distance;
    }

    console.log(`Last pair of points before connecting all junction boxes are: ${lastPair[0].toJSON()} and ${lastPair[1].toJSON()}`);
    console.log(`Answer: ${lastPair[0].x * lastPair[1].x}`);
}

answer_part1();

answer_part2();
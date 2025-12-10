import fs from 'fs';

function readInput() {
    const textInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
    const input = textInput.split('\n').map(line => {
        const [x, y] = line.split(',');
        return { x: +x, y: +y };
    });
    return input;
}

function readExample() {
    const textExample = 
        `7,1
        11,1
        11,7
        9,7
        9,5
        2,5
        2,3
        7,3`;
    const example = textExample.split('\n').map(line => {
        const [x, y] = line.split(',');
        return { x: +x, y: +y };
    });
    return example;
}

function area(point1, point2) {
    return (Math.abs(point1.x - point2.x) + 1) * (Math.abs(point1.y - point2.y) + 1);
}

/**
 * Find out which pair of points can generate the biggest rectangle.
 * @param {Array<{ x: number, y: number }>} points 
 */
function findBiggestRectangle(points) {
    let biggest = { area: 0 };
    let currentArea;
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            currentArea = area(points[i], points[j]);
            if (biggest.area < currentArea)
                biggest = { area: currentArea, points: [points[i], points[j]] };
        }
    }

    return biggest;
}

const columnConnections = new Map();
const rowConnections = new Map();


/**
 * 
 * @param {Array<{ x: number, y: number }>} points 
 */
function c(points) {
    let rectangles = [];
    for (let i = 0; i < points.length; i++) {
        upsertConnection(points[i]);
        for (let j = i + 1; j < points.length; j++) {
            rectangles.push({
                area: area(points[i], points[j]),
                points: [points[i], points[j]]
            });
        }
    }

    // Rectangles sorted in descending order by area
    rectangles.sort((pointA, pointB) => pointB.area - pointA.area);

    console.log(`rectangles = ${JSON.stringify(rectangles[0])} |${JSON.stringify(rectangles[rectangles.length - 1])} `);

    const biggestValid = rectangles.find(rectangle => isValid(rectangle));
    console.log(`biggest valid rectangle is: ${JSON.stringify(biggestValid)}`);
}

/**
 * 
 * @param {{ x: number, y: number }} point 
 */
function upsertConnection(point) {
    upsertRowConnection(point);
    upsertColumnConnection(point);
}

/**
 * Upsert row connection.
 * @param {{ x: number, y: number }} point 
 */
function upsertRowConnection(point) {
    if (rowConnections.has(point.y)) {
        const { min, max } = rowConnections.get(point.y);
        rowConnections.set(point.y, {
            min: min > point.x ? point.x : min,
            max: max < point.x ? point.x : max 
        });
    } else {
        rowConnections.set(point.y, { min: point.x, max: point.x });
    }
}

/**
 * Upsert column connection.
 * @param {*} point 
 */
function upsertColumnConnection(point) {
    if (columnConnections.has(point.x)) {
        const { min, max } = columnConnections.get(point.x);
        columnConnections.set(point.x, {
            min: min > point.y ? point.y : min,
            max: max < point.y ? point.y : max
        });
    } else {
        columnConnections.set(point.x, { min: point.y, max: point.y });
    }
}

/**
 * Return true is rectangle is valid (is composed by red and green tails), otherwise false.
 * @param {{ area: number, points: Array<{ x: number, y: number }>}} rectangle 
 */
function isValid(rectangle) {
    console.log(`(isValid) rectange = ${JSON.stringify(rectangle)}`);
    let [point1, point2] = rectangle.points;
    let connection;

    connection = columnConnections.get(point1.x);
    if (connection.min > point1.y || connection.min > point2.y) return false;
    if (connection.max < point1.y || connection.max < point2.y) return false;

    connection = columnConnections.get(point2.x);
    if (connection.min > point1.y || connection.min > point2.y) return false;
    if (connection.max < point1.y || connection.max < point2.y) return false;

    connection = rowConnections.get(point1.y)
    if (connection.min > point1.x || connection.min > point2.x) return false;
    if (connection.max < point1.x || connection.max < point2.x) return false;

    connection = rowConnections.get(point2.y)
    if (connection.min > point1.x || connection.min > point2.x) return false;
    if (connection.max < point1.x || connection.max < point2.x) return false;

    return true;
}

function answer_part1() {
    const input = readInput();
    const biggestArea = findBiggestRectangle(input);
    console.log(`Biggest possible rectangle has an area of ${JSON.stringify(biggestArea)}`);
}

answer_part1();

//answer_part1();
// const input = readInput();
// const example = readExample();
// console.log(JSON.stringify(example));
// c(example);
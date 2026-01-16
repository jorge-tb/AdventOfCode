import fs from 'fs';

class Point {
    /**
     * Point constructor.
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * If equals return true, otherwise false.
     * @param {Point} point 
     * @returns 
     */
    equals(point) {
        return point.x === this.x && point.y === this.y;
    }


    isLowerThan(point) {
        if (this.x < point.x)
            return true;
        else if (this.x === point.x && this.y < point.y)
            return true;
        else
            return false;
    }

    toJSON() {
        return JSON.stringify({ x: this.x, y: this.y });
    }
}

class Edge {
    /**
     * Edge constructor.
     * @param {Point} point1 
     * @param {Point} point2 
     */
    constructor(point1, point2) {
        if (point1.isLowerThan(point2))
            this.value = [point1, point2];
        else
            this.value = [point2, point1];
    }

    /**
     * If equals return true, otherwise false.
     * @param {Edge} edge 
     */
    equals(edge) {
        return this.value[0].equals(edge.value[0]) &&
        this.value[1].equals(edge.value[1]);
    }

    isRow() {
        return this.value[0].y === this.value[1].y;
    }

    isColumn() {
        return this.value[0].x === this.value[1].x;
    }

    minX() {
        return this.value[0].x;
    }

    maxX() {
        return this.value[1].x;
    }

    minY() {
        return this.value[0].y < this.value[1].y ? this.value[0].y : this.value[1].y;
    }

    maxY() {
        return this.value[0].y < this.value[1].y ? this.value[1].y : this.value[0].y;
    }
}

function readInput() {
    const textInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
    const input = textInput.split('\n').map(line => {
        const [x, y] = line.split(',');
        return { x: +x, y: +y };
    });
    return input;
}

function readExample() {
    const textExample = `7,1:11,1:11,7:9,7:9,5:2,5:2,3:7,3`;
    const example = textExample.split(':').map(line => {
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
function findBiggestRectangle_v1(points) {
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
function findBiggestRectangle_v2(points) {
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

    // Build graph (It's supposing all points can generate the same graph)
    const graph = buildGraph(new Point(points[0].x, points[0].y));

    // Get graph limits
    const limits = getLimitEdges(graph);

    rectangles.find(rectangle => {
        const pointA = new Point(rectangle.points[0].x, rectangle.points[0].y);
        const pointB = new Point(rectangle.points[1].x, rectangle.points[1].y);
        const pointC = new Point(rectangle.points[0].x, rectangle.points[1].y);
        const pointD = new Point(rectangle.points[1].x, rectangle.points[0].y);

        const rectangleEdges = [
            new Edge(pointA, pointD),
            new Edge(pointC, pointB),
            new Edge(pointA, pointC),
            new Edge(pointD, pointB)
        ];
    });


    // console.log(`rectangles = ${JSON.stringify(rectangles[0])} |${JSON.stringify(rectangles[rectangles.length - 1])} `);

    // const biggestRectangle = rectangles.find(rectangle => {
    //     const pointA = new Point(rectangle.points[0].x, rectangle.points[0].y);
    //     const pointB = new Point(rectangle.points[1].x, rectangle.points[1].y);
    //     const pointC = new Point(rectangle.points[0].x, rectangle.points[1].y);
    //     const pointD = new Point(rectangle.points[1].x, rectangle.points[0].y);
    //     const rectangleEdges = [
    //         new Edge(pointA, pointD),
    //         new Edge(pointC, pointB),
    //         new Edge(pointA, pointC),
    //         new Edge(pointD, pointB)
    //     ];
    //     const graph = buildGraph(pointA);
    //     if (graph.length > 1 && graph.every(e => Array.isArray(e))) {
    //         console.log(`point ${JSON.stringify(pointA)} generates more than one graph`);
    //         return false;
    //     } else {
    //         return rectangleEdges.every(e => isIn(e, graph));
    //     }
    // });

    // console.log(`biggest rectangle: ${JSON.stringify(biggestRectangle)}`);

    // return biggestRectangle;
}

/**
 * 
 * @param {Array<Edge>} graph
 * @returns {{ top: Edge, bottom: Edge, right: Edge, left: Edge }}
 */
function getLimitEdges(graph) {
    const limits = {
        top: null,
        bottom: null,
        right: null,
        left: null
    };
    graph.forEach(e => {
        if (e.isColumn()) {
            if (e.maxX() > (limits.right?.maxX() ?? -Infinity))
                limits.right = e;
            if (e.minX() < (limits.left?.minX() ?? Infinity))
                limits.left = e;
        } else {
            if (e.maxY() > (limits.top?.maxY() ?? -Infinity))
                limits.top = e;
            if (e.minY() < (limits.bottom?.minY() ?? Infinity))
                limits.bottom = e;
        }
    });
    return limits;
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
 * @param {{ x: number, y: number }} 
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
 * Based on point coordinates and edges connections a graph of these edges is builded.
 * @param {Point} point 
 * @param {Array<Edge>} graph
 * @returns {Array<Edge>}
 */
function buildGraph(point, graph = []) {
    let connectionPoint;
    if (graph.length === 0) {
        let { min: minY, max: maxY } = columnConnections.get(point.x);
        let { min: minX, max: maxX } = rowConnections.get(point.y);
        let columnEdge = new Edge(new Point(point.x, minY), new Point(point.x, maxY));
        let rowEdge = new Edge(new Point(minX, point.y), new Point(maxX, point.y));
        connectionPoint = tryConnectEdges(columnEdge, rowEdge);

        if (columnEdge.equals(rowEdge)) {
            // It's a lonely unconnected point
            graph.push(columnEdge);
        } else if (connectionPoint) {
            // Ensure: [(P_a-P_b), (P_b-P_c)] instead of [(P_b-P_c), (P_a-P_b)]
            if (columnEdge.value[0].equals(connectionPoint))
                graph = [rowEdge, columnEdge];
            else
                graph = [columnEdge, rowEdge];
        } else {
            // If row & column edges are disconnected, create a different graph for each one
            const graph1 = buildGraph(null, [columnEdge]);
            const graph2 = buildGraph(null, [rowEdge]);
            
            if (graph1.some(edge => edge.equals(graph2[0])))
                return graph1; // If they both converged in the same graph, return only one
            else
                return [graph1, graph2]; // Else, return both
        }
    } else {
        // If graph contains elements
        let lastEdge = graph.at(graph.length - 1);
        let nextPoint = point?.equals(lastEdge.value[0]) ?? false  ? lastEdge.value[1] : lastEdge.value[0];
        let columnEdge, rowEdge;

        let { min: minY, max: maxY } = columnConnections.get(nextPoint.x);
        columnEdge = new Edge(new Point(nextPoint.x, minY), new Point(nextPoint.x, maxY));

        let { min: minX, max: maxX } = rowConnections.get(nextPoint.y);
        rowEdge = new Edge(new Point(minX, nextPoint.y), new Point(maxX, nextPoint.y));

        if (lastEdge.equals(columnEdge) && lastEdge.equals(rowEdge)) {
            return graph;
        } else if (lastEdge.equals(columnEdge)) {
            if (rowEdge.equals(graph[0])) {
                return graph;
            }
            graph.push(rowEdge);
        } else if (lastEdge.equals(rowEdge)) {
            if (columnEdge.equals(graph[0])) {
                return graph;
            }
            graph.push(columnEdge);
        }
        connectionPoint = tryConnectEdges(lastEdge, graph.at(graph.length - 1));
    }
    return buildGraph(connectionPoint, graph);
}

/**
 * Each edge is composed by two points, if both edges share one point they are connected, 
 * in case of sharing both they'll result in the same conceptual edge (they're the same edge),
 * otherwise they're unconnected.
 * @param {Edge} edge1 
 * @param {Edge} edge2 
 * @returns Point which connects both edges, in case of no connection null is returned instead.
 */
function tryConnectEdges(edge1, edge2) {
    if (edge1.value[0].equals(edge2.value[0]) &&
        edge1.value[1].equals(edge2.value[1]))
        throw new Error('Both edges have the same points');
    else if (edge1.value[0].equals(edge2.value[0]))
        return edge1.value[0];
    else if (edge1.value[0].equals(edge2.value[1]))
        return edge1.value[0];
    else if (edge1.value[1].equals(edge2.value[0]))
        return edge1.value[1];
    else if (edge1.value[1].equals(edge2.value[1]))
        return edge1.value[1];
    else
        return null;
}

function answer_part1() {
    const input = readInput();
    const biggestArea = findBiggestRectangle_v1(input);
    console.log(`Biggest possible rectangle has an area of ${JSON.stringify(biggestArea)}`);
}

answer_part1();

const example = readExample();
findBiggestRectangle_v2(example);

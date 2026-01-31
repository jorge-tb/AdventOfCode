import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ON = '#';
export const OFF = '.';

export class Machine {
    /**
     * Machine constructor.
     * @param {Array<string>} activeLightState
     * @param {Array<number>} activeJoltageState
     * @param {Array<Button>} buttons
     */
    constructor(activeLightState, activeJoltageState, buttons) {
        this.activeLightState = activeLightState;
        this.lightState = Array(activeLightState.length).fill(OFF);
        this.activeJoltageState = activeJoltageState;
        this.joltageState = Array(activeJoltageState.length).fill(0);
        this.buttons = buttons;
    }

    /**
     * Press button passed as argument. Button must belong to the machine.
     * @param {Button} button 
     */
    press(button) {
        if (!this.buttons.includes(button))
            throw new Error(`Button passed as argument ${button} do not belong to this machine.`);
        for (const l of button.lights) {
            this.lightState[l] = this.lightState[l] === OFF ? ON : OFF;
            this.joltageState[l]++;
        }
    }

    clone() {
        const clone = new Machine(
            [...this.activeLightState], 
            [...this.activeJoltageState], 
            [...this.buttons]);
        clone.lightState = [...this.lightState];
        clone.joltageState = [...this.joltageState];
        return clone;
    }
 
    hasLightsActive() {
        return this.lightState.join('') === this.activeLightState.join('');
    }

    hasJoltageActive() {
        return this.joltageState.every((val, idx) => val === this.activeJoltageState[idx]);
    }

    static parse(machineDef) {
        const [a, b] = [machineDef.indexOf(']'), machineDef.indexOf('{')];
        const activeLightState = machineDef.slice(0, a + 1).slice(1, -1).split('');
        const textButtons = machineDef.slice(a + 1, b);
        const activeJoltageState = machineDef.slice(b).slice(1, -1).split(',').map(Number);

        const buttons = textButtons
            .trim()
            .split(' ')
            .map(textButton => Button.parse(textButton));

        return new Machine(activeLightState, activeJoltageState, buttons)
    }
}

export class Button {
    /**
     * Lights identified by their indexes that this button toggles.
     * @param {Array<number>} lights 
     */
    constructor(lights) {
        this.lights = lights;
    }

    /**
     * Factory method which returs a Button instance based on string definition.
     * Example: buttonDef='(1, 2)' returns an instance of a Button with lights=[1, 2].
     * @param {string} buttonDef 
     * @returns {Button}
     */
    static parse(buttonDef) {
        const lights = buttonDef
            .slice(1, -1)
            .split(',')
            .map(s => Number(s));
        return new Button(lights);
    }
}

class Queue {
    constructor() {
        this._list = [];
    }

    enqueue(item) {
        this._list.push(item);
    }

    dequeue() {
        return this._list.shift();
    }

    get values() {
        return [...this._list];
    }
}

export class PriorityQueue {
    constructor() {
        this._list = [];
    }

    enqueue(item, priority) {
        const index = this._findIndex(priority);
        this._list.splice(index, 0, { item, priority });
    }

    _findIndex(priority) {
        if (this._list.length === 0)
            return -1;
        let idx = Math.floor(this._list.length / 2);
        let prevIdx = this._list.length;
        let found = false;
        while (!found) {
            if (this._list[idx].priority === priority)
                found = true;
            else if ((!found && idx === 0))
                found = true;
            else if (!found && (idx === this._list.length - 1))
                found = true;
            else {
                if (this._list[idx].priority > priority)
                    idx = Math.floor((idx + prevIdx) / 2);
                else {
                    prevIdx = idx;
                    idx = Math.floor(idx / 2);
                }
            }
        }
        return idx;
    }

    /**
     * The item with highest priority.
     * @return
     */
    dequeue() {
        const { item, priority } = this._list.shift();
        console.log(`item = ${JSON.stringify(item)} with priority = ${priority} has been dequeued.`);
        return item;
    }

    get values() {
        return [...this._list];
    }
}

/**
 * 
 * @param {string} fileURL
 * @returns {Array<Machine>} List of machines.
 */
export function getInputFromFile(fileURL) {
    const textInput = fs.readFileSync(fileURL, { encoding: 'utf-8' });
    return textInput
        .split(/\r?\n/)
        .map(row => Machine.parse(row));
}

/**
 * Given a machine, this method returns the shortest button combination to active it.
 * If machine is already active, an empty list is returned instead.
 * @param {Machine} machine
 * @returns {Array<Button>} Activation button combination.
 */
function findShortestLightsActivation(machine) {
    if (machine.hasLightsActive()) 
        return [];

    const queue = new Queue();
    queue.enqueue({ machine, history: {} });

    const transitions = new Map();
    const isRepeated = (stateKey, button) => 
        transitions.has(stateKey) && transitions.get(stateKey).has(button);
    const updateKey = (stateKey, button) => {
        const bSet = transitions.get(stateKey) ?? new Set();
        bSet.add(button);
        transitions.set(stateKey, bSet);
    }

    while (true) {
        const { machine: next, history } = queue.dequeue();
        const stateKey = next.lightState.join('');
        // If node is already active, the loop must finish
        if (next.hasLightsActive()) {
            return history;
        }
        // Else, generate machine's light state combination through button press
        else {
            for (let i = 0; i < next.buttons.length; i++) {
                const button = next.buttons[i];
                if (!isRepeated(stateKey, button)) {   
                    const clone = next.clone();
                    clone.press(button);
                    const historyClone = {...history};
                    historyClone[i] = (historyClone[i] ?? 0) + 1;
                    queue.enqueue({ machine: clone, history: historyClone });
                    updateKey(stateKey, button);
                }
            }
        }
    }
}

/**
 * Given a machine, this method returns the shortest button combination to active it.
 * If machine is already active, an empty list is returned instead.
 * @param {Machine} machine
 * @returns {Array<Button>} Activation button combination.
 */
export function findShortestJoltageActivation(machine) {
    if (machine.hasJoltageActive()) 
        return [];

    // Here's one of the most important Cutting Plane method.
    const isJoltageExceeded = (machine) => {
        return machine.joltageState
            .some((val, idx) => val > machine.activeJoltageState[idx]);
    }

    // Heuristic
    // TODO: Create a priority queue such that: 
    // If joltage active state is: { J0, J1, J2, ..., JN }
    // and joltage state is: { j0, j1, j2, ..., jn }
    // Then diff=(J0-j0)+(J1-j1)+(J2-j2)+...+(JN-jn) can guide the priority.
    // Lower diff the greatest priority.
    const priority = (machine) => {
        return -machine.activeJoltageState.reduce((prev, curr, idx) => {
            return prev + (curr - machine.joltageState[idx])
        });
    }

    // Optimizations
    // TODO: Think about using backtracking or cache strategy to avoid paths already discovered.
    // joltageState + history as key, if key exists, then it's not necessary to create a new machine element.


    // Intuition: Is it possible to relay exclusively in the first solution obtained by Best-First Search?

    const priorityQueue = new PriorityQueue();
    priorityQueue.enqueue({ machine, history: {} }, priority(machine));

    const set = new Set();

    while (true) {
        const { machine: next, history } = priorityQueue.dequeue();
        // If node is already active, the loop must finish
        if (next.hasJoltageActive()) {
            return history;
        }
        // Else, generate machine's light state combination through button press
        else {
            if (!isJoltageExceeded(next)) {
                for (let i = 0; i < next.buttons.length; i++) {
                    const button = next.buttons[i];
                    const clone = next.clone();
                    clone.press(button);
                    const historyClone = {...history};
                    historyClone[i] = (historyClone[i] ?? 0) + 1;
                    set.add(JSON.stringify(historyClone));
                    priorityQueue.enqueue(
                        { machine: clone, history: historyClone },
                        priority(clone)
                    );
                }
            }
        }
    }
}

/**
 * Creates a linear extended equation matrix system generated by active joltage state and buttons constraints.
 * Example: matrix=[[1, 0, 0, 21],[0, 1, 0, 50],[0, 0, 1, 7]]
 * represents an equation system related to: Buttons (0) (1) (2) and Joltage {21, 50, 7}
 * @param {Machine} machine
 * @returns {Array<Array<number>>} Extended Linear Equation Matrix.
 */
export function buildJoltageMatrix(machine) {
    let button;
    let matrix = [];
    for (let i = 0; i < machine.activeJoltageState.length; i++) {
        matrix.push(Array(machine.buttons.length).fill(0));
        for (let j = 0; j < machine.buttons.length; j++) {
            button = machine.buttons[j];
            matrix[i][j] = button.lights.includes(i) ? 1 : 0;
        }
        matrix[i].push(machine.activeJoltageState[i]);
    }
    return matrix;
}

/**
 * Applies Gaussian elimination.
 * @param {Array<Array<number>>} matrix 
 */
export function gauss(matrix) {
    matrix.sort((rowA, rowB) => rowA.indexOf(1) - rowB.indexOf(1));

    let pivot;
    let factor;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = i; j < matrix.length; j++) {
            if (i === j) {
                pivot = matrix[j][i];
            } else if (matrix[j][i]) {
                factor = pivot / matrix[j][i];
                matrix[j] = matrix[j].map(e => e * factor);
                matrix[j] = matrix[j].map((e, idx) => e - matrix[i][idx]);
            }

            if (!pivot) break;
        }
    }
}

/**
 * If the number of independent linear equations match the unknowns, this method returns an array with solutions
 * in such way that [s0, s1, s2, ..., sn] is associated to x0, x1, ..., xn by sub-index (x0=s0, x1=s1, ..., xn=sn).
 * However if the number of independent linear equations is lower than unknowns a list of functions is returned,
 * every function defines a certain xi=si(x0', x1', ..., xm') for a certain i-x and s where x0',x1', ... xm' are
 * those unknowns extra.
 * @param {Array<number> | Array<function>} gaussianMatrix 
 */
function resolver(gaussianMatrix) {
    // TODO: To implement.
}



function answer_part1() {
    const machines = getInputFromFile(join(__dirname, './input.txt'), { encoding: 'utf-8' });
    let solution = 0;
    let shortestCombination;
    for (const m of machines) {
        shortestCombination = findShortestLightsActivation(m);
        solution += Object.values(shortestCombination)
            .reduce((prev, v) => prev + v, 0);
    }
    console.log(`The fewest button presses to correctly configure the indicator lights of all machines is: ${solution}`);
}

function answer_part2() {
    const machines = getInputFromFile(join(__dirname, './input.txt'), { encoding: 'utf-8' });
    let solution = 0;
    let shortestCombination;
    for (const m of machines) {
        shortestCombination = findShortestJoltageActivation(m);
        solution += Object.values(shortestCombination)
            .reduce((prev, v) => prev + v, 0);
    }
    console.log(`The fewest button presses to correctly configure the joltage of all machines is: ${solution}`);
}

function isRunningFromTest() {
    return process.argv[1].endsWith('test.js');
}

if (!isRunningFromTest()) {
    answer_part1();
    answer_part2();
}
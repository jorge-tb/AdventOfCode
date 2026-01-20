import fs from 'fs';

export const ON = '#';
export const OFF = '.';

export class Machine {
    /**
     * Machine constructor.
     * @param {Array<string>} activeState
     * @param {Array<Button>} buttons
     */
    constructor(activeState, buttons) {
        this.state = Array(activeState.length).fill(OFF);
        this.activeState = activeState;
        this.buttons = buttons;
    }

    /**
     * Press button passed as argument. Button must belong to the machine.
     * @param {Button} button 
     */
    press(button) {
        if (!this.buttons.includes(button))
            throw new Error(`Button passed as argument ${button} do not belong to this machine.`);
        for (const l of button.lights) 
            this.state[l] = this.state[l] === OFF ? ON : OFF;
    }

    clone() {
        const clone = new Machine([...this.activeState], [...this.buttons]);
        clone.state = [...this.state];
        return clone;
    }

    activationDistance() {
        return this.activeState.reduce((acc, val, index) => {
            return val !== this.state[index] ? acc + 1 : acc;
        }, 0);
    }
 
    isActive() {
        return this.state.join('') === this.activeState.join('');
    }

    static parse(machineDef) {
        const [a, b] = [machineDef.indexOf(']'), machineDef.indexOf('{')];
        const activeState = machineDef.slice(0, a + 1).slice(1, -1).split('');
        const textButtons = machineDef.slice(a + 1, b);
        const joltage = machineDef.slice(b); // Not used yet.

        const buttons = textButtons
            .trim()
            .split(' ')
            .map(textButton => Button.parse(textButton));

        return new Machine(activeState, buttons)
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
function findShortestActivation(machine) {
    if (machine.isActive()) 
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
        const stateKey = next.state.join('');
        // If node is already active, the loop must finish
        if (next.isActive()) {
            return history;
        }
        // Else, generate machine's state combination through button press
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

function answer_par1() {
    const machines = getInputFromFile('./input.txt', { encoding: 'utf-8' });
    let solution = 0;
    let shortestCombination;
    for (const m of machines) {
        shortestCombination = findShortestActivation(m);
        solution += Object.values(shortestCombination)
            .reduce((prev, v) => prev + v, 0);
    }
    console.log(`The fewest button presses to correctly configure the indicator lights of all machines is: ${solution}`);
}

answer_par1();
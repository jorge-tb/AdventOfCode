import { test } from 'node:test';
import assert from 'node:assert';
import { getInputFromFile, findShortestJoltageActivation, buildJoltageMatrix, Button, Machine, PriorityQueue, ON, OFF, gauss, resolve } from '../../../../2025/days/10/10.js';

test('getInputFromFile', () => {
    const fileURL = './example-input.txt';
    const machines =  getInputFromFile(fileURL);
    assert.equal(machines.length, 3);
    assert.deepStrictEqual(
    {
        activeLightState: machines[0].activeLightState,
        lightState: machines[0].lightState,
        activeJoltageState: machines[0].activeJoltageState,
        joltageState: machines[0].joltageState,
        buttons: machines[0].buttons 
    }, 
    {
        activeLightState: ['.', '#', '#', '.'],
        lightState: ['.', '.', '.', '.'],
        activeJoltageState: [3, 5, 4, 7],
        joltageState: [0, 0, 0, 0],
        buttons: [
            Button.parse('(3)'),
            Button.parse('(1,3)'),
            Button.parse('(2)'),
            Button.parse('(2,3)'),
            Button.parse('(0,2)'),
            Button.parse('(0,1)')
        ]
    });
});

test('Machine', (t) => {
    let machine;
    t.beforeEach(() => {
        machine = Machine.parse('[..#..] (0) (1) (2) (3) (4) (1,2) {1}');
    });

    t.test('press to turn ON', () => {
        const firstButton = machine.buttons[0];
        machine.press(firstButton);
        assert.equal(machine.lightState[0], ON);
    });

    t.test('double press same button to return to original light state', () => {
        const firstButton = machine.buttons[0];
        machine.press(firstButton);
        machine.press(firstButton);
        assert.equal(machine.lightState[0], OFF);
    });

    t.test('active machine lights pressing buttons', () => {
        const buttons = machine.buttons;
        machine.press(buttons[2]);
        assert.equal(machine.hasLightsActive(), true);
    });

    t.test('by default machine lights are not active', () => {
        assert.equal(machine.hasLightsActive(), false);
    });

    t.test('active machine joltage pressing buttons', () => {
        const buttons = machine.buttons;
        machine.press(buttons[0]);
        assert.equal(machine.hasJoltageActive(), true);
    });

    t.test('by default machine joltage is set to 0s', () => {
        assert.equal(machine.hasJoltageActive(), false);
    });
});

test('PriorityQueue', (t) => {
    t.test('create instance', () => {
        const priorityQueue = new PriorityQueue();
        assert.ok(priorityQueue);
    });

    t.test('enqueue', () => {
        const priorityQueue = new PriorityQueue();
        priorityQueue.enqueue({ value: 'World' }, 1);
        priorityQueue.enqueue({ value: 'Hello' }, 2);
        assert.deepStrictEqual(priorityQueue.values, [
            { item: { value: 'Hello' }, priority: 2 },
            { item: { value: 'World' }, priority: 1 }]);
    });

    t.test('dequeue', () => {
        const priorityQueue = new PriorityQueue();
        priorityQueue.enqueue({ value: 'World' }, 1);
        priorityQueue.enqueue({ value: 'Hello' }, 2);
        const item1 = priorityQueue.dequeue();
        const item2 = priorityQueue.dequeue();
        assert.equal(item1.value + ' ' + item2.value, 'Hello World');
    });
});

test('findShortestJoltageActivation', () => {
    const buttonsDef = ['(3)', '(1, 3)', '(2)', '(2, 3)', '(0, 2)', '(0, 1)'];
    const machine = new Machine(
        ['.', '#', '#', '.'], 
        [3, 5, 4, 7],
        buttonsDef.map(def => Button.parse(def)));
    const buttonHistory = findShortestJoltageActivation(machine);
    const total = Object.values(buttonHistory).reduce((prev, curr) => prev + curr, 0);
    assert.equal(total, 10);
});

test('findJoltageMatrix', () => {
    const buttonsDef = ['(3)', '(1, 3)', '(2)', '(2, 3)', '(0, 2)', '(0, 1)'];
    const machine = new Machine(
        ['.', '#', '#', '.'], 
        [3, 5, 4, 7],
        buttonsDef.map(def => Button.parse(def)));
    const matrix = buildJoltageMatrix(machine);
    assert.deepStrictEqual(matrix, [
        [0, 0, 0, 0, 1, 1, 3],
        [0, 1, 0, 0, 0, 1, 5],
        [0, 0, 1, 1, 1, 0, 4],
        [1, 1, 0, 1, 0, 0, 7]
    ]);
});

test('gauss', (t) => {
    t.test('(1) - easy', () => {
        const matrix = [
            [0, 0, 0, 0, 1, 1, 3],
            [0, 1, 0, 0, 0, 1, 5],
            [0, 0, 1, 1, 1, 0, 4],
            [1, 1, 0, 1, 0, 0, 7]
        ];
        gauss(matrix);
        assert.deepStrictEqual(matrix, [
            [1, 1, 0, 1, 0, 0, 7],
            [0, 1, 0, 0, 0, 1, 5],
            [0, 0, 1, 1, 1, 0, 4],
            [0, 0, 0, 0, 1, 1, 3]
        ]);
    });

    t.test('(2) - hard', () => {
        const matrix = [
            [1, 0, 1, 1, 0, 0, 1, 1, 67],
            [0, 1, 0, 0, 0, 0, 1, 0, 29],
            [0, 0, 0, 1, 1, 1, 1, 0, 30],
            [0, 1, 0, 1, 0, 1, 0, 0, 40],
            [1, 0, 0, 0, 0, 0, 1, 0, 18],
            [0, 1, 0, 1, 1, 1, 0, 1, 54],
            [0, 0, 1, 0, 1, 0, 0, 0, 21]
        ];
        gauss(matrix);
        const solutions = resolve(matrix);
        assert.deepStrictEqual(matrix, [
            [1, 0, 1, 1, 0, 0, 1, 1, 67],
            [0, 1, 0, 0, 0, 0, 1, 0, 29],
            [0, 0, -1, -1, 0, 0, 0, -1, -49],
            [-0, -0, 0, 1, -1, -0, -0, 1, 28],
            [0, 0, 0, 0, 1, 1, -1, -1, -17],
            [0, 0, 0, 0, 0, -0.5, 0.5, 1, 15.5],
            [0, 0, 0, 0, 0, 0, 1, -0.5, 2.5]
        ]);
    });
});

test('resolve', () => {
    const gaussianMatrix = [
        [1, 0, 1, 1, 0, 0, 1, 1, 67],
        [0, 1, 0, 0, 0, 0, 1, 0, 29],
        [0, 0, -1, -1, 0, 0, 0, -1, -49],
        [-0, -0, 0, 1, -1, -0, -0, 1, 28],
        [0, 0, 0, 0, 1, 1, -1, -1, -17],
        [0, 0, 0, 0, 0, -0.5, 0.5, 1, 15.5],
        [0, 0, 0, 0, 0, 0, 1, -0.5, 2.5]
    ];
    const solutions = resolve(gaussianMatrix);
    const matchIdx = solutions.findIndex(s => s.value === undefined);
    assert.notEqual(matchIdx, -1, 'Undefined unknown must exist.');
    assert.equal(matchIdx, solutions.length - 1, 'Just one unknown must be undefined and it\'s the last one.');
    assert.ok(solutions.slice(0, matchIdx).every(s => typeof s.value === 'function'),
        'The rest of Unknown elements must have \'function\' type as value.');

    const expectedSolutions = [
        { free: 1, solutions: [15, 26, 8, 40, 13, -26, 3, 1] },
        { free: 13, solutions: [9, 20, 20, 16, 1, 4, 9, 13] }
    ];
    for (const expecSol of expectedSolutions) {
        solutions[matchIdx].value = expecSol.free;
        const areEqual = solutions.every((s, idx) => {
            const val = typeof s.value === 'function' ? s.value() : s.value;
            console.log(`val=${val} expected=${expecSol.solutions[idx]}`)
            return val === expecSol.solutions[idx];
        });
        assert.ok(areEqual, `When free variable is equal to ${expecSol.free}, solutions must be ${expecSol.solutions}`);
    }
});

/**
 * solutions = [null, null, null, null, null, null];
 * find first element distinct of zero -> matrix[3][4]
 * store this information { 4 }
 * next iteration finds that matrix[3][5] is non-zero and is not the Constant
 * solutions = [null, null, null, null, undefined, null]
 * then solution for unknown [4] will be a function -> solutions[4] = f([5]) => undefined
 * next iteration find that matrix[3][6] is the Constant
 * then solution for unknown [4] will be a function -> solution[4] = f() => Constant - solutions[5];
 * 
 * solutions = [null, null, null, null, f(), undefined]
 * find first element distinct of zero -> matrix[2][2]
 * store this information { 2 }
 * next iteration finds that matrix[2][3] is non-zero and it's not the Constant
 * if (solutions[3] === null) -> set it as undefined
 * solutions = [null, null, null, undefined, f(), undefined]
 * next iteration finds that matrix[2][4] is non-zero and it's not the Constant
 * if (solutions[4] === null) -> in this case this statement is false
 * next iteration finds that matrix[2][5] is zero and it's not the Constant -> nothing to do
 * next iteration finds that matrix[2][6] is the Constant
 * then solution for unknown [2] will be a function -> solutions[2] = f'() => Constant - solutions[3] - solutions[4]
 * which in turn as solutions[4] = f(), it can be reexpressed as:
 * solutions[2] = f'() => Constant - solutions[3] - f()
 * 
 * solutions = [null, null, f'(), undefined, f(), undefined]
 * find first element distinct of zero -> matrix[1][1]
 * store this information { 1 }
 * next iteration finds that matrix[1][2] is zero -> nothing to do
 * next iteration finds that matrix[1][3] is zero -> nothing to do
 * next iteration finds that matrix[1][4] is zero -> nothing to do
 * next iteration finds that matrix[1][5] is non-zero
 * if (solutions[5] === null) -> in this case this statement is false -> nothing to do
 * next iteration finds that matrix[1][6] is the Constant
 * then solution for unknown [1] will be a function -> solution[1] = f''() => Constant - solutions[5]
 * 
 * solutions = [null, f''(), f'(), undefined, f(), undefined]
 */
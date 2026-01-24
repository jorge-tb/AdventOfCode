import { test } from 'node:test';
import assert from 'node:assert';
import { getInputFromFile, Button, Machine, PriorityQueue, ON, OFF } from '../../../../2025/days/10/10.js';

test('getInputFromFile', (t) => {
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
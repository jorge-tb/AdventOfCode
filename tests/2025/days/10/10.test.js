import { test } from 'node:test';
import assert from 'node:assert';
import { getInputFromFile, Button, Machine, ON, OFF } from '../../../../2025/days/10/10.js';

test('getInputFromFile', (t) => {
    const fileURL = './example-input.txt';
    const machines =  getInputFromFile(fileURL);
    assert.equal(machines.length, 3);
    assert.deepStrictEqual(
    {
        activeState: machines[0].activeState,
        state: machines[0].state,
        buttons: machines[0].buttons 
    }, 
    {
        activeState: ['.', '#', '#', '.'],
        state: ['.', '.', '.', '.'],
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
        assert.equal(machine.state[0], ON);
    });

    t.test('double press same button to return to original state', () => {
        const firstButton = machine.buttons[0];
        machine.press(firstButton);
        machine.press(firstButton);
        assert.equal(machine.state[0], OFF);
    });

    t.test('active machine pressing buttons', () => {
        const buttons = machine.buttons;
        machine.press(buttons[2]);
        assert.equal(machine.isActive(), true);
    });

    t.test('by default machine is not active', () => {
        assert.equal(machine.isActive(), false);
    });
});
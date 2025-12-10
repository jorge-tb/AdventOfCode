import fs from 'fs';

function readInput() {
    const textInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
    return textInput.split(',');
}

function searchInvalidIDs(input) {
    
}
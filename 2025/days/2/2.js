import fs from 'fs';

function readInput() {
    const textInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
    return textInput.split(',');
}

function readExample() {
    return [
        '11-22',
        '95-115',
        '998-1012',
        '1188511880-1188511890',
        '222220-222224',
        '1698522-1698528',
        '446443-446449',
        '38593856-38593862'
    ];
}

function searchInvalidIDs(input) {
    let invalids = [];
    input.forEach(range => {
        let [min, max] = range.split('-');
        invalids = invalids.concat(getInvalidBetween(Number(min), Number(max)))
    });
    return invalids;
}

function searchInvalidIDs_v2(input) {
    let invalids = [];
    input.forEach(range => {
        let [min, max] = range.split('-');
        invalids = invalids.concat(getInvalidBetween_v2(Number(min), Number(max)))
    });
    return invalids;
}

function getInvalidBetween(min, max) {
    const invalids = [];
    for (let i = min; i < max + 1; i++) {
        if (isInvalid(i))
            invalids.push(i);
    }
    return invalids;
}

function getInvalidBetween_v2(min, max) {
    const invalids = [];
    for (let i = min; i < max + 1; i++) {
        if (isInvalid_v2(i))
            invalids.push(i);
    }
    return invalids;
}

/**
 * Returns true if n is invalid based on Part 1 defined constraints, otherwise false.
 * @param {number} n 
 * @returns 
 */
function isInvalid(n) {
    const nString = n.toString();
    if (nString.length % 2 === 1) 
        return false;

    const subPattern = nString.substring(0, nString.length / 2);
    const rebuild = subPattern.repeat(2);
    if (Number(rebuild) === n)
        return true;
    return false;
}

/**
 * Returns true if n is invalid based on Part 2 defined constraints, otherwise false.
 * @param {number} n 
 * @returns 
 */
function isInvalid_v2(n) {
    const nString = n.toString();
    if (nString.length === 1) 
        return false;

    let subPattern;
    const maxPatternSize = Math.ceil(nString.length % 2 ? nString.length / 3 : nString.length / 2);
    for (let i = 1; i < maxPatternSize + 1; i++) {
        if (nString.length % i === 0) {
            // Consider this pattern size, because if i is multiple of nString length
            // is possible to compose nString as subPattern + subPattern + ... + subPattern = subPattern * i
            subPattern = nString.substring(0, i);
            const rebuild = subPattern.repeat(nString.length / i);
            if (Number(rebuild) === n)
                return true;
        }
    }
    return false;
}

function answer_part1() {
    const invalidIDs = searchInvalidIDs(readInput());
    const invalidIDsSum = invalidIDs.reduce((prev, id) => prev + id, 0);
    console.log(`(v1) The sum up of all invalid identifiers is: ${invalidIDsSum}`);
}

function answer_part2() {
    const invalidIDs = searchInvalidIDs_v2(readInput());
    const invalidIDsSum = invalidIDs.reduce((prev, id) => prev + id, 0);
    console.log(`(v2) The sum up of all invalid identifiers is: ${invalidIDsSum}`);
}

answer_part1();

answer_part2();

import data from './input.json' with { type: 'json' }

class Dial {
    constructor(min, max, position=null) {
        if (min >= max) 
            throw new Error('Dial min must be strictly less than max');
        this.min = min;
        this.max = max;
        this.position = position || this.min;
    }

    moveRight(n) {
        if(n < 0)
            throw new Error('Number of movements to the right must be greater or equal to 0');
        this.position = (this.position + n) % (this.min + this.max + 1);
    }

    moveLeft(n) {
        if (n < 0)
            throw new Error('Number of movements to the left must be greater or equal to 0');
        this.position = this.position - n % (this.min + this.max + 1);
         if (this.position < 0)
             this.position += this.max + 1;
    }
}

const directions = {
    right: 'R', left: 'L'
};

/**
 * Returns the password.
 * @param {Array<string>} movements Encoded dial movements as R{X} or L{Y},
 *  where R refers to Right and L to Left, and X and Y refer to number of positions dial must be moved in such direction.
 * @param {Dial} dial 
 * @returns Number of times dial marks 0 after any rotation in the sequence.
 */
function computePassword(movements, dial) {
    let direction;
    let totalMove;
    return movements.reduce((zeroCount, move) => {
        direction = move[0];
        totalMove = Number(move.substring(1));
        if (direction === directions.right) {
            dial.moveRight(totalMove);
        } else if (direction === directions.left) {
            dial.moveLeft(totalMove);
        }

        if (dial.position === 0) {
            zeroCount++
        }

        return zeroCount;
    }, 0);
}

function computePassword_v2(movements, dial) {
    const totalDial = dial.max - dial.min + 1;

    let direction;
    let totalMove;
    let offset;
    let oldPosition;
    let zeroPasses;

    return movements.reduce((zeroCount, move) => {
        direction = move[0];
        totalMove = Number(move.substring(1));
        offset = totalMove % totalDial;
        oldPosition = dial.position;
        zeroPasses = Math.floor(totalMove / totalDial);

        if (direction === directions.right) {
            dial.moveRight(totalMove);
            if (oldPosition + offset > totalDial && oldPosition)
                zeroPasses += 1;
        } else if (direction === directions.left) {
            dial.moveLeft(totalMove);
            if (oldPosition < offset && oldPosition)
                zeroPasses += 1;
        }

        if (dial.position === 0 && oldPosition) {
            zeroCount++
        }

        zeroCount += zeroPasses;

        return zeroCount;
    }, 0);
}


function answer_part1() {
    const dial = new Dial(0, 99, 50);
    const password = computePassword(data.input, dial);
    console.log(`(v1) password = ${password}`);
}

function answer_part2() {
    const dial = new Dial(0, 99, 50);
    const password = computePassword_v2(data.input, dial);
    console.log(`(v2) password = ${password}`);
}

answer_part1();

answer_part2();
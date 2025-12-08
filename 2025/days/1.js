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

/**
 * Returns the password.
 * @param {Array<string>} movements Encoded dial movements as R{X} or L{Y},
 *  where R refers to Right and L to Left, and X and Y refer to number of positions dial must be moved in such direction.
 * @param {Dial} dial 
 * @returns Number of times dial marks 0 after any rotation in the sequence.
 */
function computePassword(movements, dial) {
    const right = 'R';
    const left = 'L';
    let direction;
    let totalMove;
    return movements.reduce((zeroCount, move) => {
        direction = move[0];
        totalMove = Number(move.substring(1));
        if (direction === right) {
            console.log(`[${move}] from position ${dial.position} to the right ${totalMove} positions`);
            dial.moveRight(totalMove);
        } else if (direction === left) {
            console.log(`[${move}] from position ${dial.position} to the left ${totalMove} position`);
            dial.moveLeft(totalMove);
        }

        console.log(`ending at position = ${dial.position}`);

        if (dial.position === 0) {
            console.log(`zero!`);
            zeroCount++
        }

        return zeroCount;
    }, 0);
}

const dial = new Dial(0, 99, 50);
const password = computePassword(data.input, dial);
console.log(`password = ${password}`);
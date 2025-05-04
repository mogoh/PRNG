export class PRNG {
    private _seed: number;

    constructor(seed?: number) {
        if (seed !== undefined) {
            this._seed = seed;
        } else {
            this._seed = this.randomSeed();
        }
    }

    set seed(s: number) {
        this._seed = s;
    }

    /**
     * Generates a random 32bit integer.
     */
    randomSeed(): number {
        return Math.floor(2**32 * Math.random());
    }

    /**
     * Source: https://github.com/bryc/code/blob/master/jshash/PRNGs.md
     */
    mulberry32(): number {
        this._seed |= 0;
        this._seed = this._seed + 0x6D2B79F5 | 0;
        let t = Math.imul(this._seed ^ this._seed >>> 15, 1 | this._seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }

    nextNumber(): number {
        return this.mulberry32();
    }

    /**
     * @param min minimum (inclusive)
     * @param max maximum (exclusive)
     */
    nextInt(min: number, max: number): number {
        return Math.floor(this.nextNumber() * (max - min)) + min;
    }

    nextString(length: number, characters?: string): string {
        let result = "";
        const ascii_printable =
            " !\"#$%&'()*+,-./" +
            "0123456789:;<=>?" +
            "@ABCDEFGHIJKLMNO" +
            "PQRSTUVWXYZ[\\]^_" +
            "`abcdefghijklmno" +
            "pqrstuvwxyz{|}~";
        if (characters === undefined) {
            characters = ascii_printable;
        }
        const characters_length = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(this.nextInt(0, characters_length));
            counter += 1;
        }
        return result;
    }

    /**
     * Choses an Element of an array. No Copying.
     * @param arr Array without holes
     * @returns Element of said array
     */
    nextChoose<T>(arr: T[]): T {
        const i = this.nextInt(0, arr.length);
        return arr[i];
    }

    /**
     * Choses an Element of an array, weighted by numbers. No Copying.
     * @param arr Array without holes
     * @returns Element of said array
     */
    fractionChoose<T>(a: Array<[T, number]>): T {
        let sum = a.reduce((acc, current) => acc + current[1], 0);
        let choice = this.nextInt(1, sum + 1);
        let i = 0;
        let acc = 0;
        while (acc < choice) {
            acc += a[i][1];
            i += 1;
        }
        return a[i - 1][0];
    }

    /**
     * Shuffels an array.
     * @param arr Array.
     * @returns Same array, but shuffled.
     */
    nextShuffle<T>(arr: T[]): T[] {
        for (const [i, i_value] of arr.entries()) {
            let j = this.nextInt(0, arr.length);
            let j_value = arr[j];
            arr[i] = j_value;
            arr[j] = i_value;
        }
        return arr;
    }
}

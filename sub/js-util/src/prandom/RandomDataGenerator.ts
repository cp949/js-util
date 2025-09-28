export class RandomDataGenerator {
  private c = 1;
  private s0 = 0;
  private s1 = 0;
  private s2 = 0;
  private n = 0;
  private signs = [-1, 1];

  private static DEFAULT_INSTANCE: RandomDataGenerator | undefined = undefined;

  constructor(seeds?: string | string[]) {
    this.init(seeds ?? [(Date.now() * Math.random()).toString()]);
  }

  static getDefaultInstance(): RandomDataGenerator {
    if (!this.DEFAULT_INSTANCE) {
      this.DEFAULT_INSTANCE = new RandomDataGenerator();
    }
    return this.DEFAULT_INSTANCE;
  }

  private rnd = (): number => {
    const t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10; // 2^-32

    this.c = t | 0;
    this.s0 = this.s1;
    this.s1 = this.s2;
    this.s2 = t - this.c;

    return this.s2;
  };

  init = (seeds: string | string[]) => {
    if (typeof seeds === 'string') {
      this.state(seeds);
    } else {
      this.sow(seeds);
    }
  };

  /**
   * Gets or Sets the state of the generator. This allows you to retain the values
   * that the generator is using between games, i.e. in a game save file.
   *
   * To seed this generator with a previously saved state you can pass it as the
   * `seed` value in your game config, or call this method directly after Phaser has booted.
   *
   * Call this method with no parameters to return the current state.
   *
   * If providing a state it should match the same format that this method
   * returns, which is a string with a header `!rnd` followed by the `c`,
   * `s0`, `s1` and `s2` values respectively, each comma-delimited.
   *
   * @param value - Generator state to be set.
   * @returns The current state of the generator.
   */
  private state = (value?: string): string => {
    if (typeof value === 'string' && value.match(/^!rnd/)) {
      const state = value.split(',');

      this.c = parseFloat(state[1]!);
      this.s0 = parseFloat(state[2]!);
      this.s1 = parseFloat(state[3]!);
      this.s2 = parseFloat(state[4]!);
    }

    return ['!rnd', this.c, this.s0, this.s1, this.s2].join(',');
  };

  private sow = (seeds: string[]) => {
    // Always reset to default seed
    this.n = 0xefc8249d;
    this.s0 = this.hash(' ');
    this.s1 = this.hash(' ');
    this.s2 = this.hash(' ');
    this.c = 1;

    if (!seeds) {
      return;
    }

    // Apply any seeds
    for (let i = 0; i < seeds.length; i++) {
      const seed = seeds[i];
      if (seed === undefined || seed === null) {
        break;
      }

      this.s0 -= this.hash(seed);
      this.s0 += ~~(this.s0 < 0);
      this.s1 -= this.hash(seed);
      this.s1 += ~~(this.s1 < 0);
      this.s2 -= this.hash(seed);
      this.s2 += ~~(this.s2 < 0);
    }
  };

  private hash = (data: string): number => {
    let h;
    let n = this.n;

    data = data.toString();

    for (let i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }

    this.n = n;

    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  /**
   * Returns a random integer between 0 and 2^32.
   *
   * @return A random integer between 0 and 2^32.
   */
  integer = (): number => {
    // 2^32
    return this.rnd() * 0x100000000;
  };

  /**
   * Returns a random real number between 0 and 1.
   *
   * @return A random real number between 0 and 1.
   */
  frac = (): number => {
    // 2^-53
    return this.rnd() + ((this.rnd() * 0x200000) | 0) * 1.1102230246251565e-16;
  };

  /**
   * Returns a random real number between 0 and 2^32.
   *
   * @return A random real number between 0 and 2^32.
   */
  real = (): number => {
    return this.integer() + this.frac();
  };

  /**
   * Returns a random integer between and including min and max.
   *
   * @param min - The minimum value in the range.
   * @param max - The maximum value in the range.
   *
   * @return A random number between min and max.
   */
  integerInRange = (min: number, max: number): number => {
    return Math.floor(this.realInRange(0, max - min + 1) + min);
  };

  /**
   * Returns a random integer between and including min and max.
   * This method is an alias for RandomDataGenerator.integerInRange.
   *
   * @param min - The minimum value in the range.
   * @param max - The maximum value in the range.
   *
   * @return A random number between min and max.
   */
  between = (min: number, max: number): number => {
    return Math.floor(this.realInRange(0, max - min + 1) + min);
  };

  /**
   * Returns a random real number between min and max.
   *
   * @param min - The minimum value in the range.
   * @param max - The maximum value in the range.
   *
   * @return A random number between min and max.
   */
  realInRange = (min: number, max: number): number => {
    return this.frac() * (max - min) + min;
  };

  /**
   * Returns a random real number between -1 and 1.
   *
   * @return A random real number between -1 and 1.
   */
  normal = (): number => {
    return 1 - 2 * this.frac();
  };

  /**
   * Returns a valid RFC4122 version4 ID hex string from https://gist.github.com/1308368
   *
   * @return A valid RFC4122 version4 ID hex string
   */
  uuid = (): string => {
    let a = '' as any;
    let b = '' as any;

    for (
      b = a = '';
      a++ < 36;
      b +=
        ~a % 5 | ((a * 3) & 4)
          ? (a ^ 15 ? 8 ^ (this.frac() * (a ^ 20 ? 16 : 4)) : 4).toString(16)
          : '-'
    ) {
      // empty
    }

    return b;
  };

  /**
   * Returns a random element from within the given array.
   * @param array
   * @returns picked value
   */
  pick = <T>(array: T[]): T => {
    return array[this.integerInRange(0, array.length - 1)] as T;
  };

  /**
   * Returns a sign to be used with multiplication operator.
   *
   * @return -1 or +1.
   */
  sign = (): number => {
    return this.pick(this.signs);
  };

  /**
   * Returns a random element from within the given array, favoring the earlier entries.
   * 주어진 배열에서 무작위 요소를 선택하는 것인데, 이때 배열의 앞 부분에 있는 요소를 더 선호합니다.
   *
   * @param array - The array to pick a random element from.
   *
   * @return A random member of the array.
   */
  weightedPick = <T>(array: T[]): T => {
    return array[~~(Math.pow(this.frac(), 2) * (array.length - 0.5) + 0.5)] as T;
  };

  /**
   * Returns a random timestamp between min and max, or between the beginning of 2000 and the end of 2020 if min and max aren't specified.
   *
   * @param min - The minimum value in the range.
   * @param max - The maximum value in the range.
   *
   * @return A random timestamp between min and max.
   */
  timestamp = (min: number, max: number): number => {
    return this.realInRange(min || 946684800000, max || 1577862000000);
  };

  /**
   * Returns a random angle between -180 and 180.
   *
   * @return A random number between -180 and 180.
   */
  angle = (): number => {
    return this.integerInRange(-180, 180);
  };

  /**
   * Returns a random rotation in radians, between -3.141 and 3.141
   *
   * @return A random number between -3.141 and 3.141
   */
  rotation = (): number => {
    return this.realInRange(-3.1415926, 3.1415926);
  };

  shuffle = <T>(array: T[]): T[] => {
    const len = array.length - 1;

    for (let i = len; i > 0; i--) {
      const randomIndex = Math.floor(this.frac() * (i + 1));
      const itemAtIndex = array[randomIndex]!;

      array[randomIndex] = array[i] as T;
      array[i] = itemAtIndex;
    }

    return array;
  };
}

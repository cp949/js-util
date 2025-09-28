/**
 * Create an integer array
 * Value after decimal point is truncated.
 * arrayOf({from:0, to:2}) =>[0,1,2]
 * arrayOf({from:1, to:2}) =>[1,2]
 * arrayOf({from:5, to:4}) =>[5,4]
 * arrayOf({from:0, count:2}) =>[0,1]
 * arrayOf({from:1, count:2}) =>[1,2]
 * arrayOf({count: 4}) =>[0,1,2,3]
 */
type ItemFn<T> = (item: number, index: number) => T;

type ArrayCreateOption =
  | {
      from?: undefined;
      to?: undefined;
      count: number; // count
      step?: undefined;
    }
  | {
      from: number; // from
      to?: undefined;
      count: number; // count
      step?: number; // step?
    }
  | {
      from: number; // from
      to: number; // to
      step?: number; // step?
      count?: undefined;
    };

function arrayOf(option: ArrayCreateOption): number[];

function arrayOf<T>(option: ArrayCreateOption, createItem: ItemFn<T>): T[];

function arrayOf<T>(option: ArrayCreateOption, createItem?: ItemFn<T>): T[] {
  const arr = [] as T[];
  if (typeof option.from === 'number' && typeof option.to === 'number') {
    const { from, to } = option;
    const count = from <= to ? to - from + 1 : from - to + 1;
    const step = (option.step ?? from <= to) ? 1 : -1;
    if (typeof createItem === 'function') {
      for (let i = 0; i < count; i++) {
        arr.push(createItem(from + i * step, i));
      }
    } else {
      for (let i = 0; i < count; i++) {
        arr.push((from + i * step) as any);
      }
    }
    return arr;
  }

  if (typeof option.count === 'number') {
    const { from = 0, count, step = 1 } = option;
    if (typeof createItem === 'function') {
      for (let i = 0; i < count; i++) {
        arr.push(createItem(from + i * step, i));
      }
    } else {
      for (let i = 0; i < count; i++) {
        arr.push((from + i * step) as any);
      }
    }
    return arr;
  }

  throw new Error('invalid create options:' + JSON.stringify(option));
}

export { arrayOf };

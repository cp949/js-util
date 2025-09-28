import { createTypeGuard } from '../utils.js';

/**
 * Checks if the value is an Event object.
 * 
 * @category Type Guard
 * @example
 *
 * ```typescript
 * function handleEvent(event: unknown) {
 *   if (isEvent(event)) {
 *     // TypeScript knows event is Event
 *     console.log(`Event type: ${event.type}`);
 *     event.preventDefault();
 *   }
 * }
 * ```
 */
export function isEvent(input: unknown): input is Event {
  return createTypeGuard<Event>(
    (value) => 
      typeof Event !== 'undefined' && 
      value instanceof Event
  )(input);
}
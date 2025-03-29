/**
 * Safely executes an asynchronous function with the provided arguments.
 * Avoids the need for a try-catch block at the call site.
 * Returns a tuple: [result, null] on success, [null, Error] on failure.
 *
 * @template T The expected return type of the successful promise resolution.
 * @template A A tuple type representing the arguments expected by the function `fn`.
 * @param fn The asynchronous function (or function returning a Promise) to execute.
 * @param args The arguments to pass to the function `fn`.
 * @returns A Promise resolving to a tuple `[T | null, Error | null]`.
 */
export default async function safeExecute<T, A extends unknown[]>(
    fn: (...args: A) => Promise<T>, // fn takes arguments described by tuple A, returns Promise<T>
    ...args: A                      // The actual arguments matching the tuple type A
): Promise<[T | null, Error | null]> {
    try {
        // Use spread syntax to pass the collected arguments to fn
        const result = await fn(...args);
        return [result, null]; // Success: return result, null error
    } catch (error) {
        // Failure: return null result, Error instance
        return [null, error instanceof Error ? error : new Error(String(error))];
    }
}

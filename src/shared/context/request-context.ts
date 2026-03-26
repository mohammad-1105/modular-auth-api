import { AsyncLocalStorage } from "node:async_hooks";

/**
 * Shape of the per-request context.
 * Can extend this later (userId, correlationId, etc.)
 */
type Store = {
  requestId: string;
};

/**
 * AsyncLocalStorage provides a way to store data
 * that persists across async boundaries (await, promises, callbacks).
 *
 * Think of it as "thread-local storage" but for Node.js async flow.
 */
const asyncLocalStorage = new AsyncLocalStorage<Store>();

export const requestContext = {
  /**
   * Initializes a new async context for a request.
   *
   * WHY:
   * - Each incoming request should have its own isolated context.
   * - This ensures no data leaks between concurrent requests.
   *
   * HOW:
   * - `run()` creates a new context and executes the callback inside it.
   * - All async operations inside this callback will have access to `store`.
   */
  run: (store: Store, callback: () => void) => {
    asyncLocalStorage.run(store, callback);
  },

  /**
   * Retrieves the current request's context.
   *
   * WHY:
   * - Allows any layer (service, repository, logger) to access request-scoped data
   *   WITHOUT passing it through function arguments.
   *
   * IMPORTANT:
   * - Returns `undefined` if called outside of a request context.
   */
  get: () => {
    return asyncLocalStorage.getStore();
  },

  /**
   * Convenience method to directly get requestId.
   *
   * WHY:
   * - requestId is commonly used for logging, tracing, debugging.
   * - Avoids repeating `get()?.requestId` everywhere.
   */
  getRequestId: () => {
    return asyncLocalStorage.getStore()?.requestId;
  },
};

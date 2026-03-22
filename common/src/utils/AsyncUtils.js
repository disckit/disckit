/**
 * AsyncUtils — Async helper functions for Enerthya.
 * Includes sleep, retry, and timeout wrappers.
 */

/**
 * Wait for a given number of milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Run an async function with a timeout. Rejects if it takes longer than the limit.
 * @param {Promise<any>} promise
 * @param {number} ms - Timeout in milliseconds
 * @param {string} [message="Operation timed out"]
 * @returns {Promise<any>}
 */
function withTimeout(promise, ms, message = "Operation timed out") {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(message)), ms)
  );
  return Promise.race([promise, timeout]);
}

/**
 * Retry an async function up to N times with a delay between attempts.
 * @param {Function} fn - Async function to retry
 * @param {number} [times=3] - Max attempts
 * @param {number} [delayMs=500] - Delay between retries
 * @returns {Promise<any>}
 */
async function retry(fn, times = 3, delayMs = 500) {
  let lastError;
  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < times - 1) await sleep(delayMs);
    }
  }
  throw lastError;
}

/**
 * Run async functions in batches to avoid overwhelming external APIs.
 * @param {any[]} items
 * @param {number} batchSize
 * @param {Function} fn - Async function receiving each item
 * @returns {Promise<any[]>}
 */
async function batchProcess(items, batchSize, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

module.exports = {
  sleep,
  withTimeout,
  retry,
  batchProcess,
};

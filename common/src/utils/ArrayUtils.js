/**
 * ArrayUtils — Array helper functions.
 * 
 */

/**
 * Split an array into chunks of a given size.
 * @param {any[]} array
 * @param {number} size
 * @returns {any[][]}
 */
function chunk(array, size) {
  if (!Array.isArray(array)) return [];
  if (size <= 0) return [];
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * Return a random element from an array.
 * @param {any[]} array
 * @returns {any}
 */
function randomPick(array) {
  if (!Array.isArray(array) || array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle an array in place using Fisher-Yates algorithm.
 * Returns the same array (mutated).
 * @param {any[]} array
 * @returns {any[]}
 */
function shuffle(array) {
  if (!Array.isArray(array)) return [];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Return a new array with duplicate values removed.
 * @param {any[]} array
 * @returns {any[]}
 */
function deduplicate(array) {
  if (!Array.isArray(array)) return [];
  return [...new Set(array)];
}

/**
 * Flatten an array one level deep.
 * @param {any[][]} array
 * @returns {any[]}
 */
function flatten(array) {
  if (!Array.isArray(array)) return [];
  return array.reduce((acc, val) => acc.concat(val), []);
}

/**
 * Split an array into two groups: those that pass a predicate and those that don't.
 * @param {any[]} array
 * @param {Function} predicate
 * @returns {[any[], any[]]} [passing, failing]
 */
function partition(array, predicate) {
  if (!Array.isArray(array)) return [[], []];
  const pass = [];
  const fail = [];
  for (const item of array) {
    (predicate(item) ? pass : fail).push(item);
  }
  return [pass, fail];
}

/**
 * Return the last element of an array.
 * @param {any[]} array
 * @returns {any}
 */
function last(array) {
  if (!Array.isArray(array) || array.length === 0) return undefined;
  return array[array.length - 1];
}

module.exports = {
  chunk,
  randomPick,
  shuffle,
  deduplicate,
  flatten,
  partition,
  last,
};

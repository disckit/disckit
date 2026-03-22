/**
 * RandomUtils — Random number and value generators.
 * 
 */

/**
 * Return a random integer between 0 (inclusive) and max (exclusive).
 * @param {number} max
 * @returns {number}
 */
function randomInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Return a random integer between min (inclusive) and max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Return a random float between 0 (inclusive) and 1 (exclusive).
 * @returns {number}
 */
function randomFloat() {
  return Math.random();
}

/**
 * Return true with a given probability (0 to 1).
 * Example: chance(0.3) returns true ~30% of the time.
 * @param {number} probability
 * @returns {boolean}
 */
function chance(probability) {
  return Math.random() < probability;
}

/**
 * Return a random element from an array.
 * Alias for ArrayUtils.randomPick — included here for convenience.
 * @param {any[]} array
 * @returns {any}
 */
function randomFrom(array) {
  if (!Array.isArray(array) || array.length === 0) return undefined;
  return array[randomInt(array.length)];
}

module.exports = {
  randomInt,
  randomIntBetween,
  randomFloat,
  chance,
  randomFrom,
};

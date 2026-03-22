"use strict";

/**
 * Returns a compact array of page numbers for rendering a page range UI.
 * Large gaps between pages are represented with `null` (ellipsis slots).
 *
 * @param {number} current     Current 1-indexed page.
 * @param {number} total       Total number of pages.
 * @param {object} [options]
 * @param {number} [options.siblings=1]  Pages shown on each side of current.
 * @param {number} [options.boundary=1]  Pages always shown at start and end.
 * @returns {(number|null)[]}
 *
 * @example
 * pages(5, 10);
 * // → [1, null, 4, 5, 6, null, 10]
 *
 * pages(1, 5);
 * // → [1, 2, 3, 4, 5]
 *
 * pages(3, 10, { siblings: 2, boundary: 2 });
 * // → [1, 2, 3, 4, 5, null, 9, 10]
 */
function pages(current, total, options = {}) {
  if (total <= 0) return [];
  if (total === 1) return [1];

  const siblings = Math.max(0, options.siblings ?? 1);
  const boundary = Math.max(0, options.boundary ?? 1);

  const set = new Set();

  // Boundary pages at start
  for (let i = 1; i <= Math.min(boundary, total); i++) set.add(i);
  // Boundary pages at end
  for (let i = Math.max(total - boundary + 1, 1); i <= total; i++) set.add(i);
  // Sibling pages around current
  for (let i = Math.max(1, current - siblings); i <= Math.min(total, current + siblings); i++) set.add(i);

  const sorted = [...set].sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push(null); // ellipsis
    result.push(sorted[i]);
  }

  return result;
}

module.exports = { pages };

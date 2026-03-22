/**
 * Slices an array for the given page and returns full pagination metadata.
 *
 * @param {Array}   items
 * @param {object}  [options]
 * @param {number}  [options.page=1]    1-indexed page number
 * @param {number}  [options.limit=10]  Items per page
 * @returns {PaginateResult}
 *
 * @typedef {object} PaginateResult
 * @property {Array}   items
 * @property {number}  page
 * @property {number}  limit
 * @property {number}  total
 * @property {number}  totalPages
 * @property {boolean} hasPrev
 * @property {boolean} hasNext
 * @property {number}  from   1-indexed position of first item on this page
 * @property {number}  to     1-indexed position of last item on this page
 */
function paginate(items, options = {}) {
  const total      = items.length;
  const limit      = Math.max(1, options.limit ?? 10);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const page       = Math.min(Math.max(1, options.page ?? 1), totalPages);
  const from       = (page - 1) * limit;
  const to         = Math.min(from + limit, total);

  return {
    items:       items.slice(from, to),
    page,
    limit,
    total,
    totalPages,
    hasPrev:     page > 1,
    hasNext:     page < totalPages,
    isEmpty:     total === 0,
    isFirstPage: page === 1,
    isLastPage:  page === totalPages,
    from:        total === 0 ? 0 : from + 1,
    to,
  };
}

module.exports = { paginate };

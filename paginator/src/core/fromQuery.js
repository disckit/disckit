/**
 * Converts REST query string params to skip/limit values + metadata.
 * Useful for REST API routes backed by any database.
 *
 * @param {object}  query
 * @param {string|number} [query.page]
 * @param {string|number} [query.limit]
 * @param {object}  options
 * @param {number}  options.total           Total document count (e.g. from db.count())
 * @param {number}  [options.defaultLimit=20]
 * @param {number}  [options.maxLimit=100]   Cap on limit to prevent abuse
 * @returns {{ skip: number, limit: number, page: number, meta: object }}
 *
 * @example
 *   // GET /users?page=2&limit=20
 *   const { skip, limit, meta } = fromQuery(req.query, { total: 200 });
 *   const users = await db.users.find({}).skip(skip).limit(limit);
 *   res.json({ users, meta });
 */
function fromQuery(query = {}, options = {}) {
  const { total = 0, defaultLimit = 20, maxLimit = 100 } = options;

  const limit      = Math.min(Math.max(1, parseInt(query.limit ?? defaultLimit, 10) || defaultLimit), maxLimit);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const page       = Math.min(Math.max(1, parseInt(query.page ?? 1, 10) || 1), totalPages);
  const skip       = (page - 1) * limit;

  return {
    skip,
    limit,
    page,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasPrev: page > 1,
      hasNext: page < totalPages,
      from:    total === 0 ? 0 : skip + 1,
      to:      Math.min(skip + limit, total),
    },
  };
}

module.exports = { fromQuery };

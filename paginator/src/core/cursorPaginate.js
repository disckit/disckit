"use strict";

/**
 * Cursor-based pagination for arrays.
 *
 * Unlike offset pagination, cursor pagination is stable even when items are
 * added or removed between requests. Ideal for infinite scroll, real-time feeds
 * and any dataset that changes frequently.
 *
 * The cursor encodes the position of the last seen item (opaque base64 string).
 *
 * @param {any[]} items      Full sorted array of items.
 * @param {object} [options]
 * @param {string} [options.cursor]   Cursor from the previous response. Omit for the first page.
 * @param {number} [options.limit=10] Items per page.
 * @param {string} [options.key="id"] Property name used as the unique cursor anchor.
 * @returns {CursorPaginateResult}
 *
 * @typedef {object} CursorPaginateResult
 * @property {any[]}         items
 * @property {string|null}   nextCursor   Pass this as `cursor` in the next request. null = last page.
 * @property {string|null}   prevCursor   Pass this as `cursor` to go back. null = first page.
 * @property {boolean}       hasNext
 * @property {boolean}       hasPrev
 * @property {number}        limit
 *
 * @example
 * // First page
 * const page1 = cursorPaginate(items, { limit: 10 });
 * // page1.items     → first 10 items
 * // page1.nextCursor → "eyJpZCI6MTB9"
 *
 * // Next page
 * const page2 = cursorPaginate(items, { cursor: page1.nextCursor, limit: 10 });
 */
function cursorPaginate(items, options = {}) {
  if (!Array.isArray(items)) throw new TypeError("items must be an array");

  const limit  = Math.max(1, options.limit ?? 10);
  const key    = options.key ?? "id";
  const cursor = options.cursor ?? null;

  let startIndex = 0;

  if (cursor) {
    try {
      const decoded = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
      const anchorValue = decoded[key];
      const found = items.findIndex(item =>
        String(item?.[key] ?? item) === String(anchorValue)
      );
      if (found !== -1) startIndex = found + 1;
    } catch {
      // invalid cursor — start from beginning
    }
  }

  const slice    = items.slice(startIndex, startIndex + limit);
  const hasNext  = startIndex + limit < items.length;
  const hasPrev  = startIndex > 0;

  const lastItem = slice[slice.length - 1];
  const nextCursor = hasNext && lastItem != null
    ? Buffer.from(JSON.stringify({ [key]: lastItem?.[key] ?? lastItem })).toString("base64url")
    : null;

  const firstItem = items[startIndex - 1];
  const prevCursor = hasPrev && firstItem != null
    ? Buffer.from(JSON.stringify({ [key]: firstItem?.[key] ?? firstItem })).toString("base64url")
    : null;

  return { items: slice, nextCursor, prevCursor, hasNext, hasPrev, limit };
}

module.exports = { cursorPaginate };

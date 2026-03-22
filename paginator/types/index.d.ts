// Supports both CJS and ESM:
//   const { X } = require("@disckit/paginator");   // CommonJS
//   import { X } from "@disckit/paginator";         // ESM (Node >=18, bundlers)
//
// @disckit/paginator — TypeScript definitions

// ── paginate() ────────────────────────────────────────────────────────────────

export interface PaginateOptions {
  /** 1-indexed page number. Default: 1. */
  page?: number;
  /** Items per page. Default: 10. */
  limit?: number;
}

export interface PaginateResult<T = unknown> {
  /** Items for the current page. */
  items: T[];
  /** Current 1-indexed page number. */
  page: number;
  /** Items per page. */
  limit: number;
  /** Total item count. */
  total: number;
  /** Total number of pages. */
  totalPages: number;
  /** Whether a previous page exists. */
  hasPrev: boolean;
  /** Whether a next page exists. */
  hasNext: boolean;
  /** 1-indexed position of the first item on this page (0 when total is 0). */
  from: number;
  /** 1-indexed position of the last item on this page. */
  to: number;
}

/**
 * Slices an array for the given page and returns full pagination metadata.
 *
 * @example
 * const result = paginate(users, { page: 2, limit: 10 });
 * result.items;      // users 11-20
 * result.totalPages; // 5
 * result.hasNext;    // true
 */
export function paginate<T>(items: T[], options?: PaginateOptions): PaginateResult<T>;

// ── fromQuery() ───────────────────────────────────────────────────────────────

export interface FromQueryOptions {
  /** Total document count (e.g. from db.count()). */
  total: number;
  /** Default items per page when query.limit is absent. Default: 20. */
  defaultLimit?: number;
  /** Hard cap on limit to prevent abuse. Default: 100. */
  maxLimit?: number;
}

export interface FromQueryResult {
  skip: number;
  limit: number;
  page: number;
  meta: Omit<PaginateResult, "items">;
}

/**
 * Converts REST query string params to skip/limit values + metadata.
 *
 * @example
 * // GET /users?page=2&limit=20
 * const { skip, limit, meta } = fromQuery(req.query, { total: 200 });
 * const users = await db.users.find({}).skip(skip).limit(limit);
 */
export function fromQuery(
  query: Record<string, string | number | undefined>,
  options: FromQueryOptions,
): FromQueryResult;

// ── cursorPaginate() ──────────────────────────────────────────────────────────

export interface CursorPaginateOptions {
  /** Cursor from the previous response. Omit for the first page. */
  cursor?: string | null;
  /** Items per page. Default: 10. */
  limit?: number;
  /** Property name used as the unique cursor anchor. Default: "id". */
  key?: string;
}

export interface CursorPaginateResult<T = unknown> {
  /** Items for the current page. */
  items: T[];
  /** Pass as `cursor` in the next request. null = last page. */
  nextCursor: string | null;
  /** Pass as `cursor` to go back. null = first page. */
  prevCursor: string | null;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
}

/**
 * Cursor-based pagination for arrays.
 * Stable even when items are added/removed between requests.
 * Ideal for infinite scroll, real-time feeds and frequently-changing datasets.
 *
 * @example
 * const page1 = cursorPaginate(items, { limit: 10 });
 * const page2 = cursorPaginate(items, { cursor: page1.nextCursor, limit: 10 });
 */
export function cursorPaginate<T>(items: T[], options?: CursorPaginateOptions): CursorPaginateResult<T>;

// ── pages() ───────────────────────────────────────────────────────────────────

export interface PagesOptions {
  /** Pages shown on each side of current. Default: 1. */
  siblings?: number;
  /** Pages always shown at start and end. Default: 1. */
  boundary?: number;
}

/**
 * Returns a compact array of page numbers for rendering a page range UI.
 * Gaps between pages are represented with `null` (render as "..." ellipsis).
 *
 * @example
 * pages(5, 10);             // → [1, null, 4, 5, 6, null, 10]
 * pages(1, 5);              // → [1, 2, 3, 4, 5]
 * pages(3, 10, { siblings: 2, boundary: 2 }); // → [1, 2, 3, 4, 5, null, 9, 10]
 */
export function pages(current: number, total: number, options?: PagesOptions): (number | null)[];

// ── Paginator ─────────────────────────────────────────────────────────────────

export interface PaginatorOptions {
  /** Total item count. */
  total: number;
  /** Items per page. Default: 10. */
  limit?: number;
  /** Initial page. Default: 1. */
  page?: number;
}

export interface ButtonLabels {
  prev?: string;
  next?: string;
  label?: string;
}

export interface ButtonState {
  disabled: boolean;
  label: string;
}

export interface ButtonsResult {
  prev: ButtonState;
  next: ButtonState;
  label: string;
}

export interface SelectMenuOptions {
  customId?: string;
  labelPrefix?: string;
  maxOptions?: number;
}

export interface SelectMenuResult {
  customId: string;
  placeholder: string;
  options: Array<{ label: string; value: string; default: boolean }>;
}

/**
 * Stateful paginator. Tracks current page and provides Discord button state,
 * select menu options, page range arrays and progress tracking.
 *
 * @example
 * const p = new Paginator({ total: 50, limit: 10 });
 * p.next();
 * p.buttons(); // { prev: { disabled: false, label: "◀" }, next: ..., label: "Page 2 / 5" }
 * p.slice(allItems); // items for current page
 * p.pages();   // [1, 2, 3, 4, 5]
 */
export class Paginator {
  constructor(options: PaginatorOptions);

  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
  readonly hasPrev: boolean;
  readonly hasNext: boolean;
  /** True when the total item count is zero. */
  readonly isEmpty: boolean;
  /** True when on the first page. */
  readonly isFirst: boolean;
  /** True when on the last page. */
  readonly isLast: boolean;
  /** 0-indexed offset for the current page. Useful for array slicing. */
  readonly offset: number;

  /** Advance to the next page. No-op if already on the last page. */
  next(): this;
  /** Go back to the previous page. No-op if already on the first page. */
  prev(): this;
  /** Jump to a specific page. Clamped to [1, totalPages]. */
  goTo(page: number): this;
  /** Jump to the first page. */
  first(): this;
  /** Jump to the last page. */
  last(): this;

  /** Returns Discord-ready button state for prev/next navigation. */
  buttons(labels?: ButtonLabels): ButtonsResult;

  /**
   * Returns a Discord-ready select menu descriptor for page navigation.
   * Windowed to maxOptions pages centered around the current page.
   */
  selectMenu(options?: SelectMenuOptions): SelectMenuResult;

  /** Slices an array for the current page. */
  slice<T>(items: T[]): T[];

  /**
   * Returns a compact array of page numbers for rendering a page range UI.
   * Gaps are represented with `null` (render as "..." ellipsis).
   */
  pages(options?: PagesOptions): (number | null)[];

  /**
   * Returns the percentage progress through the total pages (0–100).
   * Useful for progress bars.
   */
  progress(): number;

  toJSON(): {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
    isEmpty: boolean;
    offset: number;
  };
}

// ── PaginatorStore ────────────────────────────────────────────────────────────

export interface PaginatorStoreOptions {
  /** Auto-delete entries after this many ms. 0 = disabled. Default: 300_000 (5 min). */
  ttlMs?: number;
  /** Max concurrent paginators. LRU eviction when full. Default: 500. */
  maxSize?: number;
  /** How often to sweep expired entries in ms. 0 = disabled. Default: 60_000. */
  sweepEveryMs?: number;
}

/**
 * Manages multiple Paginator instances keyed by any string ID.
 * Auto-expires idle paginators to prevent memory leaks in long-running bots.
 *
 * @example
 * const store = new PaginatorStore({ ttlMs: 5 * 60 * 1000 });
 *
 * // Create or resume a paginator for this user
 * const pager = store.getOrCreate(userId, { total: items.length, limit: 10 });
 *
 * // On button click — returns null if session expired
 * const pager = store.get(userId);
 * if (!pager) return interaction.reply({ content: "Session expired.", ephemeral: true });
 * pager.next();
 */
export class PaginatorStore {
  constructor(options?: PaginatorStoreOptions);

  /** Current number of tracked paginators. */
  readonly size: number;

  /**
   * Returns an existing Paginator for key, or creates a new one.
   * Updates the access time on hit.
   */
  getOrCreate(key: string, paginatorOptions: PaginatorOptions): Paginator;

  /**
   * Returns an existing Paginator, or null if not found or expired.
   * Updates the access time on hit.
   */
  get(key: string): Paginator | null;

  /** Manually removes a paginator from the store. */
  delete(key: string): boolean;

  /** Removes all entries. */
  clear(): void;

  /** Stop the sweep timer and clear all entries. */
  destroy(): void;
}

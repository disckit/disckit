// @disckit/paginator — TypeScript definitions

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

export interface PaginatorOptions {
  /** Total item count. */
  total: number;
  /** Items per page. Default: 10. */
  limit?: number;
  /** Initial page. Default: 1. */
  page?: number;
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
export function paginate<T>(items: T[], options?: { page?: number; limit?: number }): PaginateResult<T>;

/**
 * Converts REST query string params to skip/limit values + metadata.
 *
 * @example
 * // GET /users?page=2&limit=20
 * const { skip, limit, meta } = fromQuery(req.query, { total: 200 });
 * const users = await db.users.find({}).skip(skip).limit(limit);
 */
export function fromQuery(query: Record<string, string | number | undefined>, options: FromQueryOptions): FromQueryResult;

/**
 * Stateful paginator. Tracks current page and provides Discord button state.
 *
 * @example
 * const p = new Paginator({ total: 50, limit: 10 });
 * p.next();
 * p.buttons(); // { prev: { disabled: false, label: "◀" }, next: ..., label: "Page 2 / 5" }
 * p.slice(allItems); // items for current page
 */
export class Paginator {
  constructor(options: PaginatorOptions);

  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
  readonly hasPrev: boolean;
  readonly hasNext: boolean;
  /** 0-indexed offset for the current page. */
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
  /** Slices an array for the current page. */
  slice<T>(items: T[]): T[];

  toJSON(): {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
    offset: number;
  };
}

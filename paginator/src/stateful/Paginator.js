"use strict";

/**
 * Stateful paginator. Tracks current page and provides Discord button/menu state.
 *
 * @example
 * const p = new Paginator({ total: 50, limit: 10 });
 * p.next();
 * p.buttons(); // → { prev: { disabled: false }, next: ..., label: "Page 2 / 5" }
 * p.slice(allItems); // items for current page
 */
class Paginator {
  /**
   * @param {object} options
   * @param {number} options.total       Total item count (>= 0).
   * @param {number} [options.limit=10]  Items per page.
   * @param {number} [options.page=1]    Initial page.
   */
  constructor(options = {}) {
    if (typeof options.total !== "number" || options.total < 0) {
      throw new TypeError("Paginator: total must be a non-negative number");
    }
    this._limit      = Math.max(1, options.limit ?? 10);
    this._total      = options.total;
    this._totalPages = Math.max(1, Math.ceil(this._total / this._limit));
    this._page       = Math.min(Math.max(1, options.page ?? 1), this._totalPages);
    this._listeners  = [];
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  /** Advance to the next page. No-op if already on the last page. */
  next() {
    if (this._page < this._totalPages) { this._page++; this._emit(); }
    return this;
  }

  /** Go back to the previous page. No-op if already on the first page. */
  prev() {
    if (this._page > 1) { this._page--; this._emit(); }
    return this;
  }

  /** Jump to a specific page. Clamped to [1, totalPages]. */
  goTo(page) {
    const next = Math.min(Math.max(1, page), this._totalPages);
    if (next !== this._page) { this._page = next; this._emit(); }
    return this;
  }

  /** Jump to page 1. */
  first() { return this.goTo(1); }

  /** Jump to the last page. */
  last() { return this.goTo(this._totalPages); }

  /** Reset to page 1 (alias for first()). */
  reset() { return this.first(); }

  // ── Getters ────────────────────────────────────────────────────────────────

  get page()        { return this._page; }
  get limit()       { return this._limit; }
  get total()       { return this._total; }
  get totalPages()  { return this._totalPages; }
  get hasPrev()     { return this._page > 1; }
  get hasNext()     { return this._page < this._totalPages; }
  get isEmpty()     { return this._total === 0; }
  get isFirstPage() { return this._page === 1; }
  get isLastPage()  { return this._page === this._totalPages; }

  /** 0-indexed offset for array slicing. */
  get offset() { return (this._page - 1) * this._limit; }

  // ── Helpers ────────────────────────────────────────────────────────────────

  /**
   * Returns Discord-ready button state for prev/next navigation.
   * @param {object} [labels]
   * @param {string} [labels.prev="◀"]
   * @param {string} [labels.next="▶"]
   * @param {string} [labels.label]  Override label (default: "Page N / T")
   * @returns {{ prev: { disabled: boolean, label: string }, next: { disabled: boolean, label: string }, label: string }}
   */
  buttons(labels = {}) {
    return {
      prev:  { disabled: !this.hasPrev, label: labels.prev ?? "◀" },
      next:  { disabled: !this.hasNext, label: labels.next ?? "▶" },
      label: labels.label ?? `Page ${this._page} / ${this._totalPages}`,
    };
  }

  /**
   * Returns an array of page numbers for rendering a windowed page-number bar.
   * The current page is always included; surrounding pages fill up to `size`.
   *
   * @param {number} [size=5]  How many page numbers to show (max).
   * @returns {number[]}       e.g. [1, 2, 3, 4, 5] or [8, 9, 10, 11, 12]
   *
   * @example
   * // With totalPages=20, page=10, size=5 → [8, 9, 10, 11, 12]
   * const pages = pager.window(5);
   * // Render as buttons: pages.map(p => ButtonBuilder...setLabel(String(p)))
   */
  window(size = 5) {
    const half  = Math.floor(size / 2);
    let start   = Math.max(1, this._page - half);
    let end     = start + size - 1;

    if (end > this._totalPages) {
      end   = this._totalPages;
      start = Math.max(1, end - size + 1);
    }

    const result = [];
    for (let i = start; i <= end; i++) result.push(i);
    return result;
  }

  /**
   * Returns a Discord-ready select menu options array for page navigation.
   * Windowed to max 25 options around the current page.
   *
   * @param {object}  [options]
   * @param {string}  [options.customId="page-select"]
   * @param {string}  [options.labelPrefix="Page"]
   * @param {number}  [options.maxOptions=25]
   * @returns {{ customId: string, placeholder: string, options: Array<{ label: string, value: string, default: boolean }> }}
   */
  selectMenu(options = {}) {
    const customId    = options.customId    ?? "page-select";
    const labelPrefix = options.labelPrefix ?? "Page";
    const maxOptions  = Math.min(options.maxOptions ?? 25, 25);

    const pages = this._totalPages <= maxOptions
      ? Array.from({ length: this._totalPages }, (_, i) => i + 1)
      : this.window(maxOptions);

    return {
      customId,
      placeholder: `${labelPrefix} ${this._page} / ${this._totalPages}`,
      options: pages.map(p => ({
        label:   `${labelPrefix} ${p}`,
        value:   String(p),
        default: p === this._page,
      })),
    };
  }

  /**
   * Slices an array for the current page.
   * @template T
   * @param {T[]} items
   * @returns {T[]}
   */
  slice(items) {
    return items.slice(this.offset, this.offset + this._limit);
  }

  /**
   * Creates an independent copy of this Paginator with the same state.
   * @returns {Paginator}
   */
  clone() {
    return new Paginator({
      total: this._total,
      limit: this._limit,
      page:  this._page,
    });
  }

  /**
   * Registers a listener called whenever the current page changes.
   * @param {(page: number, paginator: Paginator) => void} fn
   * @returns {() => void} Unsubscribe function
   *
   * @example
   * const unsub = pager.onChange((page) => console.log('page changed to', page));
   * // Later:
   * unsub();
   */
  onChange(fn) {
    if (typeof fn !== "function") throw new TypeError("onChange: fn must be a function");
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter(l => l !== fn); };
  }

  /**
   * Returns a plain serializable snapshot of the current state.
   * @returns {object}
   */

  /**
   * Returns a compact array of page numbers for rendering a page range UI.
   * Gaps between pages are represented with `null` (render as ellipsis "...").
   *
   * @param {object} [options]
   * @param {number} [options.siblings=1]  Pages shown on each side of current.
   * @param {number} [options.boundary=1]  Pages always shown at start and end.
   * @returns {(number|null)[]}
   *
   * @example
   * const p = new Paginator({ total: 100, limit: 10 });
   * p.goTo(5);
   * p.pages(); // → [1, null, 4, 5, 6, null, 10]
   *
   * // In a dashboard component:
   * p.pages().map(n => n === null ? <Ellipsis /> : <PageButton page={n} active={n === p.page} />)
   */
  pages(options = {}) {
    const { pages } = require("../core/pages");
    return pages(this._page, this._totalPages, options);
  }

  /**
   * Returns the percentage progress through the total pages (0–100).
   * Useful for progress bars.
   *
   * @returns {number} 0–100
   *
   * @example
   * new Paginator({ total: 100, limit: 10 }).goTo(5).progress(); // → 50
   */
  progress() {
    if (this._totalPages <= 1) return 100;
    return Math.round(((this._page - 1) / (this._totalPages - 1)) * 100);
  }

  /**
   * Returns whether the paginator is currently on the first page.
   * @returns {boolean}
   */
  get isFirst() { return this._page === 1; }

  /**
   * Returns whether the paginator is currently on the last page.
   * @returns {boolean}
   */
  get isLast() { return this._page === this._totalPages; }

  toJSON() {
    return {
      page:        this._page,
      limit:       this._limit,
      total:       this._total,
      totalPages:  this._totalPages,
      hasPrev:     this.hasPrev,
      hasNext:     this.hasNext,
      isEmpty:     this.isEmpty,
      isFirstPage: this.isFirstPage,
      isLastPage:  this.isLastPage,
      offset:      this.offset,
    };
  }

  // ── Static factories ───────────────────────────────────────────────────────

  /**
   * Creates a Paginator directly from an array (no need to pass total manually).
   * @template T
   * @param {T[]} items
   * @param {object} [options]
   * @param {number} [options.limit=10]
   * @param {number} [options.page=1]
   * @returns {{ paginator: Paginator, items: T[] }} Paginator + current page items
   *
   * @example
   * const { paginator, items } = Paginator.fromArray(allUsers, { limit: 10 });
   * // items = first page of users
   */
  static fromArray(items, options = {}) {
    if (!Array.isArray(items)) throw new TypeError("Paginator.fromArray: items must be an array");
    const paginator = new Paginator({ total: items.length, ...options });
    return { paginator, items: paginator.slice(items) };
  }

  /**
   * Restores a Paginator from a plain object (e.g. from toJSON() or stored state).
   * @param {{ total: number, limit?: number, page?: number }} data
   * @returns {Paginator}
   */
  static fromJSON(data) {
    if (!data || typeof data !== "object") throw new TypeError("Paginator.fromJSON: data must be an object");
    return new Paginator({ total: data.total, limit: data.limit, page: data.page });
  }

  // ── Private ────────────────────────────────────────────────────────────────

  _emit() {
    for (const fn of this._listeners) {
      try { fn(this._page, this); } catch {}
    }
  }
}

module.exports = { Paginator };

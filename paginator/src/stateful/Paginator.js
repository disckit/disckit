/**
 * Stateful paginator. Tracks current page and provides Discord button state.
 *
 * @example
 *   const p = new Paginator({ total: 50, limit: 10 });
 *   p.next();
 *   p.buttons(); // → { prev: { disabled: false }, next: { disabled: false }, label: "Page 2 / 5" }
 *   p.slice(allItems); // → items for the current page
 */
class Paginator {
  /**
   * @param {object} options
   * @param {number} options.total       Total item count.
   * @param {number} [options.limit=10]  Items per page.
   * @param {number} [options.page=1]    Initial page.
   */
  constructor(options = {}) {
    if (typeof options.total !== "number" || options.total < 0) {
      throw new TypeError("total must be a non-negative number");
    }
    this._limit      = Math.max(1, options.limit ?? 10);
    this._total      = options.total;
    this._totalPages = Math.max(1, Math.ceil(this._total / this._limit));
    this._page       = Math.min(Math.max(1, options.page ?? 1), this._totalPages);
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  /** Advance to the next page. No-op if already on the last page. */
  next()     { if (this._page < this._totalPages) this._page++; return this; }

  /** Go back to the previous page. No-op if already on the first page. */
  prev()     { if (this._page > 1) this._page--; return this; }

  /** Jump to a specific page. Clamped to [1, totalPages]. */
  goTo(page) { this._page = Math.min(Math.max(1, page), this._totalPages); return this; }

  /** Jump to the first page. */
  first()    { return this.goTo(1); }

  /** Jump to the last page. */
  last()     { return this.goTo(this._totalPages); }

  // ── Getters ────────────────────────────────────────────────────────────────

  get page()       { return this._page; }
  get limit()      { return this._limit; }
  get total()      { return this._total; }
  get totalPages() { return this._totalPages; }
  get hasPrev()    { return this._page > 1; }
  get hasNext()    { return this._page < this._totalPages; }

  /** True when the total item count is zero. */
  get isEmpty()    { return this._total === 0; }

  /** 0-indexed offset for the current page. Useful for array slicing. */
  get offset()     { return (this._page - 1) * this._limit; }

  // ── Helpers ────────────────────────────────────────────────────────────────

  /**
   * Returns Discord-ready button state for prev/next navigation.
   * @param {object} [labels]
   * @param {string} [labels.prev="◀"]
   * @param {string} [labels.next="▶"]
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
   * Returns a Discord-ready select menu options array for page navigation.
   * Each option represents one page. The current page is pre-selected.
   *
   * @param {object}  [options]
   * @param {string}  [options.customId="page-select"]   customId for the select menu component.
   * @param {string}  [options.labelPrefix="Page"]       Prefix for each option label.
   * @param {number}  [options.maxOptions=25]            Max options (Discord cap is 25).
   * @returns {{ customId: string, placeholder: string, options: Array<{ label: string, value: string, default: boolean }> }}
   *
   * @example
   * const menu = paginator.selectMenu({ customId: "help-select" });
   * // Use menu.options directly in a StringSelectMenuBuilder
   */
  selectMenu(options = {}) {
    const customId    = options.customId    ?? "page-select";
    const labelPrefix = options.labelPrefix ?? "Page";
    const maxOptions  = Math.min(options.maxOptions ?? 25, 25);

    // If there are more pages than maxOptions, create a windowed subset
    // centered around the current page so the menu stays manageable.
    let pages;
    if (this._totalPages <= maxOptions) {
      pages = Array.from({ length: this._totalPages }, (_, i) => i + 1);
    } else {
      const half  = Math.floor(maxOptions / 2);
      let start   = Math.max(1, this._page - half);
      let end     = start + maxOptions - 1;
      if (end > this._totalPages) { end = this._totalPages; start = Math.max(1, end - maxOptions + 1); }
      pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

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
   * @param {Array} items
   * @returns {Array}
   */
  slice(items) {
    return items.slice(this.offset, this.offset + this._limit);
  }

  toJSON() {
    return {
      page:       this._page,
      limit:      this._limit,
      total:      this._total,
      totalPages: this._totalPages,
      hasPrev:    this.hasPrev,
      hasNext:    this.hasNext,
      isEmpty:    this.isEmpty,
      offset:     this.offset,
    };
  }
}

module.exports = { Paginator };

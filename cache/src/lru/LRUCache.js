/**
 * LRUCache — doubly-linked-list + Map implementation.
 * O(1) get, set, delete. Zero external dependencies.
 *
 * @template K, V
 */

class LRUCache {
    /**
     * @param {number} maxSize Maximum number of entries (>= 1).
     */
    constructor(maxSize) {
        if (!Number.isInteger(maxSize) || maxSize < 1) {
            throw new TypeError("LRUCache: maxSize must be a positive integer");
        }

        /** @type {number} */
        this.maxSize = maxSize;

        /** @type {Map<K, { key: K, value: V, prev: object|null, next: object|null }>} */
        this._map = new Map();

        // Sentinel head (oldest) and tail (newest)
        this._head = { key: null, value: null, prev: null, next: null };
        this._tail = { key: null, value: null, prev: null, next: null };
        this._head.next = this._tail;
        this._tail.prev = this._head;

        /** @type {number} */
        this.size = 0;
    }

    /**
     * Returns the value for key, or undefined if not found.
     * Moves the entry to MRU position.
     *
     * @param {K} key
     * @returns {V|undefined}
     */
    get(key) {
        const node = this._map.get(key);
        if (!node) return undefined;

        this._moveToTail(node);
        return node.value;
    }

    /**
     * Returns the value without updating recency.
     *
     * @param {K} key
     * @returns {V|undefined}
     */
    peek(key) {
        const node = this._map.get(key);
        return node ? node.value : undefined;
    }

    /**
     * Returns true if the key exists in the cache.
     *
     * @param {K} key
     * @returns {boolean}
     */
    has(key) {
        return this._map.has(key);
    }

    /**
     * Sets a value. Evicts the LRU entry when at capacity.
     *
     * @param {K} key
     * @param {V} value
     */
    set(key, value) {
        let node = this._map.get(key);

        if (node) {
            node.value = value;
            this._moveToTail(node);
            return;
        }

        // Evict LRU when full
        if (this.size >= this.maxSize) {
            const lru = this._head.next;
            this._unlink(lru);
            this._map.delete(lru.key);
            this.size--;
        }

        node = { key, value, prev: null, next: null };
        this._map.set(key, node);
        this._linkBeforeTail(node);
        this.size++;
    }

    /**
     * Deletes a key from the cache.
     *
     * @param {K} key
     * @returns {boolean} true if the key existed
     */
    delete(key) {
        const node = this._map.get(key);
        if (!node) return false;

        this._unlink(node);
        this._map.delete(key);
        this.size--;
        return true;
    }

    /**
     * Removes all entries.
     */
    clear() {
        this._map.clear();
        this._head.next = this._tail;
        this._tail.prev = this._head;
        this.size = 0;
    }

    /**
     * Iterates over [key, value] pairs from LRU → MRU.
     *
     * @returns {IterableIterator<[K, V]>}
     */
    *entries() {
        let node = this._head.next;
        while (node !== this._tail) {
            yield [node.key, node.value];
            node = node.next;
        }
    }

    /**
     * Returns all keys from LRU → MRU.
     *
     * @returns {K[]}
     */
    keys() {
        const result = [];
        let node = this._head.next;
        while (node !== this._tail) {
            result.push(node.key);
            node = node.next;
        }
        return result;
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    _unlink(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    _linkBeforeTail(node) {
        node.prev = this._tail.prev;
        node.next = this._tail;
        this._tail.prev.next = node;
        this._tail.prev = node;
    }

    _moveToTail(node) {
        this._unlink(node);
        this._linkBeforeTail(node);
    }
}

module.exports = { LRUCache };

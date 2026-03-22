// Supports both CJS and ESM:
//   const { X } = require("@disckit/cache");   // CommonJS
//   import { X } from "@disckit/cache";         // ESM (Node >=18, bundlers)
//
// @disckit/cache — TypeScript definitions

export declare class LRUCache<K = string, V = unknown> {
  constructor(maxSize: number);
  readonly maxSize: number;
  size: number;
  get(key: K): V | undefined;
  peek(key: K): V | undefined;
  has(key: K): boolean;
  set(key: K, value: V): void;
  delete(key: K): boolean;
  clear(): void;
  entries(): IterableIterator<[K, V]>;
  keys(): K[];
}

export declare class TTLCache<K = string, V = unknown> {
  constructor(maxSize: number, ttlMs?: number);
  readonly maxSize: number;
  readonly size: number;
  get(key: K): V | undefined;
  has(key: K): boolean;
  set(key: K, value: V, ttlMs?: number): void;
  delete(key: K): boolean;
  clear(): void;
  purgeExpired(): number;
  entries(): Array<[K, V]>;
  keys(): K[];
}

export declare function createCache<K = string, V = unknown>(maxSize?: number, ttlMs?: number): LRUCache<K, V> | TTLCache<K, V>;
export declare const DEFAULT_MAX_SIZE: number;
export declare const DEFAULT_TTL_MS: number;

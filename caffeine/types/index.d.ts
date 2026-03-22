// Supports both CJS and ESM:
//   const { X } = require("@disckit/caffeine");   // CommonJS
//   import { X } from "@disckit/caffeine";         // ESM (Node >=18, bundlers)
//
// @disckit/caffeine — TypeScript definitions

export type EvictionReason = "size" | "expired" | "manual";
export type Loader<T> = (key: string) => Promise<T>;
export type EvictionCallback<T> = (key: string, value: T, reason: EvictionReason) => void;

export interface CacheStats {
  hits: number; misses: number; loads: number; errors: number;
  coalesced: number; evictions: number; refreshes: number; size: number; inflight: number;
}

export declare class CaffeineCache<T = unknown> {
  get(key: string, loader?: Loader<T>): Promise<T>;
  put(key: string, value: T): void;
  getIfPresent(key: string): T | undefined;
  has(key: string): boolean;
  invalidate(key: string): boolean;
  invalidateAll(): void;
  cleanUp(): number;
  readonly stats: CacheStats;
  resetStats(): void;
  readonly size: number;
}

export declare class CacheBuilder<T = unknown> {
  static newBuilder<T = unknown>(): CacheBuilder<T>;
  maximumSize(size: number): this;
  expireAfterWrite(ms: number): this;
  expireAfterAccess(ms: number): this;
  refreshAfterWrite(ms: number): this;
  onEviction(fn: EvictionCallback<T>): this;
  build(): CaffeineCache<T>;
  buildAsync(loader: Loader<T>): CaffeineCache<T>;
}

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { CacheBuilder, CaffeineCache } = require("../src/index.js");

describe("CacheBuilder — build()", () => {
  it("builds a cache instance",       () => assert.ok(CacheBuilder.newBuilder().build() instanceof CaffeineCache));
  it("throws on invalid maximumSize", () => assert.throws(() => CacheBuilder.newBuilder().maximumSize(0)));
  it("throws on invalid expireAfterWrite", () => assert.throws(() => CacheBuilder.newBuilder().expireAfterWrite(-1)));
  it("throws on non-function loader", () => assert.throws(() => CacheBuilder.newBuilder().buildAsync("not-a-fn")));
});

describe("CaffeineCache — get/put", () => {
  it("put and get returns value",    async () => { const c = CacheBuilder.newBuilder().build(); c.put("k", 42); assert.strictEqual(await c.get("k"), 42); });
  it("get with loader loads value",  async () => { const c = CacheBuilder.newBuilder().build(); const v = await c.get("k", async () => 99); assert.strictEqual(v, 99); });
  it("get without loader throws",    async () => { const c = CacheBuilder.newBuilder().build(); await assert.rejects(c.get("k")); });
  it("getIfPresent returns value",   () => { const c = CacheBuilder.newBuilder().build(); c.put("k", 1); assert.strictEqual(c.getIfPresent("k"), 1); });
  it("getIfPresent returns undef for missing", () => { const c = CacheBuilder.newBuilder().build(); assert.strictEqual(c.getIfPresent("missing"), undefined); });
});

describe("CaffeineCache — invalidate", () => {
  it("invalidate removes key",       async () => { const c = CacheBuilder.newBuilder().build(); c.put("k", 1); c.invalidate("k"); assert.strictEqual(c.getIfPresent("k"), undefined); });
  it("invalidateAll clears cache",   () => { const c = CacheBuilder.newBuilder().build(); c.put("a",1); c.put("b",2); c.invalidateAll(); assert.strictEqual(c.size, 0); });
});

describe("CaffeineCache — eviction by size", () => {
  it("evicts LRU when full",         () => {
    const c = CacheBuilder.newBuilder().maximumSize(2).build();
    c.put("a",1); c.put("b",2); c.put("c",3);
    assert.strictEqual(c.getIfPresent("a"), undefined); // a was LRU
    assert.strictEqual(c.getIfPresent("c"), 3);
  });
});

describe("CaffeineCache — stats", () => {
  it("tracks hits and misses",       async () => {
    const c = CacheBuilder.newBuilder().buildAsync(async () => 1);
    await c.get("k"); // miss + load
    await c.get("k"); // hit
    assert.strictEqual(c.stats.hits, 1);
    assert.strictEqual(c.stats.misses, 1);
  });
});

describe("CaffeineCache — request coalescing", () => {
  it("coalesces concurrent gets for same key", async () => {
    let calls = 0;
    const c = CacheBuilder.newBuilder().buildAsync(async k => { calls++; return k; });
    const [a, b, d] = await Promise.all([c.get("x"), c.get("x"), c.get("x")]);
    assert.strictEqual(a, "x"); assert.strictEqual(b, "x"); assert.strictEqual(d, "x");
    assert.strictEqual(calls, 1);
  });
});

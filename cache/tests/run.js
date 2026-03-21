const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { LRUCache, TTLCache, createCache } = require("../src/index.js");

describe("LRUCache — basic ops", () => {
  it("set and get",                () => { const c = new LRUCache(5); c.set("k","v"); assert.strictEqual(c.get("k"), "v"); });
  it("has() true for existing",    () => { const c = new LRUCache(5); c.set("k",1); assert.ok(c.has("k")); });
  it("has() false for missing",    () => assert.ok(!(new LRUCache(5)).has("x")));
  it("delete removes key",         () => { const c = new LRUCache(5); c.set("k",1); c.delete("k"); assert.strictEqual(c.get("k"), undefined); });
  it("clear empties cache",        () => { const c = new LRUCache(5); c.set("a",1); c.set("b",2); c.clear(); assert.strictEqual(c.size, 0); });
  it("throws on invalid maxSize",  () => assert.throws(() => new LRUCache(0)));
});

describe("LRUCache — eviction", () => {
  it("evicts oldest when full",    () => {
    const c = new LRUCache(2);
    c.set("a",1); c.set("b",2); c.set("c",3);
    assert.strictEqual(c.get("a"), undefined);
    assert.strictEqual(c.get("c"), 3);
  });
  it("access promotes to MRU",    () => {
    const c = new LRUCache(2);
    c.set("a",1); c.set("b",2);
    c.get("a"); // promote a
    c.set("c",3); // evicts b (LRU)
    assert.strictEqual(c.get("a"), 1);
    assert.strictEqual(c.get("b"), undefined);
  });
  it("peek doesn't promote",      () => {
    const c = new LRUCache(2);
    c.set("a",1); c.set("b",2);
    c.peek("a"); // shouldn't promote
    c.set("c",3); // should evict a
    assert.strictEqual(c.get("a"), undefined);
  });
});

describe("TTLCache — basic ops", () => {
  it("set and get",                () => { const c = new TTLCache(5, 10000); c.set("k","v"); assert.strictEqual(c.get("k"), "v"); });
  it("throws on invalid maxSize",  () => assert.throws(() => new TTLCache(0)));
  it("per-entry ttl override",     async () => {
    const c = new TTLCache(5, 10000);
    c.set("k","v", 10); // 10ms ttl
    await new Promise(r => setTimeout(r, 30));
    assert.strictEqual(c.get("k"), undefined);
  });
  it("default ttl expires entry",  async () => {
    const c = new TTLCache(5, 10);
    c.set("k","v");
    await new Promise(r => setTimeout(r, 30));
    assert.strictEqual(c.get("k"), undefined);
  });
});

describe("createCache()", () => {
  it("without ttl returns LRUCache",  () => assert.ok(createCache(5) instanceof LRUCache));
  it("with ttl returns TTLCache",     () => assert.ok(createCache(5, 1000) instanceof TTLCache));
});

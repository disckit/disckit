const { describe, it, before } = require("node:test");
const assert = require("node:assert/strict");

const { paginate, fromQuery, Paginator } = require("../src/index.js");
const items = Array.from({ length: 25 }, (_, i) => i + 1);

describe("paginate() — basic", () => {
  it("returns correct slice for page 1",     () => assert.deepStrictEqual(paginate(items, { page: 1, limit: 10 }).items, [1,2,3,4,5,6,7,8,9,10]));
  it("returns correct slice for page 3",     () => assert.deepStrictEqual(paginate(items, { page: 3, limit: 10 }).items, [21,22,23,24,25]));
  it("totalPages is correct",                () => assert.strictEqual(paginate(items, { limit: 10 }).totalPages, 3));
  it("hasPrev is false on page 1",           () => assert.ok(!paginate(items, { page: 1 }).hasPrev));
  it("hasNext is false on last page",        () => assert.ok(!paginate(items, { page: 3, limit: 10 }).hasNext));
  it("hasPrev is true on page 2",            () => assert.ok(paginate(items, { page: 2, limit: 10 }).hasPrev));
  it("page is clamped to totalPages",        () => assert.strictEqual(paginate(items, { page: 99, limit: 10 }).page, 3));
  it("from/to correct on page 2",            () => { const r = paginate(items, { page: 2, limit: 10 }); assert.strictEqual(r.from, 11); assert.strictEqual(r.to, 20); });
  it("empty array returns from=0",           () => assert.strictEqual(paginate([], { page: 1 }).from, 0));
});

describe("paginate() — defaults", () => {
  it("default limit is 10", () => assert.strictEqual(paginate(items).limit, 10));
  it("default page is 1",   () => assert.strictEqual(paginate(items).page, 1));
});

describe("fromQuery()", () => {
  it("parses string page and limit",    () => { const r = fromQuery({ page: "2", limit: "10" }, { total: 100 }); assert.strictEqual(r.page, 2); assert.strictEqual(r.skip, 10); });
  it("caps limit at maxLimit",          () => assert.strictEqual(fromQuery({ limit: "999" }, { total: 100, maxLimit: 50 }).limit, 50));
  it("meta.hasPrev is correct",         () => assert.ok(fromQuery({ page: "2" }, { total: 100 }).meta.hasPrev));
  it("meta.hasNext false on last page", () => assert.ok(!fromQuery({ page: "5", limit: "20" }, { total: 100 }).meta.hasNext));
  it("handles missing params",          () => { const r = fromQuery({}, { total: 50, defaultLimit: 10 }); assert.strictEqual(r.page, 1); assert.strictEqual(r.limit, 10); });
});

describe("Paginator — navigation", () => {
  it("throws on invalid total", () => assert.throws(() => new Paginator({ total: -1 }), TypeError));
  it("starts on page 1",        () => assert.strictEqual(new Paginator({ total: 25, limit: 10 }).page, 1));
  it("next() advances page",    () => { const p = new Paginator({ total: 25, limit: 10 }); p.next(); assert.strictEqual(p.page, 2); });
  it("prev() goes back",        () => { const p = new Paginator({ total: 25, limit: 10 }); p.next(); p.prev(); assert.strictEqual(p.page, 1); });
  it("prev() no-ops on page 1", () => { const p = new Paginator({ total: 25, limit: 10 }); p.prev(); assert.strictEqual(p.page, 1); });
  it("last() jumps to end",     () => { const p = new Paginator({ total: 25, limit: 10 }); p.last(); assert.strictEqual(p.page, 3); });
  it("next() no-ops on last",   () => { const p = new Paginator({ total: 25, limit: 10 }); p.last(); p.next(); assert.strictEqual(p.page, 3); });
  it("first() jumps to 1",      () => { const p = new Paginator({ total: 25, limit: 10 }); p.last(); p.first(); assert.strictEqual(p.page, 1); });
  it("goTo(2) works",           () => { const p = new Paginator({ total: 25, limit: 10 }); p.goTo(2); assert.strictEqual(p.page, 2); });
});

describe("Paginator — buttons() on page 1", () => {
  it("prev disabled", () => assert.ok(new Paginator({ total: 30, limit: 10 }).buttons().prev.disabled));
  it("next enabled",  () => assert.ok(!new Paginator({ total: 30, limit: 10 }).buttons().next.disabled));
  it("label correct", () => assert.strictEqual(new Paginator({ total: 30, limit: 10 }).buttons().label, "Page 1 / 3"));
});

describe("Paginator — buttons() on last page", () => {
  it("next disabled", () => { const p = new Paginator({ total: 30, limit: 10 }); p.last(); assert.ok(p.buttons().next.disabled); });
  it("prev enabled",  () => { const p = new Paginator({ total: 30, limit: 10 }); p.last(); assert.ok(!p.buttons().prev.disabled); });
});

describe("Paginator — slice()", () => {
  const arr = Array.from({ length: 25 }, (_, i) => i);
  it("slice correct for page 1", () => assert.deepStrictEqual(new Paginator({ total: 25, limit: 10 }).slice(arr), [0,1,2,3,4,5,6,7,8,9]));
  it("slice correct for page 3", () => { const p = new Paginator({ total: 25, limit: 10 }); p.goTo(3); assert.deepStrictEqual(p.slice(arr), [20,21,22,23,24]); });
});

describe("Paginator — isEmpty (v1.2.0)", () => {
  it("isEmpty true when total is 0",  () => { const p = new Paginator({ total: 0 }); assert.ok(p.isEmpty); });
  it("isEmpty false when total > 0",  () => { const p = new Paginator({ total: 5 }); assert.ok(!p.isEmpty); });
  it("isEmpty in toJSON",             () => { const p = new Paginator({ total: 0 }); assert.ok(p.toJSON().isEmpty); });
});

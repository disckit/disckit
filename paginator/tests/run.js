"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { paginate, fromQuery, Paginator, PaginatorStore, cursorPaginate, pages } = require("../src/index.js");

const items25 = Array.from({ length: 25 }, (_, i) => i + 1);
const items30 = Array.from({ length: 30 }, (_, i) => i + 1);

// ── paginate() ────────────────────────────────────────────────────────────────

describe("paginate() — slicing", () => {
  it("page 1 slice",              () => assert.deepStrictEqual(paginate(items25, { page: 1, limit: 10 }).items, [1,2,3,4,5,6,7,8,9,10]));
  it("page 2 slice",              () => assert.deepStrictEqual(paginate(items25, { page: 2, limit: 10 }).items, [11,12,13,14,15,16,17,18,19,20]));
  it("last page partial slice",   () => assert.deepStrictEqual(paginate(items25, { page: 3, limit: 10 }).items, [21,22,23,24,25]));
  it("default limit 10",          () => assert.strictEqual(paginate(items25).limit, 10));
  it("default page 1",            () => assert.strictEqual(paginate(items25).page, 1));
});

describe("paginate() — metadata", () => {
  it("totalPages correct",        () => assert.strictEqual(paginate(items25, { limit: 10 }).totalPages, 3));
  it("hasPrev false on p1",       () => assert.ok(!paginate(items25, { page: 1 }).hasPrev));
  it("hasPrev true on p2",        () => assert.ok(paginate(items25, { page: 2, limit: 10 }).hasPrev));
  it("hasNext false on last",     () => assert.ok(!paginate(items25, { page: 3, limit: 10 }).hasNext));
  it("hasNext true on p1",        () => assert.ok(paginate(items25, { page: 1, limit: 10 }).hasNext));
  it("isEmpty false when items",  () => assert.ok(!paginate(items25).isEmpty));
  it("isEmpty true when empty",   () => assert.ok(paginate([]).isEmpty));
  it("isFirstPage true on p1",    () => assert.ok(paginate(items25, { page: 1 }).isFirstPage));
  it("isFirstPage false on p2",   () => assert.ok(!paginate(items25, { page: 2, limit: 10 }).isFirstPage));
  it("isLastPage true on last",   () => assert.ok(paginate(items25, { page: 3, limit: 10 }).isLastPage));
  it("isLastPage false on p1",    () => assert.ok(!paginate(items25, { page: 1, limit: 10 }).isLastPage));
  it("from/to correct on p2",     () => { const r = paginate(items25, { page: 2, limit: 10 }); assert.strictEqual(r.from, 11); assert.strictEqual(r.to, 20); });
  it("from=0 on empty",           () => assert.strictEqual(paginate([]).from, 0));
  it("page clamped to totalPages",() => assert.strictEqual(paginate(items25, { page: 99, limit: 10 }).page, 3));
  it("page clamped to 1",         () => assert.strictEqual(paginate(items25, { page: -5, limit: 10 }).page, 1));
});

// ── fromQuery() ───────────────────────────────────────────────────────────────

describe("fromQuery()", () => {
  it("parses string page+limit",    () => { const r = fromQuery({ page: "2", limit: "10" }, { total: 100 }); assert.strictEqual(r.page, 2); assert.strictEqual(r.skip, 10); });
  it("caps at maxLimit",            () => assert.strictEqual(fromQuery({ limit: "999" }, { total: 100, maxLimit: 50 }).limit, 50));
  it("meta.hasPrev on p2",          () => assert.ok(fromQuery({ page: "2" }, { total: 100 }).meta.hasPrev));
  it("meta.hasNext false last page",() => assert.ok(!fromQuery({ page: "5", limit: "20" }, { total: 100 }).meta.hasNext));
  it("meta.isEmpty when total=0",   () => assert.ok(fromQuery({}, { total: 0 }).meta.isEmpty));
  it("fallback defaultLimit",       () => { const r = fromQuery({}, { total: 50, defaultLimit: 10 }); assert.strictEqual(r.limit, 10); });
  it("skip=0 on page 1",            () => assert.strictEqual(fromQuery({ page: "1", limit: "10" }, { total: 100 }).skip, 0));
  it("skip correct on page 3",      () => assert.strictEqual(fromQuery({ page: "3", limit: "10" }, { total: 100 }).skip, 20));
});

// ── Paginator — navigation ────────────────────────────────────────────────────

describe("Paginator — constructor", () => {
  it("throws on negative total",  () => assert.throws(() => new Paginator({ total: -1 }), TypeError));
  it("throws on non-number total",() => assert.throws(() => new Paginator({ total: "5" }), TypeError));
  it("starts on page 1",          () => assert.strictEqual(new Paginator({ total: 25, limit: 10 }).page, 1));
  it("respects initial page",     () => assert.strictEqual(new Paginator({ total: 25, limit: 10, page: 2 }).page, 2));
  it("total=0 isEmpty",           () => assert.ok(new Paginator({ total: 0 }).isEmpty));
});

describe("Paginator — navigation", () => {
  it("next() advances",           () => { const p = new Paginator({ total: 25, limit: 10 }); p.next(); assert.strictEqual(p.page, 2); });
  it("prev() goes back",          () => { const p = new Paginator({ total: 25, limit: 10 }); p.next(); p.prev(); assert.strictEqual(p.page, 1); });
  it("prev() no-op on p1",        () => { const p = new Paginator({ total: 25, limit: 10 }); p.prev(); assert.strictEqual(p.page, 1); });
  it("next() no-op on last",      () => { const p = new Paginator({ total: 25, limit: 10 }); p.last(); p.next(); assert.strictEqual(p.page, 3); });
  it("last() jumps to end",       () => { const p = new Paginator({ total: 25, limit: 10 }); p.last(); assert.strictEqual(p.page, 3); });
  it("first() jumps to 1",        () => { const p = new Paginator({ total: 25, limit: 10 }); p.last(); p.first(); assert.strictEqual(p.page, 1); });
  it("reset() goes to 1",         () => { const p = new Paginator({ total: 25, limit: 10 }); p.last(); p.reset(); assert.strictEqual(p.page, 1); });
  it("goTo(2) works",             () => { const p = new Paginator({ total: 25, limit: 10 }); p.goTo(2); assert.strictEqual(p.page, 2); });
  it("goTo clamps high",          () => { const p = new Paginator({ total: 25, limit: 10 }); p.goTo(99); assert.strictEqual(p.page, 3); });
  it("goTo clamps low",           () => { const p = new Paginator({ total: 25, limit: 10 }); p.goTo(-5); assert.strictEqual(p.page, 1); });
  it("methods chain",             () => { const p = new Paginator({ total: 30, limit: 10 }); assert.strictEqual(p.next().next().page, 3); });
});

describe("Paginator — getters", () => {
  it("isFirstPage on p1",         () => assert.ok(new Paginator({ total: 30, limit: 10 }).isFirstPage));
  it("isFirstPage false on p2",   () => { const p = new Paginator({ total: 30, limit: 10 }); p.next(); assert.ok(!p.isFirstPage); });
  it("isLastPage on last",        () => { const p = new Paginator({ total: 30, limit: 10 }); p.last(); assert.ok(p.isLastPage); });
  it("offset correct",            () => { const p = new Paginator({ total: 30, limit: 10 }); p.next(); assert.strictEqual(p.offset, 10); });
  it("totalPages correct",        () => assert.strictEqual(new Paginator({ total: 25, limit: 10 }).totalPages, 3));
});

describe("Paginator — buttons()", () => {
  it("prev disabled on p1",       () => assert.ok(new Paginator({ total: 30, limit: 10 }).buttons().prev.disabled));
  it("next enabled on p1",        () => assert.ok(!new Paginator({ total: 30, limit: 10 }).buttons().next.disabled));
  it("next disabled on last",     () => { const p = new Paginator({ total: 30, limit: 10 }); p.last(); assert.ok(p.buttons().next.disabled); });
  it("prev enabled on last",      () => { const p = new Paginator({ total: 30, limit: 10 }); p.last(); assert.ok(!p.buttons().prev.disabled); });
  it("label default format",      () => assert.strictEqual(new Paginator({ total: 30, limit: 10 }).buttons().label, "Page 1 / 3"));
  it("label custom override",     () => assert.strictEqual(new Paginator({ total: 30, limit: 10 }).buttons({ label: "Custom" }).label, "Custom"));
  it("custom prev label",         () => assert.strictEqual(new Paginator({ total: 30, limit: 10 }).buttons({ prev: "«" }).prev.label, "«"));
});

describe("Paginator — window()", () => {
  it("returns correct range p1",  () => assert.deepStrictEqual(new Paginator({ total: 100, limit: 10 }).window(5), [1,2,3,4,5]));
  it("centered on middle page",   () => { const p = new Paginator({ total: 200, limit: 10, page: 10 }); assert.deepStrictEqual(p.window(5), [8,9,10,11,12]); });
  it("clamped at last page",      () => { const p = new Paginator({ total: 100, limit: 10, page: 10 }); assert.deepStrictEqual(p.window(5), [6,7,8,9,10]); });
  it("all pages when few",        () => assert.deepStrictEqual(new Paginator({ total: 25, limit: 10 }).window(5), [1,2,3]));
});

describe("Paginator — selectMenu()", () => {
  it("has correct customId",      () => assert.strictEqual(new Paginator({ total: 30, limit: 10 }).selectMenu({ customId: "test" }).customId, "test"));
  it("current page is default",   () => { const p = new Paginator({ total: 30, limit: 10 }); p.next(); const menu = p.selectMenu(); assert.ok(menu.options.find(o => o.default)?.value === "2"); });
  it("options count correct",     () => assert.strictEqual(new Paginator({ total: 30, limit: 10 }).selectMenu().options.length, 3));
});

describe("Paginator — slice()", () => {
  it("slice p1",                  () => assert.deepStrictEqual(new Paginator({ total: 25, limit: 10 }).slice(items25), [1,2,3,4,5,6,7,8,9,10]));
  it("slice last page",           () => { const p = new Paginator({ total: 25, limit: 10 }); p.last(); assert.deepStrictEqual(p.slice(items25), [21,22,23,24,25]); });
});

describe("Paginator — clone()", () => {
  it("clone is independent",      () => { const p = new Paginator({ total: 30, limit: 10 }); const c = p.clone(); c.next(); assert.strictEqual(p.page, 1); assert.strictEqual(c.page, 2); });
  it("clone same state",          () => { const p = new Paginator({ total: 30, limit: 10, page: 2 }); assert.strictEqual(p.clone().page, 2); });
});

describe("Paginator — onChange()", () => {
  it("fires on next()",           () => { let called = false; const p = new Paginator({ total: 30, limit: 10 }); p.onChange(() => { called = true; }); p.next(); assert.ok(called); });
  it("fires with correct page",   () => { let page = 0; const p = new Paginator({ total: 30, limit: 10 }); p.onChange(pg => { page = pg; }); p.next(); assert.strictEqual(page, 2); });
  it("not fired if no change",    () => { let calls = 0; const p = new Paginator({ total: 30, limit: 10 }); p.onChange(() => calls++); p.prev(); assert.strictEqual(calls, 0); });
  it("unsubscribe works",         () => { let calls = 0; const p = new Paginator({ total: 30, limit: 10 }); const unsub = p.onChange(() => calls++); unsub(); p.next(); assert.strictEqual(calls, 0); });
});

describe("Paginator — toJSON()", () => {
  it("isEmpty in toJSON",         () => assert.ok(new Paginator({ total: 0 }).toJSON().isEmpty));
  it("isFirstPage in toJSON",     () => assert.ok(new Paginator({ total: 30, limit: 10 }).toJSON().isFirstPage));
  it("offset in toJSON",          () => { const p = new Paginator({ total: 30, limit: 10, page: 2 }); assert.strictEqual(p.toJSON().offset, 10); });
});

describe("Paginator — static factories", () => {
  it("fromArray returns paginator",() => { const { paginator } = Paginator.fromArray(items25, { limit: 10 }); assert.ok(paginator instanceof Paginator); });
  it("fromArray items = first page",() => { const { items } = Paginator.fromArray(items25, { limit: 10 }); assert.deepStrictEqual(items, [1,2,3,4,5,6,7,8,9,10]); });
  it("fromArray throws on non-array",() => assert.throws(() => Paginator.fromArray("bad"), TypeError));
  it("fromJSON restores state",    () => { const p = new Paginator({ total: 30, limit: 10, page: 2 }); const r = Paginator.fromJSON(p.toJSON()); assert.strictEqual(r.page, 2); assert.strictEqual(r.total, 30); });
  it("fromJSON throws on bad data",() => assert.throws(() => Paginator.fromJSON(null), TypeError));
});

// ── PaginatorStore ────────────────────────────────────────────────────────────

describe("PaginatorStore — basic", () => {
  it("create returns Paginator",  () => { const s = new PaginatorStore(); assert.ok(s.create("u1", { total: 30, limit: 10 }) instanceof Paginator); s.destroy(); });
  it("get returns paginator",     () => { const s = new PaginatorStore(); s.create("u1", { total: 30 }); assert.ok(s.get("u1") instanceof Paginator); s.destroy(); });
  it("get unknown returns undef", () => { const s = new PaginatorStore(); assert.strictEqual(s.get("x"), undefined); s.destroy(); });
  it("has returns true",          () => { const s = new PaginatorStore(); s.create("u1", { total: 30 }); assert.ok(s.has("u1")); s.destroy(); });
  it("has returns false",         () => { const s = new PaginatorStore(); assert.ok(!s.has("x")); s.destroy(); });
  it("delete removes",            () => { const s = new PaginatorStore(); s.create("u1", { total: 30 }); s.delete("u1"); assert.ok(!s.has("u1")); s.destroy(); });
  it("size counts active",        () => { const s = new PaginatorStore(); s.create("u1", { total: 30 }); s.create("u2", { total: 30 }); assert.strictEqual(s.size, 2); s.destroy(); });
  it("clear removes all",         () => { const s = new PaginatorStore(); s.create("u1", { total: 30 }); s.create("u2", { total: 30 }); s.clear(); assert.strictEqual(s.size, 0); s.destroy(); });
  it("keys() returns all keys",   () => { const s = new PaginatorStore(); s.create("u1", { total: 30 }); s.create("u2", { total: 30 }); assert.deepStrictEqual(s.keys().sort(), ["u1", "u2"]); s.destroy(); });
});

describe("PaginatorStore — navigation shortcuts", () => {
  it("next() advances page",      () => { const s = new PaginatorStore(); s.create("u1", { total: 30, limit: 10 }); s.next("u1"); assert.strictEqual(s.get("u1").page, 2); s.destroy(); });
  it("prev() goes back",          () => { const s = new PaginatorStore(); s.create("u1", { total: 30, limit: 10 }); s.next("u1"); s.prev("u1"); assert.strictEqual(s.get("u1").page, 1); s.destroy(); });
  it("goTo() jumps",              () => { const s = new PaginatorStore(); s.create("u1", { total: 30, limit: 10 }); s.goTo("u1", 3); assert.strictEqual(s.get("u1").page, 3); s.destroy(); });
  it("next() on missing returns undef", () => { const s = new PaginatorStore(); assert.strictEqual(s.next("missing"), undefined); s.destroy(); });
});

describe("PaginatorStore — TTL", () => {
  it("expired returns undefined", async () => {
    const s = new PaginatorStore({ ttlMs: 10 });
    s.create("u1", { total: 30 });
    await new Promise(r => setTimeout(r, 20));
    assert.strictEqual(s.get("u1"), undefined);
    s.destroy();
  });
  it("not expired before TTL",    () => {
    const s = new PaginatorStore({ ttlMs: 60_000 });
    s.create("u1", { total: 30 });
    assert.ok(s.get("u1") !== undefined);
    s.destroy();
  });
});


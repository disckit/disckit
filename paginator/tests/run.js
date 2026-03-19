const assert = require("assert");
let _p = 0, _f = 0;
function suite(n) { console.log(`\n[suite] ${n}`); }
function test(d, fn) {
  try { fn(); console.log(`  ✓  ${d}`); _p++; }
  catch(e) { console.error(`  ✗  ${d}\n     ${e.message}`); _f++; }
}
function summary() {
  console.log(`\n${"─".repeat(52)}\n  Total: ${_p+_f} | Passed: ${_p} | Failed: ${_f}\n${"─".repeat(52)}`);
  if (_f > 0) { console.error(`\n❌  ${_f} test(s) failed.`); process.exit(1); }
  else console.log(`\n✅  All ${_p} tests passed.`);
}

const { paginate, fromQuery, Paginator } = require("../src/index.js");
const items = Array.from({ length: 25 }, (_, i) => i + 1);

suite("paginate() — basic");
test("returns correct slice for page 1",      () => assert.deepStrictEqual(paginate(items, { page: 1, limit: 10 }).items, [1,2,3,4,5,6,7,8,9,10]));
test("returns correct slice for page 3",      () => assert.deepStrictEqual(paginate(items, { page: 3, limit: 10 }).items, [21,22,23,24,25]));
test("totalPages is correct",                 () => assert.strictEqual(paginate(items, { limit: 10 }).totalPages, 3));
test("hasPrev is false on page 1",            () => assert.ok(!paginate(items, { page: 1 }).hasPrev));
test("hasNext is false on last page",         () => assert.ok(!paginate(items, { page: 3, limit: 10 }).hasNext));
test("hasPrev is true on page 2",             () => assert.ok(paginate(items, { page: 2, limit: 10 }).hasPrev));
test("page is clamped to totalPages",         () => assert.strictEqual(paginate(items, { page: 99, limit: 10 }).page, 3));
test("from/to are correct on page 2",         () => { const r = paginate(items, { page: 2, limit: 10 }); assert.strictEqual(r.from, 11); assert.strictEqual(r.to, 20); });
test("empty array returns from=0",            () => assert.strictEqual(paginate([], { page: 1 }).from, 0));

suite("paginate() — defaults");
test("default limit is 10",  () => assert.strictEqual(paginate(items).limit, 10));
test("default page is 1",    () => assert.strictEqual(paginate(items).page, 1));

suite("fromQuery()");
test("parses string page and limit",          () => { const r = fromQuery({ page: "2", limit: "10" }, { total: 100 }); assert.strictEqual(r.page, 2); assert.strictEqual(r.skip, 10); });
test("caps limit at maxLimit",                () => assert.strictEqual(fromQuery({ limit: "999" }, { total: 100, maxLimit: 50 }).limit, 50));
test("meta.hasPrev is correct",               () => assert.ok(fromQuery({ page: "2" }, { total: 100 }).meta.hasPrev));
test("meta.hasNext is correct on last page",  () => assert.ok(!fromQuery({ page: "5", limit: "20" }, { total: 100 }).meta.hasNext));
test("handles missing query params",          () => { const r = fromQuery({}, { total: 50, defaultLimit: 10 }); assert.strictEqual(r.page, 1); assert.strictEqual(r.limit, 10); });

suite("Paginator — navigation");
test("throws on invalid total",     () => assert.throws(() => new Paginator({ total: -1 }), TypeError));
const p = new Paginator({ total: 25, limit: 10 });
test("starts on page 1",            () => assert.strictEqual(p.page, 1));
test("next() advances page",        () => { p.next(); assert.strictEqual(p.page, 2); });
test("prev() goes back",            () => { p.prev(); assert.strictEqual(p.page, 1); });
test("prev() no-ops on page 1",     () => { p.prev(); assert.strictEqual(p.page, 1); });
test("last() jumps to last page",   () => { p.last(); assert.strictEqual(p.page, 3); });
test("next() no-ops on last page",  () => { p.next(); assert.strictEqual(p.page, 3); });
test("first() jumps to page 1",     () => { p.first(); assert.strictEqual(p.page, 1); });
test("goTo(2) works",               () => { p.goTo(2); assert.strictEqual(p.page, 2); });

suite("Paginator — buttons()");
const p2 = new Paginator({ total: 30, limit: 10 });
test("prev disabled on page 1",           () => assert.ok(p2.buttons().prev.disabled));
test("next enabled on page 1",            () => assert.ok(!p2.buttons().next.disabled));
test("label shows correct page/total",    () => assert.strictEqual(p2.buttons().label, "Page 1 / 3"));
p2.last();
test("next disabled on last page",        () => assert.ok(p2.buttons().next.disabled));
test("prev enabled on last page",         () => assert.ok(!p2.buttons().prev.disabled));

suite("Paginator — slice()");
const p3 = new Paginator({ total: 25, limit: 10 });
const arr = Array.from({ length: 25 }, (_, i) => i);
test("slice returns correct items for page 1", () => assert.deepStrictEqual(p3.slice(arr), [0,1,2,3,4,5,6,7,8,9]));
p3.goTo(3);
test("slice returns correct items for page 3", () => assert.deepStrictEqual(p3.slice(arr), [20,21,22,23,24]));

summary();

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

const { I18n, createT } = require("../src/index.js");

const i18n = new I18n({ fallback: "en" });
i18n.load("en", {
  greet: "Hello, {{name}}!",
  bye:   "Goodbye!",
  items: { one: "{{n}} item", other: "{{n}} items" },
  items_zero: { zero: "no items", one: "{{n}} item", other: "{{n}} items" },
  deep:  { nested: { key: "Found it" } },
});
i18n.load("pt", {
  greet: "Olá, {{name}}!",
});

suite("I18n — basic translation");
test("translates a key",                    () => assert.strictEqual(i18n.t("bye", "en"), "Goodbye!"));
test("interpolates variables",              () => assert.strictEqual(i18n.t("greet", "en", { name: "World" }), "Hello, World!"));
test("translates in pt",                    () => assert.strictEqual(i18n.t("greet", "pt", { name: "Mundo" }), "Olá, Mundo!"));
test("falls back to en for missing key",    () => assert.strictEqual(i18n.t("bye", "pt"), "Goodbye!"));
test("falls back to en for unknown locale", () => assert.strictEqual(i18n.t("greet", "es", { name: "X" }), "Hello, X!"));
test("resolves deep nested key",            () => assert.strictEqual(i18n.t("deep.nested.key", "en"), "Found it"));
test("returns MISSING for unknown key",     () => assert.ok(i18n.t("nope", "en").includes("MISSING")));

suite("I18n — pluralization");
test("singular: n=1",             () => assert.strictEqual(i18n.t("items", "en", { n: 1 }), "1 item"));
test("plural: n=5",               () => assert.strictEqual(i18n.t("items", "en", { n: 5 }), "5 items"));
test("zero form: n=0",            () => assert.strictEqual(i18n.t("items_zero", "en", { n: 0 }), "no items"));

suite("I18n — has()");
test("has() true for existing key",          () => assert.ok(i18n.has("greet", "en")));
test("has() true via fallback",              () => assert.ok(i18n.has("bye", "pt")));
test("has() false for missing key",          () => assert.ok(!i18n.has("nope", "en")));

suite("I18n — locales()");
test("returns loaded locales",  () => assert.deepStrictEqual(i18n.locales().sort(), ["en", "pt"]));

suite("I18n — load() validation");
test("throws on empty locale",   () => assert.throws(() => i18n.load("", {}), TypeError));
test("throws on null messages",  () => assert.throws(() => i18n.load("en", null), TypeError));

suite("I18n — load() merge");
const i2 = new I18n({ fallback: "en" });
i2.load("en", { a: "A" });
i2.load("en", { b: "B" });
test("merges subsequent loads",  () => { assert.strictEqual(i2.t("a", "en"), "A"); assert.strictEqual(i2.t("b", "en"), "B"); });

suite("createT()");
const t = createT(i18n, "pt");
test("returns a function",        () => assert.strictEqual(typeof t, "function"));
test("translates with bound locale",    () => assert.strictEqual(t("greet", { name: "Mundo" }), "Olá, Mundo!"));
test("falls back when key missing",     () => assert.strictEqual(t("bye"), "Goodbye!"));

summary();

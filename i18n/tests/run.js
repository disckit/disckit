const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { I18n, createT } = require("../src/index.js");

describe("I18n — load & t()", () => {
  const i18n = new I18n({ fallback: "en" });
  i18n.load("en", { hello: "Hello, {{name}}!", count: { one: "1 item", other: "{{n}} items", zero: "No items" } });
  i18n.load("pt", { hello: "Olá, {{name}}!" });

  it("translates en key",              () => assert.strictEqual(i18n.t("hello", "en", { name: "World" }), "Hello, World!"));
  it("translates pt key",              () => assert.strictEqual(i18n.t("hello", "pt", { name: "Mundo" }), "Olá, Mundo!"));
  it("falls back to en for pt miss",   () => assert.strictEqual(i18n.t("count", "pt", { n: 3 }), "3 items"));
  it("missing key returns template",   () => assert.ok(i18n.t("nope", "en").includes("nope")));
  it("has() returns true for en key",  () => assert.ok(i18n.has("hello", "en")));
  it("has() returns false for miss",   () => assert.ok(!i18n.has("nope", "en")));
  it("locales() lists loaded",         () => assert.deepStrictEqual(i18n.locales().sort(), ["en", "pt"]));
});

describe("I18n — pluralization", () => {
  const i18n = new I18n();
  i18n.load("en", { items: { zero: "No items", one: "1 item", other: "{{n}} items" } });

  it("zero form", () => assert.strictEqual(i18n.t("items", "en", { n: 0 }), "No items"));
  it("one form",  () => assert.strictEqual(i18n.t("items", "en", { n: 1 }), "1 item"));
  it("other form",() => assert.strictEqual(i18n.t("items", "en", { n: 5 }), "5 items"));
});

describe("I18n — deep merge", () => {
  const i18n = new I18n();
  i18n.load("en", { a: { x: "X" } });
  i18n.load("en", { a: { y: "Y" } });
  it("deep merge preserves existing keys", () => assert.strictEqual(i18n.t("a.x", "en"), "X"));
  it("deep merge adds new keys",           () => assert.strictEqual(i18n.t("a.y", "en"), "Y"));
});

describe("createT()", () => {
  const i18n = new I18n();
  i18n.load("pt", { greet: "Olá, {{name}}!" });
  const t = createT(i18n, "pt");
  it("returns bound function",      () => assert.strictEqual(typeof t, "function"));
  it("translates with bound locale",() => assert.strictEqual(t("greet", { name: "Mundo" }), "Olá, Mundo!"));
});

describe("I18n — validation", () => {
  const i18n = new I18n();
  it("throws on invalid locale",   () => assert.throws(() => i18n.load("", {}), TypeError));
  it("throws on invalid messages", () => assert.throws(() => i18n.load("en", null), TypeError));
});

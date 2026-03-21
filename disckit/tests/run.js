/**
 * disckit — Integration tests
 * Validates all re-exports from @disckit/* sub-packages and their core behaviour.
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const disckit = require(path.join(__dirname, "../src/index.js"));

function assertExport(name) {
  assert.ok(name in disckit, `Missing export: ${name}`);
  assert.notEqual(disckit[name], undefined, `Export is undefined: ${name}`);
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("disckit meta-package", () => {

  describe("@disckit/common", () => {
    it("exports formatTime", () => assertExport("formatTime"));
    it("exports sleep", () => assertExport("sleep"));
    it("exports chunk", () => assertExport("chunk"));
    it("exports randomInt", () => assertExport("randomInt"));
    it("exports containsLink", () => assertExport("containsLink"));
    it("exports isHexColor", () => assertExport("isHexColor"));
    it("formatTime returns string", () => {
      assert.equal(typeof disckit.formatTime(3661), "string");
    });
    it("chunk splits array correctly", () => {
      assert.deepEqual(disckit.chunk([1, 2, 3, 4], 2), [[1, 2], [3, 4]]);
    });
    it("randomInt(n) returns value in [0, n)", () => {
      const n = disckit.randomInt(10);
      assert.ok(n >= 0 && n < 10);
    });
    it("isHexColor validates correctly", () => {
      assert.ok(disckit.isHexColor("#ff468a"));
      assert.ok(!disckit.isHexColor("notacolor"));
    });
  });

  describe("@disckit/antiflood", () => {
    it("exports AntifloodManager", () => assertExport("AntifloodManager"));
    it("exports isBlocked", () => assertExport("isBlocked"));
    it("exports formatRetryAfter", () => assertExport("formatRetryAfter"));
    it("AntifloodManager is instantiable", () => {
      const mgr = new disckit.AntifloodManager({
        globalRule: { windowMs: 5000, maxHits: 5, penaltyMode: "NONE" },
      });
      assert.equal(typeof mgr.check, "function");
    });
    it("isBlocked returns false on clean check", () => {
      const mgr = new disckit.AntifloodManager({
        globalRule: { windowMs: 5000, maxHits: 10, penaltyMode: "NONE" },
      });
      const result = mgr.check({ userId: "u1", guildId: "g1", commandName: "ping", memberRoleIds: [] });
      assert.ok(!disckit.isBlocked(result));
    });
  });

  describe("@disckit/cache", () => {
    it("exports LRUCache", () => assertExport("LRUCache"));
    it("exports TTLCache", () => assertExport("TTLCache"));
    it("exports createCache", () => assertExport("createCache"));
    it("LRUCache get/set works", () => {
      const cache = new disckit.LRUCache(10);
      cache.set("a", 1);
      assert.equal(cache.get("a"), 1);
      assert.equal(cache.get("missing"), undefined);
    });
    it("LRUCache evicts LRU at capacity", () => {
      const cache = new disckit.LRUCache(2);
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);
      assert.equal(cache.get("a"), undefined);
      assert.equal(cache.get("b"), 2);
    });
    it("TTLCache getOrSet resolves async loader", async () => {
      const cache = new disckit.TTLCache(10, 5000);
      const val = await cache.getOrSet("k", async () => 42);
      assert.equal(val, 42);
      assert.equal(cache.get("k"), 42);
    });
    it("createCache returns LRUCache without ttl", () => {
      assert.ok(disckit.createCache(50) instanceof disckit.LRUCache);
    });
    it("createCache returns TTLCache with ttl", () => {
      assert.ok(disckit.createCache(50, 60000) instanceof disckit.TTLCache);
    });
  });

  describe("@disckit/caffeine", () => {
    it("exports CacheBuilder", () => assertExport("CacheBuilder"));
    it("exports CaffeineCache", () => assertExport("CaffeineCache"));
    it("CacheBuilder produces a working async cache", async () => {
      const cache = disckit.CacheBuilder.newBuilder()
        .maximumSize(10)
        .expireAfterWrite(5000)
        .buildAsync(async (key) => `value:${key}`);
      assert.equal(await cache.get("test"), "value:test");
    });
    it("invalidate triggers reload", async () => {
      let calls = 0;
      const cache = disckit.CacheBuilder.newBuilder()
        .maximumSize(10)
        .buildAsync(async () => ++calls);
      await cache.get("x");
      cache.invalidate("x");
      await cache.get("x");
      assert.equal(calls, 2);
    });
  });

  describe("@disckit/cooldown", () => {
    it("exports CooldownManager", () => assertExport("CooldownManager"));
    it("check.ok is true on first call", () => {
      const mgr = new disckit.CooldownManager({ default: 3000 });
      const result = mgr.check("ping", "u1");
      assert.ok(result.ok);
      assert.equal(result.remaining, 0);
    });
    it("check.ok is false on second call within cooldown", () => {
      const mgr = new disckit.CooldownManager({ default: 5000 });
      mgr.check("ban", "u2"); // first call sets cooldown
      const result = mgr.check("ban", "u2"); // second call within window
      assert.ok(!result.ok);
      assert.ok(result.remaining > 0);
    });
  });

  describe("@disckit/i18n", () => {
    it("exports I18n", () => assertExport("I18n"));
    it("exports createT", () => assertExport("createT"));
    it("translates with interpolation", () => {
      const i18n = new disckit.I18n({ fallback: "en" });
      i18n.load("en", { hello: "Hello, {{name}}!" });
      assert.equal(i18n.t("hello", "en", { name: "World" }), "Hello, World!");
    });
    it("falls back to fallback locale", () => {
      const i18n = new disckit.I18n({ fallback: "en" });
      i18n.load("en", { msg: "Fallback" });
      assert.equal(i18n.t("msg", "pt"), "Fallback");
    });
    it("pluralizes correctly", () => {
      const i18n = new disckit.I18n({ fallback: "en" });
      i18n.load("en", { items: { one: "{{n}} item", other: "{{n}} items" } });
      assert.equal(i18n.t("items", "en", { n: 1 }), "1 item");
      assert.equal(i18n.t("items", "en", { n: 5 }), "5 items");
    });
  });

  describe("@disckit/paginator", () => {
    it("exports Paginator", () => assertExport("Paginator"));
    it("exports paginate", () => assertExport("paginate"));
    it("exports fromQuery", () => assertExport("fromQuery"));
    it("paginate splits items correctly (limit param)", () => {
      const result = disckit.paginate([1, 2, 3, 4, 5], { limit: 2, page: 1 });
      assert.equal(result.totalPages, 3);
      assert.deepEqual(result.items, [1, 2]);
    });
    it("paginate returns correct page 2", () => {
      const result = disckit.paginate([1, 2, 3, 4, 5], { limit: 2, page: 2 });
      assert.deepEqual(result.items, [3, 4]);
    });
  });

  describe("@disckit/permissions", () => {
    it("exports Permissions", () => assertExport("Permissions"));
    it("exports PermissionsBits", () => assertExport("PermissionsBits"));
    it("has() works", () => {
      const p = new disckit.Permissions(["SEND_MESSAGES", "VIEW_CHANNEL"]);
      assert.ok(p.has("SEND_MESSAGES"));
      assert.ok(!p.has("ADMINISTRATOR"));
    });
    it("ADMINISTRATOR bypasses all checks", () => {
      const p = new disckit.Permissions("ADMINISTRATOR");
      assert.ok(p.has("BAN_MEMBERS"));
      assert.ok(p.any(["MANAGE_GUILD"]));
    });
    it("diff returns added/removed correctly", () => {
      const before = new disckit.Permissions(["SEND_MESSAGES"]);
      const after  = new disckit.Permissions(["SEND_MESSAGES", "EMBED_LINKS"]);
      const { added, removed } = after.diff(before);
      assert.ok(added.includes("EMBED_LINKS"));
      assert.equal(removed.length, 0);
    });
    it("missing returns absent permissions", () => {
      const p = new disckit.Permissions(["SEND_MESSAGES"]);
      assert.deepEqual(p.missing(["SEND_MESSAGES", "BAN_MEMBERS"]), ["BAN_MEMBERS"]);
    });
  });

  describe("@disckit/placeholders", () => {
    it("exports applyPlaceholders", () => assertExport("applyPlaceholders"));
    it("exports buildPreviewContext", () => assertExport("buildPreviewContext"));
    it("replaces guild placeholders", () => {
      const ctx = { guild: { name: "TestServer", id: "1", memberCount: 100 } };
      const result = disckit.applyPlaceholders("Welcome to {guild:name}! Members: {count}", ctx);
      assert.equal(result, "Welcome to TestServer! Members: 100");
    });
    it("leaves unknown placeholders unchanged", () => {
      const result = disckit.applyPlaceholders("{unknown:placeholder}", {});
      assert.equal(result, "{unknown:placeholder}");
    });
    it("replaces member placeholders", () => {
      const ctx = { member: { name: "Alice", mention: "<@123>" } };
      const result = disckit.applyPlaceholders("Hello {member:name}, {member:mention}!", ctx);
      assert.equal(result, "Hello Alice, <@123>!");
    });
  });

});

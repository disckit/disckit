const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  applyPlaceholders, buildPreviewContext, detectPlaceholders,
  hasPlaceholders, applyPresencePlaceholders, buildPresenceContext,
  VARIABLES, getByGroup, getAllKeys, findByKey,
} = require("../src/index.js");

describe("applyPlaceholders() — guild", () => {
  const ctx = buildPreviewContext({ guildName: "TestServer", memberCount: 100 });
  it("{server} replaced",           () => assert.ok(applyPlaceholders("{server}", ctx).includes("TestServer")));
  it("{guild:name} replaced",       () => assert.ok(applyPlaceholders("{guild:name}", ctx).includes("TestServer")));
  it("{count} replaced",            () => assert.ok(applyPlaceholders("{count}", ctx).includes("100")));
});

describe("applyPlaceholders() — member", () => {
  const ctx = buildPreviewContext({ memberName: "john", memberId: "123" });
  it("{member:name} replaced",      () => assert.ok(applyPlaceholders("{member:name}", ctx).includes("john")));
  it("{member:mention} replaced",   () => assert.ok(applyPlaceholders("{member:mention}", ctx).includes("<@123>")));
  it("{member:nick} defaults name", () => assert.ok(applyPlaceholders("{member:nick}", ctx).includes("john")));
});

describe("applyPlaceholders() — edge cases", () => {
  const ctx = buildPreviewContext({});
  it("unknown token preserved",     () => assert.strictEqual(applyPlaceholders("{unknown}", ctx), "{unknown}"));
  it("empty string input",          () => assert.strictEqual(applyPlaceholders("", ctx), ""));
  it("non-string input",            () => assert.strictEqual(applyPlaceholders(null, ctx), ""));
});

describe("detectPlaceholders()", () => {
  it("detects tokens",              () => assert.deepStrictEqual(detectPlaceholders("Hi {member:name}!"), ["{member:name}"]));
  it("deduplicates",                () => assert.strictEqual(detectPlaceholders("{a} {a}").length, 1));
  it("no tokens returns []",        () => assert.deepStrictEqual(detectPlaceholders("hello"), []));
});

describe("hasPlaceholders()", () => {
  it("true when has placeholder",   () => assert.ok(hasPlaceholders("{member:name}")));
  it("false when none",             () => assert.ok(!hasPlaceholders("hello world")));
});

describe("applyPresencePlaceholders()", () => {
  it("replaces {servers}",          async () => assert.ok((await applyPresencePlaceholders("{servers} servers", buildPresenceContext(5, 100))).includes("5")));
  it("replaces {members}",          async () => assert.ok((await applyPresencePlaceholders("{members} members", buildPresenceContext(5, 100))).includes("100")));
  it("no placeholders unchanged",   async () => assert.strictEqual(await applyPresencePlaceholders("hello", buildPresenceContext(5, 100)), "hello"));
});

describe("VARIABLES registry", () => {
  it("is array with entries",       () => assert.ok(Array.isArray(VARIABLES) && VARIABLES.length > 0));
  it("no internal groups exposed",  () => {
    const groups = [...new Set(VARIABLES.map(v => v.group))];
    for (const internal of ["forms", "eventlog", "counter"]) {
      assert.ok(!groups.includes(internal), `internal group "${internal}" should not be in public VARIABLES`);
    }
  });
  it("getByGroup('guild') works",   () => assert.ok(getByGroup("guild").length > 0));
  it("getAllKeys returns strings",   () => assert.ok(getAllKeys().every(k => typeof k === "string")));
  it("findByKey finds {server}",    () => assert.ok(findByKey("{server}") !== undefined));
  it("findByKey returns undef",     () => assert.strictEqual(findByKey("{nope}"), undefined));
});

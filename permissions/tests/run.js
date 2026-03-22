const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { Permissions, PermissionsBits } = require("../src/index.js");

describe("PermissionsBits", () => {
  it("is frozen",                         () => assert.ok(Object.isFrozen(PermissionsBits)));
  it("ADMINISTRATOR is bigint",           () => assert.strictEqual(typeof PermissionsBits.ADMINISTRATOR, "bigint"));
  it("has SEND_MESSAGES",                 () => assert.ok("SEND_MESSAGES" in PermissionsBits));
  it("SEND_POLLS is defined",             () => assert.ok("SEND_POLLS" in PermissionsBits));
});

describe("Permissions — has()", () => {
  const p = new Permissions(["BAN_MEMBERS", "KICK_MEMBERS"]);
  it("has() true for set perms",          () => assert.ok(p.has("BAN_MEMBERS")));
  it("has() false for missing perm",      () => assert.ok(!p.has("ADMINISTRATOR")));
  it("ADMIN overrides has()",             () => { const admin = new Permissions(["ADMINISTRATOR"]); assert.ok(admin.has("BAN_MEMBERS")); });
});

describe("Permissions — any()", () => {
  const p = new Permissions(["BAN_MEMBERS"]);
  it("any() true when one matches",       () => assert.ok(p.any(["BAN_MEMBERS", "KICK_MEMBERS"])));
  it("any() false when none matches",     () => assert.ok(!p.any(["ADMINISTRATOR"])));
});

describe("Permissions — missing()", () => {
  const p = new Permissions(["BAN_MEMBERS"]);
  it("returns missing perms",             () => assert.deepStrictEqual(p.missing(["BAN_MEMBERS", "KICK_MEMBERS"]), ["KICK_MEMBERS"]));
  it("empty when all present",            () => assert.deepStrictEqual(p.missing(["BAN_MEMBERS"]), []));
});

describe("Permissions — add/remove", () => {
  const p = new Permissions(["BAN_MEMBERS"]);
  it("add() returns new instance",        () => { const p2 = p.add(["KICK_MEMBERS"]); assert.ok(p2.has("KICK_MEMBERS")); assert.ok(!p.has("KICK_MEMBERS")); });
  it("remove() removes perm",             () => { const p2 = p.remove(["BAN_MEMBERS"]); assert.ok(!p2.has("BAN_MEMBERS")); });
});

describe("Permissions — output", () => {
  const p = new Permissions(["BAN_MEMBERS", "KICK_MEMBERS"]);
  it("toArray() returns perm names",      () => { const arr = p.toArray(); assert.ok(arr.includes("BAN_MEMBERS")); assert.ok(arr.includes("KICK_MEMBERS")); });
  it("toString() returns decimal string", () => assert.strictEqual(typeof p.toString(), "string"));
  it("bitfield is bigint",                () => assert.strictEqual(typeof p.bitfield, "bigint"));
});

describe("Permissions — static", () => {
  it("Permissions.from() works",          () => assert.ok(Permissions.from(["BAN_MEMBERS"]).has("BAN_MEMBERS")));
  it("resolve() unknown throws",          () => assert.throws(() => Permissions.resolve(["UNKNOWN_PERM"]), RangeError));
  it("resolve() invalid type throws",     () => assert.throws(() => Permissions._resolve({}), TypeError));
});

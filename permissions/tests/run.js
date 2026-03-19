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

const { Permissions, PermissionsBits } = require("../src/index.js");

suite("PermissionsBits");
test("ADMINISTRATOR is 8n",       () => assert.strictEqual(PermissionsBits.ADMINISTRATOR, 8n));
test("SEND_MESSAGES is 1n<<11n",  () => assert.strictEqual(PermissionsBits.SEND_MESSAGES, 1n << 11n));
test("is frozen",                 () => assert.ok(Object.isFrozen(PermissionsBits)));

suite("Permissions — constructor");
test("from bigint",               () => assert.strictEqual(new Permissions(8n).bitfield, 8n));
test("from number",               () => assert.strictEqual(new Permissions(8).bitfield, 8n));
test("from string",               () => assert.strictEqual(new Permissions("ADMINISTRATOR").bitfield, 8n));
test("from array",                () => {
  const p = new Permissions(["SEND_MESSAGES", "EMBED_LINKS"]);
  assert.ok(p.has("SEND_MESSAGES"));
  assert.ok(p.has("EMBED_LINKS"));
});
test("throws on unknown string",  () => assert.throws(() => new Permissions("FAKE_PERM"), RangeError));

suite("Permissions — has()");
const admin = new Permissions("ADMINISTRATOR");
test("admin has ADMINISTRATOR",              () => assert.ok(admin.has("ADMINISTRATOR")));
test("admin has SEND_MESSAGES (bypass)",     () => assert.ok(admin.has("SEND_MESSAGES")));
test("admin has any perm (bypass)",          () => assert.ok(admin.any(["KICK_MEMBERS"])));

const p = new Permissions(["SEND_MESSAGES", "EMBED_LINKS"]);
test("has() true for set perm",              () => assert.ok(p.has("SEND_MESSAGES")));
test("has() false for unset perm",           () => assert.ok(!p.has("KICK_MEMBERS")));
test("has() true for all of array",          () => assert.ok(p.has(["SEND_MESSAGES", "EMBED_LINKS"])));
test("has() false if one missing in array",  () => assert.ok(!p.has(["SEND_MESSAGES", "KICK_MEMBERS"])));

suite("Permissions — any()");
test("any() true if one matches",  () => assert.ok(p.any(["KICK_MEMBERS", "SEND_MESSAGES"])));
test("any() false if none match",  () => assert.ok(!p.any(["KICK_MEMBERS", "BAN_MEMBERS"])));

suite("Permissions — missing()");
test("missing() returns unset perms",  () => {
  const m = p.missing(["SEND_MESSAGES", "KICK_MEMBERS", "BAN_MEMBERS"]);
  assert.deepStrictEqual(m.sort(), ["BAN_MEMBERS", "KICK_MEMBERS"]);
});
test("missing() returns [] when all set",  () => {
  assert.deepStrictEqual(p.missing(["SEND_MESSAGES", "EMBED_LINKS"]), []);
});

suite("Permissions — add() / remove()");
const base = new Permissions(["SEND_MESSAGES"]);
test("add() returns new instance with added perm", () => {
  const p2 = base.add("EMBED_LINKS");
  assert.ok(p2.has("EMBED_LINKS"));
  assert.ok(!base.has("EMBED_LINKS")); // original unchanged
});
test("remove() returns new instance without perm", () => {
  const p2 = base.remove("SEND_MESSAGES");
  assert.ok(!p2.has("SEND_MESSAGES"));
  assert.ok(base.has("SEND_MESSAGES")); // original unchanged
});

suite("Permissions — toArray()");
test("toArray() returns correct names",  () => {
  const p2 = new Permissions(["SEND_MESSAGES", "EMBED_LINKS"]);
  assert.deepStrictEqual(p2.toArray().sort(), ["EMBED_LINKS", "SEND_MESSAGES"]);
});

suite("Permissions.from()");
test("from() works with bigint",  () => assert.ok(Permissions.from(8n).has("ADMINISTRATOR")));
test("resolve() works",           () => assert.strictEqual(Permissions.resolve(["SEND_MESSAGES"]), 1n << 11n));

summary();

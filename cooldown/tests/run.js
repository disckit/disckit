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

const { CooldownManager } = require("../src/index.js");

suite("CooldownManager — basic check");
const cd = new CooldownManager({ default: 5000 });
test("first check is ok",                       () => assert.ok(cd.check("ping", "user1").ok));
test("second check is on cooldown",             () => assert.ok(!cd.check("ping", "user1").ok));
test("different user is ok",                    () => assert.ok(cd.check("ping", "user2").ok));
test("different command same user is ok",       () => assert.ok(cd.check("ban", "user1").ok));
cd.destroy();

suite("CooldownManager — result shape");
const cd2 = new CooldownManager({ default: 10_000 });
cd2.check("cmd", "u");
const r = cd2.check("cmd", "u");
test("ok is false",                         () => assert.strictEqual(r.ok, false));
test("remaining is > 0",                    () => assert.ok(r.remaining > 0));
test("remainingText is a string",           () => assert.strictEqual(typeof r.remainingText, "string"));
test("remainingText contains seconds",      () => assert.ok(r.remainingText.includes("s")));
test("expiresAt is in the future",          () => assert.ok(r.expiresAt > Date.now()));
cd2.destroy();

suite("CooldownManager — per-check duration override");
const cd3 = new CooldownManager({ default: 5000 });
cd3.check("ban", "u", { duration: 30_000 });
const r2 = cd3.check("ban", "u");
test("override duration is applied",  () => assert.ok(r2.remaining > 20_000));
cd3.destroy();

suite("CooldownManager — reset");
const cd4 = new CooldownManager({ default: 5000 });
cd4.check("ping", "u"); // apply cooldown
test("on cooldown before reset",  () => assert.ok(!cd4.check("ping", "u").ok));
cd4.reset("ping", "u");
test("ok after reset",            () => assert.ok(cd4.check("ping", "u").ok));
cd4.destroy();

suite("CooldownManager — resetCommand");
const cd5 = new CooldownManager({ default: 5000 });
cd5.check("ban", "u1"); cd5.check("ban", "u2");
cd5.resetCommand("ban");
test("all users reset after resetCommand",  () => {
  assert.ok(cd5.check("ban", "u1").ok);
  assert.ok(cd5.check("ban", "u2").ok);
});
cd5.destroy();

suite("CooldownManager — bypass");
const cd6 = new CooldownManager({ default: 5000, bypass: ["owner"] });
test("bypassed user is always ok",         () => { cd6.check("ping", "owner"); assert.ok(cd6.check("ping", "owner").ok); });
test("non-bypassed user is on cooldown",   () => { cd6.check("ping", "normal"); assert.ok(!cd6.check("ping", "normal").ok); });
test("addBypass() works",                  () => {
  cd6.addBypass("newmod");
  cd6.check("ping", "newmod");
  assert.ok(cd6.check("ping", "newmod").ok);
});
test("removeBypass() works",               () => {
  cd6.removeBypass("newmod");
  assert.ok(!cd6.isBypassed("newmod"));
});
cd6.destroy();

suite("CooldownManager — peek()");
const cd7 = new CooldownManager({ default: 5000 });
cd7.check("ping", "u"); // apply
const peek1 = cd7.peek("ping", "u");
test("peek returns ok:false when on cooldown",   () => assert.ok(!peek1.ok));
test("peek does not consume cooldown",           () => assert.ok(!cd7.peek("ping", "u").ok));
const peek2 = cd7.peek("ping", "fresh");
test("peek returns ok:true for fresh key",       () => assert.ok(peek2.ok));
test("peek did not apply cooldown",              () => assert.ok(cd7.check("ping", "fresh").ok));
cd7.destroy();

suite("CooldownManager — stats()");
const cd8 = new CooldownManager({ default: 5000, bypass: ["a", "b"] });
cd8.check("ping", "u1"); cd8.check("ping", "u2");
const st = cd8.stats();
test("stats.active counts active cooldowns",  () => assert.strictEqual(st.active, 2));
test("stats.bypassed counts bypass list",     () => assert.strictEqual(st.bypassed, 2));
cd8.destroy();

summary();

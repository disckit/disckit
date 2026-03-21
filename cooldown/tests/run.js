const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { CooldownManager } = require("../src/index.js");

describe("CooldownManager — basic check", () => {
  it("first check is ok",                 () => { const cd = new CooldownManager({ default: 5000 }); assert.ok(cd.check("ping", "u1").ok); cd.destroy(); });
  it("second check is on cooldown",       () => { const cd = new CooldownManager({ default: 5000 }); cd.check("ping", "u1"); assert.ok(!cd.check("ping", "u1").ok); cd.destroy(); });
  it("different user is ok",              () => { const cd = new CooldownManager({ default: 5000 }); cd.check("ping", "u1"); assert.ok(cd.check("ping", "u2").ok); cd.destroy(); });
  it("different command same user is ok", () => { const cd = new CooldownManager({ default: 5000 }); cd.check("ping", "u1"); assert.ok(cd.check("ban", "u1").ok); cd.destroy(); });
});

describe("CooldownManager — result shape", () => {
  it("ok is false after second call",  () => { const cd = new CooldownManager({ default: 10_000 }); cd.check("cmd","u"); assert.strictEqual(cd.check("cmd","u").ok, false); cd.destroy(); });
  it("remaining > 0",                  () => { const cd = new CooldownManager({ default: 10_000 }); cd.check("cmd","u"); assert.ok(cd.check("cmd","u").remaining > 0); cd.destroy(); });
  it("remainingText is string",        () => { const cd = new CooldownManager({ default: 10_000 }); cd.check("cmd","u"); assert.strictEqual(typeof cd.check("cmd","u").remainingText, "string"); cd.destroy(); });
  it("remainingText has time unit",    () => { const cd = new CooldownManager({ default: 10_000 }); cd.check("cmd","u"); assert.ok(cd.check("cmd","u").remainingText.includes("s")); cd.destroy(); });
  it("expiresAt is in the future",     () => { const cd = new CooldownManager({ default: 10_000 }); cd.check("cmd","u"); assert.ok(cd.check("cmd","u").expiresAt > Date.now()); cd.destroy(); });
});

describe("CooldownManager — consume()", () => {
  it("consume() returns void",              () => { const cd = new CooldownManager({ default: 5000 }); assert.strictEqual(cd.consume("cmd","u"), undefined); cd.destroy(); });
  it("key on cooldown after consume",       () => { const cd = new CooldownManager({ default: 5000 }); cd.consume("cmd","u"); assert.ok(!cd.check("cmd","u").ok); cd.destroy(); });
});

describe("CooldownManager — duration override", () => {
  it("override duration is applied", () => {
    const cd = new CooldownManager({ default: 5000 });
    cd.check("ban", "u", { duration: 30_000 });
    assert.ok(cd.check("ban", "u").remaining > 20_000);
    cd.destroy();
  });
});

describe("CooldownManager — reset", () => {
  it("ok after reset", () => {
    const cd = new CooldownManager({ default: 5000 });
    cd.check("ping", "u");
    cd.reset("ping", "u");
    assert.ok(cd.check("ping", "u").ok);
    cd.destroy();
  });
});

describe("CooldownManager — resetCommand", () => {
  it("all users reset after resetCommand", () => {
    const cd = new CooldownManager({ default: 5000 });
    cd.check("ban", "u1"); cd.check("ban", "u2");
    cd.resetCommand("ban");
    assert.ok(cd.check("ban", "u1").ok);
    assert.ok(cd.check("ban", "u2").ok);
    cd.destroy();
  });
});

describe("CooldownManager — bypass", () => {
  it("bypassed user always ok",  () => { const cd = new CooldownManager({ default: 5000, bypass: ["owner"] }); cd.check("ping","owner"); assert.ok(cd.check("ping","owner").ok); cd.destroy(); });
  it("normal user on cooldown",  () => { const cd = new CooldownManager({ default: 5000 }); cd.check("ping","u"); assert.ok(!cd.check("ping","u").ok); cd.destroy(); });
  it("addBypass() works",        () => { const cd = new CooldownManager({ default: 5000 }); cd.addBypass("mod"); cd.check("ping","mod"); assert.ok(cd.check("ping","mod").ok); cd.destroy(); });
  it("removeBypass() works",     () => { const cd = new CooldownManager({ default: 5000 }); cd.addBypass("mod"); cd.removeBypass("mod"); assert.ok(!cd.isBypassed("mod")); cd.destroy(); });
});

describe("CooldownManager — peek()", () => {
  it("peek ok:false on cooldown",    () => { const cd = new CooldownManager({ default: 5000 }); cd.check("ping","u"); assert.ok(!cd.peek("ping","u").ok); cd.destroy(); });
  it("peek does not consume",        () => { const cd = new CooldownManager({ default: 5000 }); cd.peek("ping","u"); assert.ok(cd.check("ping","u").ok); cd.destroy(); });
  it("peek ok:true for fresh key",   () => { const cd = new CooldownManager({ default: 5000 }); assert.ok(cd.peek("ping","fresh").ok); cd.destroy(); });
});

describe("CooldownManager — stats()", () => {
  it("stats.active counts active",   () => { const cd = new CooldownManager({ default: 5000, bypass: ["a","b"] }); cd.check("ping","u1"); cd.check("ping","u2"); assert.strictEqual(cd.stats().active, 2); cd.destroy(); });
  it("stats.bypassed counts bypass", () => { const cd = new CooldownManager({ default: 5000, bypass: ["a","b"] }); assert.strictEqual(cd.stats().bypassed, 2); cd.destroy(); });
});

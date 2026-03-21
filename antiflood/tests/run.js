const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { AntifloodManager, FLOOD_RESULT, PENALTY_MODE, isBlocked, formatRetryAfter } = require("../src/index.js");

describe("AntifloodManager — allowed", () => {
  it("allows within quota", () => {
    const m = new AntifloodManager({ globalRule: { windowMs: 5000, maxHits: 3, penaltyMode: "NONE" } });
    const r = m.check({ userId: "u1", commandName: "ping" });
    assert.strictEqual(r.result, FLOOD_RESULT.ALLOWED);
  });
  it("throttles after maxHits", () => {
    const m = new AntifloodManager({ globalRule: { windowMs: 5000, maxHits: 2, penaltyMode: "NONE" } });
    m.check({ userId: "u1" }); m.check({ userId: "u1" });
    const r = m.check({ userId: "u1" });
    assert.strictEqual(r.result, FLOOD_RESULT.THROTTLED);
  });
  it("different users isolated", () => {
    const m = new AntifloodManager({ globalRule: { windowMs: 5000, maxHits: 1, penaltyMode: "NONE" } });
    m.check({ userId: "u1" });
    const r = m.check({ userId: "u2" });
    assert.strictEqual(r.result, FLOOD_RESULT.ALLOWED);
  });
});

describe("AntifloodManager — penalty", () => {
  it("applies ADDITIVE penalty", () => {
    const m = new AntifloodManager({ globalRule: { windowMs: 5000, maxHits: 1, penaltyMode: "ADDITIVE", penaltyStep: 10000, maxPenalty: 60000 } });
    m.check({ userId: "u1" });
    const r = m.check({ userId: "u1" });
    assert.strictEqual(r.result, FLOOD_RESULT.PENALIZED);
    assert.ok(r.retryAfterMs > 0);
  });
});

describe("AntifloodManager — whitelist", () => {
  it("whitelisted role bypasses", () => {
    const m = new AntifloodManager({
      globalRule: { windowMs: 5000, maxHits: 1, penaltyMode: "NONE" },
      whitelistRoleIds: ["role1"],
    });
    m.check({ userId: "u1" });
    const r = m.check({ userId: "u1", memberRoleIds: ["role1"] });
    assert.strictEqual(r.result, FLOOD_RESULT.WHITELISTED);
  });
  it("addWhitelist() works dynamically", () => {
    const m = new AntifloodManager({ globalRule: { windowMs: 5000, maxHits: 1, penaltyMode: "NONE" } });
    m.check({ userId: "u1" });
    m.addWhitelist("role2");
    const r = m.check({ userId: "u1", memberRoleIds: ["role2"] });
    assert.strictEqual(r.result, FLOOD_RESULT.WHITELISTED);
  });
});

describe("AntifloodManager — reset", () => {
  it("reset() clears user state", () => {
    const m = new AntifloodManager({ globalRule: { windowMs: 5000, maxHits: 1, penaltyMode: "NONE" } });
    m.check({ userId: "u1", commandName: "cmd" });
    m.reset({ userId: "u1", commandName: "cmd" });
    const r = m.check({ userId: "u1", commandName: "cmd" });
    assert.strictEqual(r.result, FLOOD_RESULT.ALLOWED);
  });
});

describe("AntifloodManager — disabled", () => {
  it("disable() allows all", () => {
    const m = new AntifloodManager({ globalRule: { windowMs: 5000, maxHits: 1, penaltyMode: "NONE" } });
    m.check({ userId: "u1" }); m.disable();
    const r = m.check({ userId: "u1" });
    assert.strictEqual(r.result, FLOOD_RESULT.ALLOWED);
  });
});

describe("isBlocked()", () => {
  it("true for THROTTLED",  () => assert.ok(isBlocked({ result: "THROTTLED" })));
  it("true for PENALIZED",  () => assert.ok(isBlocked({ result: "PENALIZED" })));
  it("false for ALLOWED",   () => assert.ok(!isBlocked({ result: "ALLOWED" })));
});

describe("formatRetryAfter()", () => {
  it("returns string",      () => assert.strictEqual(typeof formatRetryAfter(3000), "string"));
  it("contains time unit",  () => assert.ok(formatRetryAfter(3000).length > 0));
});

describe("AntifloodManager — stats() (v1.2.0)", () => {
  it("starts at zero", () => {
    const m = new AntifloodManager({ globalRule: { maxHits: 3, windowMs: 5000 } });
    const s = m.stats();
    assert.strictEqual(s.hits, 0);
    assert.strictEqual(s.blocked, 0);
    assert.strictEqual(s.whitelisted, 0);
    assert.strictEqual(s.ratio, 0);
  });
  it("increments hits on ALLOWED", () => {
    const m = new AntifloodManager({ globalRule: { maxHits: 5, windowMs: 5000 } });
    m.check({ userId: "u1", commandName: "ping" });
    m.check({ userId: "u2", commandName: "ping" });
    assert.strictEqual(m.stats().hits, 2);
  });
  it("increments blocked on THROTTLED", () => {
    const m = new AntifloodManager({ globalRule: { maxHits: 1, windowMs: 10000 } });
    m.check({ userId: "u1", commandName: "cmd" });
    m.check({ userId: "u1", commandName: "cmd" });
    assert.ok(m.stats().blocked >= 1);
  });
  it("increments whitelisted", () => {
    const m = new AntifloodManager({ globalRule: { maxHits: 1, windowMs: 5000 }, whitelistRoleIds: ["r1"] });
    m.check({ userId: "u1", commandName: "cmd", memberRoleIds: ["r1"] });
    assert.strictEqual(m.stats().whitelisted, 1);
    assert.strictEqual(m.stats().hits, 0);
  });
  it("ratio is 0 when no calls", () => {
    const m = new AntifloodManager();
    assert.strictEqual(m.stats().ratio, 0);
  });
  it("ratio is between 0 and 1", () => {
    const m = new AntifloodManager({ globalRule: { maxHits: 1, windowMs: 10000 } });
    m.check({ userId: "u1", commandName: "x" });
    m.check({ userId: "u1", commandName: "x" });
    const r = m.stats().ratio;
    assert.ok(r >= 0 && r <= 1);
  });
  it("resetStats() clears counters", () => {
    const m = new AntifloodManager({ globalRule: { maxHits: 5, windowMs: 5000 } });
    m.check({ userId: "u1", commandName: "ping" });
    m.resetStats();
    assert.strictEqual(m.stats().hits, 0);
  });
});

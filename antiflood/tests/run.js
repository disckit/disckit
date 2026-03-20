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

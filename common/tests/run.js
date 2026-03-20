const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  StringUtils, TimeUtils, ArrayUtils, RandomUtils, AsyncUtils,
  sleep, chunk, randomInt, formatTime, truncate, isHexColor, containsLink,
  containsDiscordInvite, isBlank, escapeMarkdown, codeBlock, DISCORD, TIME
} = require("../src/index.js");

describe("StringUtils", () => {
  it("containsLink detects URL",            () => assert.ok(StringUtils.containsLink("visit https://example.com")));
  it("containsLink false for plain text",   () => assert.ok(!StringUtils.containsLink("hello world")));
  it("containsDiscordInvite detects invite",() => assert.ok(StringUtils.containsDiscordInvite("discord.gg/abc")));
  it("isHexColor valid",                    () => assert.ok(StringUtils.isHexColor("#FF0000")));
  it("isHexColor invalid",                  () => assert.ok(!StringUtils.isHexColor("red")));
  it("truncate long string",                () => assert.strictEqual(StringUtils.truncate("hello world", 8), "hello..."));
  it("truncate short string unchanged",     () => assert.strictEqual(StringUtils.truncate("hi", 10), "hi"));
  it("capitalize",                          () => assert.strictEqual(StringUtils.capitalize("hello"), "Hello"));
  it("isBlank true for spaces",             () => assert.ok(StringUtils.isBlank("   ")));
  it("isBlank false for text",              () => assert.ok(!StringUtils.isBlank("hi")));
  it("escapeMarkdown escapes *",            () => assert.ok(StringUtils.escapeMarkdown("*bold*").includes("\\*")));
  it("codeBlock wraps in backticks",        () => assert.ok(StringUtils.codeBlock("code").includes("```")));
  it("inlineCode wraps in backtick",        () => assert.strictEqual(StringUtils.inlineCode("x"), "`x`"));
});

describe("TimeUtils", () => {
  it("formatTime seconds",          () => assert.ok(TimeUtils.formatTime(65).includes("minuto")));
  it("formatTime zero",             () => assert.strictEqual(TimeUtils.formatTime(0), "0 segundos"));
  it("formatTimeShort",             () => assert.ok(TimeUtils.formatTimeShort(65).includes("m")));
  it("durationToMillis 1:00",       () => assert.strictEqual(TimeUtils.durationToMillis("1:00"), 60000));
  it("diffHours same date",         () => assert.strictEqual(TimeUtils.diffHours(new Date(), new Date()), 0));
  it("formatUptime",                () => assert.strictEqual(typeof TimeUtils.formatUptime(5000), "string"));
  it("msToSeconds",                 () => assert.strictEqual(TimeUtils.msToSeconds(2000), 2));
  it("secondsToMs",                 () => assert.strictEqual(TimeUtils.secondsToMs(2), 2000));
});

describe("ArrayUtils", () => {
  it("chunk splits array",          () => assert.deepStrictEqual(ArrayUtils.chunk([1,2,3,4], 2), [[1,2],[3,4]]));
  it("chunk empty array",           () => assert.deepStrictEqual(ArrayUtils.chunk([], 2), []));
  it("deduplicate removes dupes",   () => assert.deepStrictEqual(ArrayUtils.deduplicate([1,1,2,3]), [1,2,3]));
  it("flatten one level",           () => assert.deepStrictEqual(ArrayUtils.flatten([[1,2],[3]]), [1,2,3]));
  it("last returns last element",   () => assert.strictEqual(ArrayUtils.last([1,2,3]), 3));
  it("last empty returns undefined",() => assert.strictEqual(ArrayUtils.last([]), undefined));
  it("partition splits correctly",  () => { const [a,b] = ArrayUtils.partition([1,2,3,4], x => x%2===0); assert.deepStrictEqual(a,[2,4]); assert.deepStrictEqual(b,[1,3]); });
});

describe("RandomUtils", () => {
  it("randomInt in range",          () => { const n = RandomUtils.randomInt(10); assert.ok(n >= 0 && n < 10); });
  it("randomIntBetween in range",   () => { const n = RandomUtils.randomIntBetween(5,10); assert.ok(n >= 5 && n <= 10); });
  it("chance returns boolean",      () => assert.strictEqual(typeof RandomUtils.chance(0.5), "boolean"));
  it("randomFrom picks element",    () => assert.ok([1,2,3].includes(RandomUtils.randomFrom([1,2,3]))));
});

describe("AsyncUtils", () => {
  it("sleep resolves after ms",     async () => { const t = Date.now(); await AsyncUtils.sleep(10); assert.ok(Date.now() - t >= 8); });
  it("retry succeeds after fail",   async () => { let i=0; const r = await AsyncUtils.retry(async () => { if(i++<1) throw new Error("fail"); return 42; }, 3, 0); assert.strictEqual(r, 42); });
  it("withTimeout resolves ok",     async () => { const r = await AsyncUtils.withTimeout(Promise.resolve(1), 100); assert.strictEqual(r, 1); });
  it("withTimeout rejects on slow", async () => { await assert.rejects(AsyncUtils.withTimeout(new Promise(r => setTimeout(r,200)), 10)); });
});

describe("Top-level exports", () => {
  it("sleep exported",       () => assert.strictEqual(typeof sleep, "function"));
  it("chunk exported",       () => assert.deepStrictEqual(chunk([1,2,3], 2), [[1,2],[3]]));
  it("randomInt exported",   () => assert.strictEqual(typeof randomInt(5), "number"));
  it("formatTime exported",  () => assert.strictEqual(typeof formatTime(60), "string"));
  it("truncate exported",    () => assert.strictEqual(typeof truncate("hi", 10), "string"));
  it("isHexColor exported",  () => assert.ok(isHexColor("#AABBCC")));
  it("isBlank exported",     () => assert.ok(isBlank("")));
  it("DISCORD constant",     () => assert.ok(DISCORD.MAX_MESSAGE_LENGTH > 0));
  it("TIME constant",        () => assert.strictEqual(TIME.SECOND, 1000));
});

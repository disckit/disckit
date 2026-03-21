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

describe("StringUtils — new helpers (v1.2.0)", () => {
  it("isSnowflake valid 18-digit",    () => assert.ok(StringUtils.isSnowflake("123456789012345678")));
  it("isSnowflake valid 20-digit",    () => assert.ok(StringUtils.isSnowflake("12345678901234567890")));
  it("isSnowflake rejects short",     () => assert.ok(!StringUtils.isSnowflake("12345")));
  it("isSnowflake rejects non-digit", () => assert.ok(!StringUtils.isSnowflake("12345678901234abc")));
  it("isSnowflake rejects empty",     () => assert.ok(!StringUtils.isSnowflake("")));
  it("mentionUser formats correctly", () => assert.strictEqual(StringUtils.mentionUser("123"), "<@123>"));
  it("mentionRole formats correctly", () => assert.strictEqual(StringUtils.mentionRole("456"), "<@&456>"));
  it("mentionChannel formats correctly", () => assert.strictEqual(StringUtils.mentionChannel("789"), "<#789>"));
});

describe("TimeUtils — toDiscordTimestamp (v1.2.0)", () => {
  const date = new Date("2024-01-15T12:00:00Z");
  const unix  = Math.floor(date.getTime() / 1000);
  it("default format is f",          () => assert.strictEqual(TimeUtils.toDiscordTimestamp(date), `<t:${unix}:f>`));
  it("R format (relative)",          () => assert.strictEqual(TimeUtils.toDiscordTimestamp(date, "R"), `<t:${unix}:R>`));
  it("D format (long date)",         () => assert.strictEqual(TimeUtils.toDiscordTimestamp(date, "D"), `<t:${unix}:D>`));
  it("accepts ms timestamp (number)", () => assert.strictEqual(TimeUtils.toDiscordTimestamp(date.getTime(), "t"), `<t:${unix}:t>`));
});

describe("DISCORD constants — new fields (v1.2.0)", () => {
  it("MAX_SELECT_OPTIONS is 25",      () => assert.strictEqual(DISCORD.MAX_SELECT_OPTIONS, 25));
  it("MAX_BUTTON_LABEL is 80",        () => assert.strictEqual(DISCORD.MAX_BUTTON_LABEL, 80));
  it("MAX_MODAL_TITLE is 45",         () => assert.strictEqual(DISCORD.MAX_MODAL_TITLE, 45));
  it("MAX_MODAL_COMPONENTS is 5",     () => assert.strictEqual(DISCORD.MAX_MODAL_COMPONENTS, 5));
  it("MAX_MEDIA_GALLERY_ITEMS is 10", () => assert.strictEqual(DISCORD.MAX_MEDIA_GALLERY_ITEMS, 10));
  it("EPOCH is a bigint",             () => assert.strictEqual(typeof DISCORD.EPOCH, "bigint"));
});

describe("Top-level new exports (v1.2.0)", () => {
  const { isSnowflake, mentionUser, mentionRole, mentionChannel, toDiscordTimestamp } = require("../src/index.js");
  it("isSnowflake exported",          () => assert.ok(isSnowflake("123456789012345678")));
  it("mentionUser exported",          () => assert.strictEqual(mentionUser("1"), "<@1>"));
  it("mentionRole exported",          () => assert.strictEqual(mentionRole("2"), "<@&2>"));
  it("mentionChannel exported",       () => assert.strictEqual(mentionChannel("3"), "<#3>"));
  it("toDiscordTimestamp exported",   () => assert.ok(toDiscordTimestamp(Date.now()).startsWith("<t:")));
});

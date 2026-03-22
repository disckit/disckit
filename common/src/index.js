/**
 * @disckit/common — Foundation utilities for Discord bots and dashboards.
 *
 * @example
 * const { StringUtils, TimeUtils, ArrayUtils } = require("@disckit/common");
 * const { sleep, formatTime, chunk } = require("@disckit/common");
 */

const StringUtils = require("./utils/StringUtils");
const TimeUtils   = require("./utils/TimeUtils");
const ArrayUtils  = require("./utils/ArrayUtils");
const RandomUtils = require("./utils/RandomUtils");
const AsyncUtils  = require("./utils/AsyncUtils");
const constants   = require("./constants/index");

module.exports = {
  StringUtils, TimeUtils, ArrayUtils, RandomUtils, AsyncUtils,

  DISCORD:      constants.DISCORD,
  TIME:         constants.TIME,
  TIME_SECONDS: constants.TIME_SECONDS,

  // Top-level convenience exports
  sleep:                  AsyncUtils.sleep,
  chunk:                  ArrayUtils.chunk,
  randomInt:              RandomUtils.randomInt,
  randomIntBetween:       RandomUtils.randomIntBetween,
  randomFrom:             RandomUtils.randomFrom,
  formatTime:             TimeUtils.formatTime,
  formatTimeShort:        TimeUtils.formatTimeShort,
  toDiscordTimestamp:     TimeUtils.toDiscordTimestamp,
  isSnowflake:            StringUtils.isSnowflake,
  mentionUser:            StringUtils.mentionUser,
  mentionRole:            StringUtils.mentionRole,
  mentionChannel:         StringUtils.mentionChannel,
  diffHours:              TimeUtils.diffHours,
  truncate:               StringUtils.truncate,
  capitalize:             StringUtils.capitalize,
  isHexColor:             StringUtils.isHexColor,
  containsLink:           StringUtils.containsLink,
  containsDiscordInvite:  StringUtils.containsDiscordInvite,
  isBlank:                StringUtils.isBlank,
  escapeMarkdown:         StringUtils.escapeMarkdown,
  codeBlock:              StringUtils.codeBlock,
  inlineCode:             StringUtils.inlineCode,
  normalizeSpaces:        StringUtils.normalizeSpaces,
  truncateMiddle:         StringUtils.truncateMiddle,
  randomFloat:            RandomUtils.randomFloat,
  formatUptime:           TimeUtils.formatUptime,
  msToSeconds:            TimeUtils.msToSeconds,
  secondsToMs:            TimeUtils.secondsToMs,
  getRemainingTime:       TimeUtils.getRemainingTime,
};

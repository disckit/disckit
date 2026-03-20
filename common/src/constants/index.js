/**
 * Constants — Shared constants for Enerthya.
 * Equivalent to constants in Loritta's `common` module.
 */

/** Discord limits */
const DISCORD = {
  MAX_EMBED_TITLE: 256,
  MAX_EMBED_DESCRIPTION: 4096,
  MAX_EMBED_FIELDS: 25,
  MAX_EMBED_FIELD_NAME: 256,
  MAX_EMBED_FIELD_VALUE: 1024,
  MAX_EMBED_FOOTER: 2048,
  MAX_EMBED_AUTHOR: 256,
  MAX_MESSAGE_LENGTH: 2000,
  MAX_AUTOCOMPLETE_OPTIONS: 25,
};

/** Common time values in milliseconds */
const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
};

/** Common time values in seconds */
const TIME_SECONDS = {
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
  WEEK: 604800,
};

/** Package metadata */
const PACKAGE = {
  NAME: "@disckit/common",
  VERSION: "1.0.0",
};

module.exports = {
  DISCORD,
  TIME,
  TIME_SECONDS,
  PACKAGE,
};

/**
 * Constants — Shared constants for Enerthya.
 * Equivalent to constants in Loritta's `common` module.
 */

/** Discord limits */
const DISCORD = {
  // Embed
  MAX_EMBED_TITLE:        256,
  MAX_EMBED_DESCRIPTION:  4096,
  MAX_EMBED_FIELDS:       25,
  MAX_EMBED_FIELD_NAME:   256,
  MAX_EMBED_FIELD_VALUE:  1024,
  MAX_EMBED_FOOTER:       2048,
  MAX_EMBED_AUTHOR:       256,
  // Messages
  MAX_MESSAGE_LENGTH:     2000,
  // Slash
  MAX_AUTOCOMPLETE_OPTIONS: 25,
  // Interactions
  MAX_SELECT_OPTIONS:     25,
  MAX_BUTTON_LABEL:       80,
  MAX_ACTION_ROWS:        5,
  // Modals
  MAX_MODAL_TITLE:        45,
  MAX_MODAL_COMPONENTS:   5,
  MAX_MODAL_TEXT_LABEL:   45,
  MAX_MODAL_PLACEHOLDER:  100,
  MAX_MODAL_VALUE:        4000,
  // Components V2
  MAX_MEDIA_GALLERY_ITEMS: 10,
  // Guild
  MAX_GUILD_NAME:         100,
  MAX_ROLE_NAME:          100,
  MAX_CHANNEL_NAME:       100,
  // Snowflake epoch (Discord epoch: Jan 1, 2015)
  EPOCH:                  1420070400000n,
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

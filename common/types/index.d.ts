// @disckit/common — TypeScript definitions

export interface StringUtilsType {
  containsLink(text: string): boolean;
  containsDiscordInvite(text: string): boolean;
  isHexColor(text: string): boolean;
  truncate(text: string, maxLength: number, suffix?: string): string;
  capitalize(text: string): string;
  normalizeSpaces(text: string): string;
  isBlank(text: string): boolean;
  escapeMarkdown(text: string): string;
  codeBlock(text: string, lang?: string): string;
  inlineCode(text: string): string;
  truncateMiddle(text: string, maxLen?: number, separator?: string): string;
  isSnowflake(id: string | number): boolean;
  mentionUser(id: string | number): string;
  mentionRole(id: string | number): string;
  mentionChannel(id: string | number): string;
}

export interface TimeUtilsType {
  formatTime(totalSeconds: number): string;
  formatTimeShort(totalSeconds: number): string;
  durationToMillis(duration: string): number;
  getRemainingTime(futureDate: Date): string;
  diffHours(dt1: Date, dt2: Date): number;
  formatUptime(ms: number): string;
  msToSeconds(ms: number): number;
  secondsToMs(s: number): number;
  toDiscordTimestamp(date: Date | number, format?: 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R'): string;
}

export interface ArrayUtilsType {
  chunk<T>(array: T[], size: number): T[][];
  randomPick<T>(array: T[]): T | undefined;
  shuffle<T>(array: T[]): T[];
  deduplicate<T>(array: T[]): T[];
  flatten<T>(array: T[][]): T[];
  partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]];
  last<T>(array: T[]): T | undefined;
}

export interface RandomUtilsType {
  randomInt(max: number): number;
  randomIntBetween(min: number, max: number): number;
  randomFloat(): number;
  chance(probability: number): boolean;
  randomFrom<T>(array: T[]): T | undefined;
}

export interface AsyncUtilsType {
  sleep(ms: number): Promise<void>;
  withTimeout<T>(promise: Promise<T>, ms: number, message?: string): Promise<T>;
  retry<T>(fn: () => Promise<T>, times?: number, delayMs?: number): Promise<T>;
  batchProcess<T, R>(items: T[], batchSize: number, fn: (item: T) => Promise<R>): Promise<R[]>;
}

export declare const StringUtils: StringUtilsType;
export declare const TimeUtils: TimeUtilsType;
export declare const ArrayUtils: ArrayUtilsType;
export declare const RandomUtils: RandomUtilsType;
export declare const AsyncUtils: AsyncUtilsType;

export declare const DISCORD: Readonly<{
  MAX_EMBED_TITLE: number; MAX_EMBED_DESCRIPTION: number; MAX_EMBED_FIELDS: number;
  MAX_EMBED_FIELD_NAME: number; MAX_EMBED_FIELD_VALUE: number; MAX_EMBED_FOOTER: number;
  MAX_EMBED_AUTHOR: number; MAX_MESSAGE_LENGTH: number; MAX_AUTOCOMPLETE_OPTIONS: number;
  MAX_SELECT_OPTIONS: number; MAX_BUTTON_LABEL: number; MAX_ACTION_ROWS: number;
  MAX_MODAL_TITLE: number; MAX_MODAL_COMPONENTS: number; MAX_MODAL_TEXT_LABEL: number;
  MAX_MODAL_PLACEHOLDER: number; MAX_MODAL_VALUE: number;
  MAX_MEDIA_GALLERY_ITEMS: number;
  MAX_GUILD_NAME: number; MAX_ROLE_NAME: number; MAX_CHANNEL_NAME: number;
  EPOCH: bigint;
}>;

export declare const TIME: Readonly<{ SECOND: number; MINUTE: number; HOUR: number; DAY: number; WEEK: number }>;
export declare const TIME_SECONDS: Readonly<{ MINUTE: number; HOUR: number; DAY: number; WEEK: number }>;

export declare function sleep(ms: number): Promise<void>;
export declare function chunk<T>(array: T[], size: number): T[][];
export declare function randomInt(max: number): number;
export declare function randomIntBetween(min: number, max: number): number;
export declare function randomFrom<T>(array: T[]): T | undefined;
export declare function formatTime(totalSeconds: number): string;
export declare function formatTimeShort(totalSeconds: number): string;
export declare function diffHours(dt1: Date, dt2: Date): number;
export declare function getRemainingTime(futureDate: Date): string;
export declare function truncate(text: string, maxLength: number, suffix?: string): string;
export declare function capitalize(text: string): string;
export declare function isHexColor(text: string): boolean;
export declare function containsLink(text: string): boolean;
export declare function containsDiscordInvite(text: string): boolean;
export declare function isBlank(text: string): boolean;
export declare function escapeMarkdown(text: string): string;
export declare function codeBlock(text: string, lang?: string): string;
export declare function inlineCode(text: string): string;
export declare function isSnowflake(id: string | number): boolean;
export declare function mentionUser(id: string | number): string;
export declare function mentionRole(id: string | number): string;
export declare function mentionChannel(id: string | number): string;
export declare function toDiscordTimestamp(date: Date | number, format?: 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R'): string;

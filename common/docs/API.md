# API Reference — @disckit/common

## StringUtils

| Function | Signature | Description |
|----------|-----------|-------------|
| `containsLink` | `(text: string) => boolean` | Returns `true` if the string contains a URL |
| `containsDiscordInvite` | `(text: string) => boolean` | Returns `true` if the string contains a Discord invite |
| `isHexColor` | `(text: string) => boolean` | Returns `true` if the string is a valid `#RRGGBB` color |
| `truncate` | `(text, maxLength, suffix?) => string` | Truncate with ellipsis. Default suffix: `"..."` |
| `capitalize` | `(text: string) => string` | Uppercase first letter |
| `normalizeSpaces` | `(text: string) => string` | Trim and collapse internal whitespace |
| `isBlank` | `(text: string) => boolean` | `true` if empty or only whitespace |
| `escapeMarkdown` | `(text: string) => string` | Escape `* _ \` ~ | \\` |
| `codeBlock` | `(text, lang?) => string` | Wrap in ` ``` ` fenced block |
| `inlineCode` | `(text: string) => string` | Wrap in `` ` `` |

---

## TimeUtils

| Function | Signature | Description |
|----------|-----------|-------------|
| `formatTime` | `(totalSeconds: number) => string` | PT-BR: `"1 hora, 30 minutos"` |
| `formatTimeShort` | `(totalSeconds: number) => string` | Short: `"1h 30m"` |
| `durationToMillis` | `(duration: string) => number` | `"1:30:00"` → `5400000` |
| `getRemainingTime` | `(futureDate: Date) => string` | Human-readable time until a future date |
| `diffHours` | `(dt1, dt2: Date) => number` | Hour difference between two dates |
| `formatUptime` | `(ms: number) => string` | Uptime in ms → human-readable |
| `msToSeconds` | `(ms: number) => number` | `2000` → `2` |
| `secondsToMs` | `(s: number) => number` | `2` → `2000` |

---

## ArrayUtils

| Function | Signature | Description |
|----------|-----------|-------------|
| `chunk` | `(array, size) => T[][]` | Split into chunks of `size` |
| `randomPick` | `(array) => T \| undefined` | Random element |
| `shuffle` | `(array) => T[]` | Fisher-Yates shuffle (in place) |
| `deduplicate` | `(array) => T[]` | Remove duplicates (uses `Set`) |
| `flatten` | `(array) => T[]` | Flatten one level deep |
| `partition` | `(array, predicate) => [T[], T[]]` | Split into `[passing, failing]` |
| `last` | `(array) => T \| undefined` | Last element |

---

## RandomUtils

| Function | Signature | Description |
|----------|-----------|-------------|
| `randomInt` | `(max: number) => number` | Random integer `[0, max)` |
| `randomIntBetween` | `(min, max) => number` | Random integer `[min, max]` |
| `randomFloat` | `() => number` | Random float `[0, 1)` |
| `chance` | `(probability: number) => boolean` | `true` with given probability |
| `randomFrom` | `(array) => T \| undefined` | Random element |

---

## AsyncUtils

| Function | Signature | Description |
|----------|-----------|-------------|
| `sleep` | `(ms: number) => Promise<void>` | Wait for `ms` milliseconds |
| `withTimeout` | `(promise, ms, message?) => Promise<T>` | Reject if promise takes longer than `ms` |
| `retry` | `(fn, times?, delayMs?) => Promise<T>` | Retry async function up to `times` times |
| `batchProcess` | `(items, batchSize, fn) => Promise<T[]>` | Process in batches |

---

## Constants

### `DISCORD`

```ts
MAX_EMBED_TITLE: 256        MAX_EMBED_DESCRIPTION: 4096   MAX_EMBED_FIELDS: 25
MAX_EMBED_FIELD_NAME: 256   MAX_EMBED_FIELD_VALUE: 1024   MAX_EMBED_FOOTER: 2048
MAX_EMBED_AUTHOR: 256       MAX_MESSAGE_LENGTH: 2000       MAX_AUTOCOMPLETE_OPTIONS: 25
```

### `TIME` (milliseconds)

```ts
SECOND: 1000   MINUTE: 60_000   HOUR: 3_600_000   DAY: 86_400_000   WEEK: 604_800_000
```

### `TIME_SECONDS`

```ts
MINUTE: 60   HOUR: 3600   DAY: 86400   WEEK: 604800
```

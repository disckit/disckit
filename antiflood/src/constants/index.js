// Antiflood — constants

const FLOOD_RESULT = Object.freeze({
  ALLOWED: "ALLOWED",   // request passed
  THROTTLED: "THROTTLED", // rate limit exceeded — caller should reject
  PENALIZED: "PENALIZED", // rate limit exceeded + progressive penalty applied
  WHITELISTED: "WHITELISTED", // bypassed due to whitelist
});

const PENALTY_MODE = Object.freeze({
  NONE: "NONE",        // no progressive penalty — just block until window expires
  ADDITIVE: "ADDITIVE",    // each excess hit adds penaltyStep ms to the lock
  EXPONENTIAL: "EXPONENTIAL", // each excess hit doubles the lock duration
});

// Default rule applied when no custom config is provided
const DEFAULT_RULE = Object.freeze({
  windowMs: 5000,  // sliding window size in ms
  maxHits: 3,     // allowed hits per window
  penaltyMode: PENALTY_MODE.ADDITIVE,
  penaltyStep: 5000,  // ms added per excess hit (ADDITIVE) or base for EXPONENTIAL
  maxPenalty: 60000, // hard cap on penalty duration (ms)
});

module.exports = { FLOOD_RESULT, PENALTY_MODE, DEFAULT_RULE };

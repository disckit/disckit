// @disckit/antiflood — ESM entry point
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("../src/index.js");

export const AntifloodManager = pkg.AntifloodManager;
export const BucketStore      = pkg.BucketStore;
export const createRule       = pkg.createRule;
export const FLOOD_RESULT     = pkg.FLOOD_RESULT;
export const PENALTY_MODE     = pkg.PENALTY_MODE;
export const DEFAULT_RULE     = pkg.DEFAULT_RULE;
export const formatRetryAfter = pkg.formatRetryAfter;
export const isBlocked        = pkg.isBlocked;

export default pkg;

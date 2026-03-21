// @disckit/cache — ESM entry point
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("../src/index.js");

export const LRUCache        = pkg.LRUCache;
export const TTLCache        = pkg.TTLCache;
export const createCache     = pkg.createCache;
export const DEFAULT_MAX_SIZE = pkg.DEFAULT_MAX_SIZE;
export const DEFAULT_TTL_MS  = pkg.DEFAULT_TTL_MS;

export default pkg;

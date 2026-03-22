// @disckit/caffeine — ESM entry point
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("../src/index.js");

export const CacheBuilder                = pkg.CacheBuilder;
export const CaffeineCache               = pkg.CaffeineCache;
export const DEFAULT_MAX_SIZE            = pkg.DEFAULT_MAX_SIZE;
export const DEFAULT_EXPIRE_AFTER_WRITE  = pkg.DEFAULT_EXPIRE_AFTER_WRITE;
export const DEFAULT_EXPIRE_AFTER_ACCESS = pkg.DEFAULT_EXPIRE_AFTER_ACCESS;
export const DEFAULT_REFRESH_AFTER_WRITE = pkg.DEFAULT_REFRESH_AFTER_WRITE;

export default pkg;

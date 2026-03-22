// @disckit/placeholders — ESM entry point
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("../src/index.js");

export const applyPlaceholders        = pkg.applyPlaceholders;
export const detectPlaceholders       = pkg.detectPlaceholders;
export const hasPlaceholders          = pkg.hasPlaceholders;
export const buildPreviewContext      = pkg.buildPreviewContext;
export const applyPresencePlaceholders = pkg.applyPresencePlaceholders;
export const buildPresenceContext     = pkg.buildPresenceContext;
export const VARIABLES                = pkg.VARIABLES;
export const getByGroup               = pkg.getByGroup;
export const getAllKeys                = pkg.getAllKeys;
export const findByKey                = pkg.findByKey;

export default pkg;

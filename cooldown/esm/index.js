// @disckit/cooldown — ESM entry point
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("../src/index.js");

export const CooldownManager = pkg.CooldownManager;

export default pkg;

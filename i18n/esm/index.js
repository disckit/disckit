// @disckit/i18n — ESM entry point
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("../src/index.js");

export const I18n    = pkg.I18n;
export const createT = pkg.createT;

export default pkg;

// @disckit/permissions — ESM entry point
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("../src/index.js");

export const Permissions     = pkg.Permissions;
export const PermissionsBits = pkg.PermissionsBits;

export default pkg;

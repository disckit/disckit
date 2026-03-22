// @disckit/paginator — ESM entry point
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("../src/index.js");

export const paginate  = pkg.paginate;
export const fromQuery = pkg.fromQuery;
export const Paginator = pkg.Paginator;

export default pkg;

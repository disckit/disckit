/**
 * PackageValidator — Validates Enerthya package structure at runtime.
 * Throws a clear error citing the missing file name if any required file is absent.
 * Inspired by Loritta's internal module validation approach.
 */

const fs = require("fs");
const path = require("path");

const REQUIRED_FILES = [
  "src/index.js",
  "test.js",
  "package.json",
  "README.md",
];

const REQUIRED_SRC_DIRS = ["src"];

/**
 * Validate the structure of a package folder.
 * Throws an error citing the exact missing file if validation fails.
 * @param {string} packageRoot - Absolute path to the package root
 * @returns {{ valid: boolean, missing: string[] }}
 */
function validatePackageStructure(packageRoot) {
  const missing = [];

  for (const requiredFile of REQUIRED_FILES) {
    const fullPath = path.join(packageRoot, requiredFile);
    if (!fs.existsSync(fullPath)) {
      missing.push(requiredFile);
    }
  }

  for (const requiredDir of REQUIRED_SRC_DIRS) {
    const fullPath = path.join(packageRoot, requiredDir);
    if (!fs.existsSync(fullPath) || !fs.lstatSync(fullPath).isDirectory()) {
      if (!missing.includes(requiredDir + "/")) {
        missing.push(requiredDir + "/");
      }
    }
  }

  if (missing.length > 0) {
    const packageName = path.basename(packageRoot);
    const errorMsg = [
      `[PackageValidator] Package "${packageName}" is missing required files:`,
      ...missing.map((f) => `  - ${f}  ← MISSING in packages/${packageName}/${f}`),
      `Fix the structure before publishing or integrating this package.`,
    ].join("\n");
    throw new Error(errorMsg);
  }

  return { valid: true, missing: [] };
}

/**
 * Check if a src/index.js exports the expected named exports.
 * Logs a warning for each missing export (does not throw).
 * @param {string} packageRoot
 * @param {string[]} expectedExports
 */
function checkExports(packageRoot, expectedExports) {
  const indexPath = path.join(packageRoot, "src", "index.js");
  if (!fs.existsSync(indexPath)) return;

  const mod = require(indexPath);
  const warnings = [];

  for (const exp of expectedExports) {
    if (typeof mod[exp] === "undefined") {
      warnings.push(`  - "${exp}" is expected but not exported from src/index.js`);
    }
  }

  if (warnings.length > 0) {
    const packageName = path.basename(packageRoot);
    console.warn(`[PackageValidator] Warnings for "${packageName}":`);
    warnings.forEach((w) => console.warn(w));
  }
}

module.exports = {
  validatePackageStructure,
  checkExports,
};

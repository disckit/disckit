#!/usr/bin/env node
"use strict";

const fs   = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ── ANSI ──────────────────────────────────────────────────────────────────────

const C = {
  reset: "\x1b[0m", bold: "\x1b[1m", dim: "\x1b[2m", italic: "\x1b[3m",
  cyan: "\x1b[36m", green: "\x1b[32m", yellow: "\x1b[33m",
  red: "\x1b[31m", pink: "\x1b[35m", blue: "\x1b[34m", white: "\x1b[37m",
  bgCyan: "\x1b[46m", bgPink: "\x1b[45m",
  up: (n) => `\x1b[${n}A`,
  clearLine: "\x1b[2K\r",
};
const c = (col, txt) => `${C[col] || ""}${txt}${C.reset}`;

// ── Arrow-key select (zero deps) ──────────────────────────────────────────────

/**
 * Renders a styled select menu with arrow-key navigation.
 * @param {{ label: string, value: string, hint?: string, disabled?: boolean, disabledReason?: string }[]} options
 * @param {string} question
 * @returns {Promise<string>} chosen value
 */
function select(question, options) {
  return new Promise((resolve) => {
    let cursor = 0;
    // Skip disabled on start
    while (options[cursor]?.disabled) cursor++;

    const render = (clear = false) => {
      if (clear) {
        // Move up and clear all rendered lines
        const lines = 2 + options.length;
        process.stdout.write(C.up(lines) + Array(lines).fill(C.clearLine).join("\n") + C.up(lines));
      }

      process.stdout.write(`\n  ${c("bold", question)}\n`);
      options.forEach((opt, i) => {
        const selected = i === cursor;
        const disabled = !!opt.disabled;

        const pointer = selected ? c("pink", " ❯ ") : "   ";
        let label;

        if (disabled) {
          label = c("dim", opt.label);
        } else if (selected) {
          label = c("bold", c("white", opt.label));
        } else {
          label = c("dim", opt.label);
        }

        const hint = opt.hint && !disabled
          ? c("dim", ` — ${opt.hint}`)
          : "";

        const disabledNote = disabled && opt.disabledReason
          ? c("dim", c("yellow", `  ← ${opt.disabledReason}`))
          : "";

        process.stdout.write(`${pointer}${label}${hint}${disabledNote}\n`);
      });
    };

    render(false);

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    const onKey = (key) => {
      // Ctrl+C
      if (key === "\u0003") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        console.log();
        process.exit(0);
      }

      // Up arrow
      if (key === "\u001B\u005B\u0041") {
        let next = cursor - 1;
        while (next >= 0 && options[next]?.disabled) next--;
        if (next >= 0) cursor = next;
        render(true);
        return;
      }

      // Down arrow
      if (key === "\u001B\u005B\u0042") {
        let next = cursor + 1;
        while (next < options.length && options[next]?.disabled) next++;
        if (next < options.length) cursor = next;
        render(true);
        return;
      }

      // Enter
      if (key === "\r" || key === "\n") {
        const chosen = options[cursor];
        if (chosen.disabled) return; // can't select disabled

        process.stdin.removeListener("data", onKey);
        process.stdin.setRawMode(false);
        process.stdin.pause();

        // Replace menu with final answer line
        const lines = 2 + options.length;
        process.stdout.write(C.up(lines) + Array(lines).fill(C.clearLine).join("\n") + C.up(lines));
        process.stdout.write(`\n  ${c("dim", question)}\n  ${c("pink", "❯")} ${c("bold", chosen.label)}\n`);

        resolve(chosen.value);
      }
    };

    process.stdin.on("data", onKey);
  });
}

// ── Text input ────────────────────────────────────────────────────────────────

function input(question, defaultVal = "") {
  return new Promise((resolve) => {
    const { createInterface } = require("readline");
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const q  = `\n  ${c("bold", question)}${defaultVal ? c("dim", ` (${defaultVal})`) : ""}: `;
    rl.question(q, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultVal);
    });
  });
}

// ── i18n ──────────────────────────────────────────────────────────────────────

const T = {
  en: {
    q_lang:      "Language",
    q_name:      "Project name",
    q_variant:   "Language",
    q_module:    "Module system",
    q_features:  "Features  (use ↑↓ to navigate)",
    q_install:   "Install dependencies",
    sub:         "scaffold a Discord bot with @disckit pre-configured",
    err_name:    "Invalid name — use letters, numbers, hyphens or underscores.",
    err_exists:  (n) => `Directory "${n}" already exists.`,
    err_exists2: "Choose a different name or delete the existing folder.",
    opt: {
      js:       { label: "JavaScript",  hint: ".js files" },
      ts:       { label: "TypeScript",  hint: ".ts files + tsconfig" },
      cjs:      { label: "CommonJS",    hint: "require / module.exports" },
      esm:      { label: "ESM",         hint: "import / export  (type:module)" },
      mongo:    { label: "MongoDB",     hint: "Mongoose models (coming soon)", disabled: true, disabledReason: "not available yet" },
      install:  { label: "Yes, install now" },
      skip:     { label: "Skip, I'll install later" },
      en:       { label: "English" },
      pt:       { label: "Português" },
    },
    done:        "Done! Your bot is ready.",
    steps:       "Next steps:",
    step1:       (n) => `cd ${c("cyan", n)}`,
    step2:       `Fill in ${c("yellow", ".env")} with your tokens`,
    step3_js:    `node src/deploy.js   ${c("dim", "→ register slash commands")}`,
    step3_ts:    `npx ts-node src/deploy.ts   ${c("dim", "→ register slash commands")}`,
    step4_js:    "npm start",
    step4_ts:    "npm run dev",
    npx_title:   "To scaffold again:",
    npx_cmd:     (n) => `npx create-disckit-app ${n}`,
    copied:      "Template ready",
    installed:   "Dependencies installed",
    skipped:     (pm) => `Run  ${c("cyan", `${pm} install`)}  when ready`,
    err_install: "Install failed — run manually:",
  },
  pt: {
    q_lang:      "Idioma",
    q_name:      "Nome do projeto",
    q_variant:   "Linguagem",
    q_module:    "Sistema de módulos",
    q_features:  "Funcionalidades  (↑↓ para navegar)",
    q_install:   "Instalar dependências",
    sub:         "crie um bot Discord com @disckit pré-configurado",
    err_name:    "Nome inválido — use letras, números, hífens ou underscores.",
    err_exists:  (n) => `A pasta "${n}" já existe.`,
    err_exists2: "Escolha outro nome ou apague a pasta existente.",
    opt: {
      js:       { label: "JavaScript",  hint: "arquivos .js" },
      ts:       { label: "TypeScript",  hint: "arquivos .ts + tsconfig" },
      cjs:      { label: "CommonJS",    hint: "require / module.exports" },
      esm:      { label: "ESM",         hint: "import / export  (type:module)" },
      mongo:    { label: "MongoDB",     hint: "modelos Mongoose (em breve)", disabled: true, disabledReason: "indisponível por enquanto" },
      install:  { label: "Sim, instalar agora" },
      skip:     { label: "Pular, instalo depois" },
      en:       { label: "English" },
      pt:       { label: "Português" },
    },
    done:        "Pronto! Seu bot está criado.",
    steps:       "Próximos passos:",
    step1:       (n) => `cd ${c("cyan", n)}`,
    step2:       `Preencha o ${c("yellow", ".env")} com seus tokens`,
    step3_js:    `node src/deploy.js   ${c("dim", "→ registrar slash commands")}`,
    step3_ts:    `npx ts-node src/deploy.ts   ${c("dim", "→ registrar slash commands")}`,
    step4_js:    "npm start",
    step4_ts:    "npm run dev",
    npx_title:   "Para criar outro projeto:",
    npx_cmd:     (n) => `npx create-disckit-app ${n}`,
    copied:      "Template copiado",
    installed:   "Dependências instaladas",
    skipped:     (pm) => `Execute  ${c("cyan", `${pm} install`)}  quando quiser`,
    err_install: "Instalação falhou — execute manualmente:",
  },
};

// ── Scaffold helpers ──────────────────────────────────────────────────────────

function validateName(name) {
  return /^[a-z0-9][a-z0-9-_]*[a-z0-9]$|^[a-z0-9]$/i.test(name);
}

function detectPM() {
  const ua = process.env.npm_config_user_agent || "";
  if (ua.startsWith("pnpm")) return "pnpm";
  if (ua.startsWith("yarn")) return "yarn";
  return "npm";
}

function copyDir(src, dest, vars) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const destName = entry === "gitignore" ? ".gitignore" : entry;
    const srcPath  = path.join(src, entry);
    const destPath = path.join(dest, destName);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath, vars);
    } else {
      let content = fs.readFileSync(srcPath, "utf8");
      for (const [k, v] of Object.entries(vars)) content = content.replaceAll(`{{${k}}}`, v);
      fs.writeFileSync(destPath, content, "utf8");
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Banner
  process.stdout.write("\n");
  process.stdout.write(`  ${c("pink", c("bold", "⚡ create-disckit-app"))}\n`);

  // ── 1. Language ──────────────────────────────────────────────────────────────
  const langVal = await select("Language / Idioma", [
    { label: "English",    value: "en" },
    { label: "Português",  value: "pt" },
  ]);
  const S = T[langVal];

  process.stdout.write(`\n  ${c("dim", S.sub)}\n`);

  // ── 2. Project name ──────────────────────────────────────────────────────────
  let projectName = process.argv[2] || "";
  while (true) {
    if (!projectName) projectName = await input(S.q_name);
    if (!validateName(projectName)) {
      process.stdout.write(`\n  ${c("yellow", S.err_name)}\n`);
      projectName = "";
      continue;
    }
    const dest = path.resolve(process.cwd(), projectName);
    if (fs.existsSync(dest)) {
      process.stdout.write(`\n  ${c("red", S.err_exists(projectName))}\n`);
      process.stdout.write(`  ${c("dim", S.err_exists2)}\n`);
      projectName = "";
      continue;
    }
    break;
  }

  // ── 3. Language: JS or TS ────────────────────────────────────────────────────
  const variantLang = await select(S.q_variant, [
    { label: S.opt.js.label, hint: S.opt.js.hint, value: "js" },
    { label: S.opt.ts.label, hint: S.opt.ts.hint, value: "ts" },
  ]);

  // ── 4. Module system (only for JS) ───────────────────────────────────────────
  let moduleSystem = "cjs";
  if (variantLang === "js") {
    moduleSystem = await select(S.q_module, [
      { label: S.opt.cjs.label, hint: S.opt.cjs.hint, value: "cjs" },
      { label: S.opt.esm.label, hint: S.opt.esm.hint, value: "esm" },
    ]);
  }

  // ── 5. Features ──────────────────────────────────────────────────────────────
  await select(S.q_features, [
    {
      label: S.opt.mongo.label,
      hint:  S.opt.mongo.hint,
      value: "mongodb",
      disabled: true,
      disabledReason: S.opt.mongo.disabledReason,
    },
  ]);

  // ── 6. Install? ──────────────────────────────────────────────────────────────
  const pm = detectPM();
  const doInstall = await select(S.q_install, [
    { label: S.opt.install.label, value: "yes" },
    { label: S.opt.skip.label,    value: "no"  },
  ]) === "yes";

  // ── 7. Scaffold ───────────────────────────────────────────────────────────────
  process.stdout.write("\n");

  const projectDir  = path.resolve(process.cwd(), projectName);
  const templateDir = path.join(__dirname, "..", "templates");
  const variantKey  = variantLang === "ts" ? "ts" : `js-${moduleSystem}`;
  const vars        = { PROJECT_NAME: projectName, LANG: langVal };

  copyDir(path.join(templateDir, "base"), projectDir, vars);
  copyDir(path.join(templateDir, "variants", variantKey), projectDir, vars);

  process.stdout.write(`  ${c("green", "✔")}  ${S.copied}\n`);

  // ── 8. Install ────────────────────────────────────────────────────────────────
  if (doInstall) {
    process.stdout.write(`  ${c("dim", "○")}  installing...\r`);
    const installCmd = pm === "yarn" ? "yarn" : pm === "pnpm" ? "pnpm install" : "npm install";
    try {
      execSync(installCmd, { cwd: projectDir, stdio: "pipe" });
      process.stdout.write(`  ${c("green", "✔")}  ${S.installed}\n`);
    } catch {
      process.stdout.write(`  ${c("yellow", "!")}`);
      process.stdout.write(`  ${S.err_install}\n`);
      process.stdout.write(`  ${c("dim", `    cd ${projectName} && ${installCmd}`)}\n`);
    }
  } else {
    process.stdout.write(`  ${c("dim", "○")}  ${S.skipped(pm)}\n`);
  }

  // ── Done ──────────────────────────────────────────────────────────────────────
  const isTs = variantKey === "ts";

  process.stdout.write(`\n`);
  process.stdout.write(`  ${c("bold", c("green", S.done))}\n\n`);
  process.stdout.write(`  ${c("bold", S.steps)}\n\n`);
  process.stdout.write(`  ${c("dim", "1.")} ${S.step1(projectName)}\n`);
  process.stdout.write(`  ${c("dim", "2.")} ${S.step2}\n`);
  process.stdout.write(`  ${c("dim", "3.")} ${isTs ? S.step3_ts : S.step3_js}\n`);
  process.stdout.write(`  ${c("dim", "4.")} ${c("green", isTs ? S.step4_ts : S.step4_js)}\n`);

  process.stdout.write(`\n`);
  process.stdout.write(`  ${c("dim", "─────────────────────────────────────")}\n`);
  process.stdout.write(`  ${c("dim", S.npx_title)}\n`);
  process.stdout.write(`  ${c("cyan", S.npx_cmd(projectName))}\n\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

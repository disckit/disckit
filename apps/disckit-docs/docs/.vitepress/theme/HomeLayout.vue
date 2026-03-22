<script setup>
import { ref } from 'vue'

const tabs = ['npm', 'yarn', 'pnpm', 'bun']
const commands = {
  npm:  'npm install disckit',
  yarn: 'yarn add disckit',
  pnpm: 'pnpm add disckit',
  bun:  'bun add disckit',
}
const active = ref('npm')
const copied = ref(false)

function copy() {
  navigator.clipboard?.writeText(commands[active.value]).then(() => {
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  })
}
</script>

<template>
  <div class="home">

    <div class="hero">
      <img
        class="hero-logo"
        src="https://raw.githubusercontent.com/disckit/disckit/main/assets/logo.svg"
        alt="disckit"
      />

      <p class="hero-desc">
        disckit is a powerful Node.js module that allows you to easily build Discord bots
        and dashboards. Zero dependencies. CJS + ESM. Full TypeScript support.
      </p>

      <nav class="hero-actions">
        <a class="btn btn-outline" href="/packages/common">Docs</a>
        <a class="btn btn-ghost" href="/guide/introduction">Guide ↗</a>
        <a class="btn btn-ghost" href="https://github.com/disckit/disckit" target="_blank" rel="noopener">GitHub ↗</a>
      </nav>

      <div class="install-box">
        <div class="tabs">
          <button
            v-for="t in tabs"
            :key="t"
            class="tab"
            :class="{ active: active === t }"
            @click="active = t"
          >{{ t }}</button>
        </div>
        <div class="install-row">
          <span class="prompt">&gt;</span>
          <span class="cmd">{{ commands[active] }}</span>
          <button class="copy" @click="copy" :title="copied ? 'Copied!' : 'Copy'">
            <svg v-if="!copied" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="powered">
        <a href="https://vercel.com" target="_blank" rel="noopener" class="powered-link">
          <svg width="13" height="11" viewBox="0 0 76 65" fill="currentColor"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/></svg>
          Powered by <strong>Vercel</strong>
        </a>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ── Page ───────────────────────────────────────────────────────────────────── */
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background: var(--vp-c-bg);
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  text-align: center;
  width: 100%;
  max-width: 680px;
}

/* ── Logo ───────────────────────────────────────────────────────────────────── */
.hero-logo {
  width: min(500px, 82vw);
}

/* ── Description ─────────────────────────────────────────────────────────────── */
.hero-desc {
  font-size: 1rem;
  line-height: 1.75;
  color: var(--vp-c-text-2);
  max-width: 560px;
}

/* ── Buttons ─────────────────────────────────────────────────────────────────── */
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 9px 22px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s;
  cursor: pointer;
}

.btn-outline {
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}
.btn-outline:hover { background: var(--vp-c-bg-mute); }

.btn-ghost {
  border: 1px solid transparent;
  color: var(--vp-c-text-2);
  background: transparent;
}
.btn-ghost:hover { color: var(--vp-c-text-1); }

/* ── Install box ─────────────────────────────────────────────────────────────── */
.install-box {
  width: min(420px, 92vw);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.tabs {
  display: flex;
  background: var(--vp-c-bg-mute);
  border-bottom: 1px solid var(--vp-c-divider);
}

.tab {
  padding: 8px 16px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.tab.active      { color: var(--vp-c-brand-1); border-bottom-color: var(--vp-c-brand-1); }
.tab:hover:not(.active) { color: var(--vp-c-text-2); }

.install-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.88rem;
}

.prompt { color: var(--vp-c-brand-1); user-select: none; }
.cmd    { color: var(--vp-c-text-1); flex: 1; text-align: left; }

.copy {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 6px;
  color: var(--vp-c-text-3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: color 0.15s, background 0.15s;
}
.copy:hover { color: var(--vp-c-text-1); background: var(--vp-c-bg-mute); }

/* ── Powered by ──────────────────────────────────────────────────────────────── */
.powered { margin-top: 4px; }

.powered-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
  text-decoration: none;
  transition: opacity 0.15s;
}
.powered-link:hover { opacity: 0.75; }
.powered-link strong { color: var(--vp-c-text-2); }

/* ── Responsive ──────────────────────────────────────────────────────────────── */
@media (max-width: 480px) {
  .hero { gap: 22px; }
  .btn-ghost { display: none; }
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// highlight.js (TypeScript)
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/github-dark.min.css";
hljs.registerLanguage("typescript", typescript);

// --- dynamic import of the method ---
type DidBtcr2NS = {
  DidBtcr2: {
    resolve: (did: string, options?: any) => Promise<any>;
  };
};
let DidBtcr2: DidBtcr2NS["DidBtcr2"] | null = null;

const ready = ref(false);
const isLoading = ref(false);
const output = ref<any>(null); // keep raw value (object or string)

// form state
const did = ref("");
const resOptions = ref("{ \"sidecarData\": { \"initialDocument\": {} } }"); // optional JSON
const optionsError = ref<string | null>(null);

onMounted(async () => {
  try {
    const mod = await import("@did-btcr2/method");
    DidBtcr2 = (mod as any).DidBtcr2;
    ready.value = !!DidBtcr2;
  } catch (error: any) {
    console.error("Failed to load DidBtcr2 module for Resolve:", error);
    output.value = error?.stack || String(error);
  }
});

function parseOptions(): { ok: boolean; value?: any; error?: string } {
  const raw = resOptions.value.trim();
  if (!raw || raw === "{}") return { ok: true, value: undefined };
  try {
    const value = JSON.parse(raw);
    return { ok: true, value };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Invalid JSON" };
  }
}

const usingOptions = computed(() => {
  const t = resOptions.value.trim();
  return !!t && t !== "{}";
});

const isExternal = computed(() => {
  if (!did.value) return false;
  return did.value.includes("x1");
});

// Live TS snippet (string)
const snippet = computed(() => {
  const id = did.value || "<enter a did>";
  if (usingOptions.value) {
    return `import { DidBtcr2 } from "@did-btcr2/method";

const did = "${id}";
const options = ${resOptions.value || "{}"};

const res = await DidBtcr2.resolve(did, options);
console.log(res);`;
  }
  return `import { DidBtcr2 } from "@did-btcr2/method";

const did = "${id}";

const res = await DidBtcr2.resolve(did);
console.log(res);`;
});

// Highlighted HTML
const highlightedSnippet = computed(
  () => hljs.highlight(snippet.value, { language: "typescript" }).value
);

const isFormValid = computed(() => !!did.value);

async function handleResolve() {
  if (!DidBtcr2 || !ready.value) return;
  optionsError.value = null;

  const parsed = parseOptions();
  if (!parsed.ok) {
    optionsError.value = parsed.error!;
    return;
  }

  isLoading.value = true;
  output.value = null;
  try {
    const res =
      parsed.value !== undefined
        ? await DidBtcr2.resolve(did.value, parsed.value)
        : await DidBtcr2.resolve(did.value);
    output.value = res; // keep raw
  } catch (error: any) {
    console.error("Failed to handleResolve:", error);
    output.value = error?.stack || String(error);
  } finally {
    isLoading.value = false;
  }
}

// Copy buttons (match Create behavior)
const copiedSnippet = ref(false);
async function copySnippet() {
  try {
    const text = snippet.value; // raw code
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    copiedSnippet.value = true;
    setTimeout(() => (copiedSnippet.value = false), 1500);
  } catch (err) {
    console.error("Copy failed:", err);
  }
}

const copiedResponse = ref(false);
async function copyResponse() {
  try {
    const text = output.value;
    if (!text) return;
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    copiedResponse.value = true;
    setTimeout(() => (copiedResponse.value = false), 1500);
  } catch (err) {
    console.error("Copy failed:", err);
  }
}
</script>

<template>
  <ClientOnly>
    <div class="demo-card">
      <div class="row">
        <label class="field">
          <span class="label">Identifier (DID)</span>
          <input class="input" v-model.trim="did" placeholder="did:btcr2:..." spellcheck="false" />
        </label>

        <label v-if="isExternal" class="field">
          <span class="label">Resolution Options (JSON, optional)</span>
          <textarea class="textarea" v-model="resOptions" rows="8" spellcheck="false" placeholder='{}'></textarea>
          <p v-if="optionsError" class="error">JSON error: {{ optionsError }}</p>
        </label>

        <div class="actions">
          <button class="btn primary" :disabled="!ready || isLoading || !isFormValid" @click="handleResolve">
            <span v-if="isLoading" class="spinner" aria-hidden="true" />
            {{ isLoading ? "Resolving…" : "Resolve" }}
          </button>
        </div>

        <div class="response-wrap">
          <h4 class="sep">Response</h4>
          <button class="copy-control" type="button" @click="copyResponse"
            :aria-label="copiedResponse ? 'Copied' : 'Copy response'">
            <svg v-if="!copiedResponse" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15V5a2 2 0 0 1 2-2h10"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor">
              <path d="M20 6L9 17l-5-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
          <pre class="out hljs">{{ output || (isLoading ? "" : "—") }}</pre>
        </div>

        <details class="snippet" open>
          <summary class="summary">Code Preview</summary>
          <button class="copy-control" type="button" @click="copySnippet"
            :aria-label="copiedSnippet ? 'Copied' : 'Copy code'">
            <svg v-if="!copiedSnippet" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15V5a2 2 0 0 1 2-2h10"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor">
              <path d="M20 6L9 17l-5-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>

          <pre class="hljs"><code v-html="highlightedSnippet"></code></pre>
        </details>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.demo-card {
  border: 1px solid var(--vp-c-divider);
  padding: 12px;
  border-radius: 8px;
}

.row {
  display: grid;
  gap: 10px;
  align-items: end;
}

.summary {
  letter-spacing: -0.01em;
  line-height: 24px;
  font-size: 18px;
}

.field {
  display: grid;
  gap: 6px;
}

.label {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.select,
.input,
.textarea {
  background: transparent;
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 8px 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  width: 100%;
}

.select:focus,
.input:focus,
.textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px color-mix(in oklab, var(--vp-c-brand-1) 25%, transparent);
}

.actions {
  margin: 10px 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 20px;
  align-items: center;
}

.btn {
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-brand-1);
  background: transparent;
  color: var(--vp-c-brand-1);
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--vp-c-alt) !important;
  border-color: var(--vp-c-alt) !important;
}

.btn.primary {
  background: var(--vp-c-brand-1);
  color: #000;
  border-color: var(--vp-c-brand-1);
}

.btn.ghost {
  border-style: dashed;
}

.warn {
  color: #ffb020;
  font-size: 12px;
}

.error {
  color: #ff6b6b;
  font-size: 12px;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
  vertical-align: -2px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.snippet {
  font-size: 13px;
  margin: 14px 0 0;
}

.snippet code {
  white-space: pre-wrap;
  word-break: break-word;
}

.copy-control {
  position: relative;
  padding: 0.25em;
  float: right;
}

.copy-control:hover {
  border-color: var(--vp-c-brand);
}

.response-wrap {
  position: relative;
}

.sep {
  margin: 16px 0 8px;
}

.out {
  margin-top: 6px;
  white-space: pre-wrap;
  word-break: break-word;
  min-height: 40px;
  font-size: 13px;
}

.hljs {
  border-radius: 8px;
  padding: 12px;
}
</style>

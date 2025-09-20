<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// highlight.js (TypeScript)
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
// pick any theme you like
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
const output = ref("");

// form state
const did = ref("");
const optionsText = ref("{}"); // optional JSON
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

function parseOptions():
  | { ok: true; value: any }
  | { ok: false; error: string } {
  const raw = optionsText.value.trim();
  if (!raw || raw === "{}") return { ok: true, value: undefined }; // treat as absent
  try {
    const value = JSON.parse(raw);
    return { ok: true, value };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Invalid JSON" };
  }
}

const usingOptions = computed(() => {
  const t = optionsText.value.trim();
  return !!t && t !== "{}";
});

// Live TS snippet (string)
const snippet = computed(() => {
  const id = did.value || "<enter a did>";
  if (usingOptions.value) {
    return `import { DidBtcr2 } from "@did-btcr2/method";

const did = "${id}";
const options = ${optionsText.value || "{}"};

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

async function handleResolve() {
  if (!DidBtcr2 || !ready.value) return;
  optionsError.value = null;

  const parsed = parseOptions();
  if (!parsed.ok) {
    optionsError.value = parsed.error;
    return;
  }

  isLoading.value = true;
  output.value = "";
  try {
    const res =
      parsed.value !== undefined
        ? await DidBtcr2.resolve(did.value, parsed.value)
        : await DidBtcr2.resolve(did.value);
    output.value = JSON.stringify(res, null, 2);
  } catch (error: any) {
    console.error("Failed to handleResolve:", error);
    output.value = error?.stack || String(error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <ClientOnly>
    <div class="demo-card">
      <div class="row">
        <label>Identifier (DID)</label>
        <input
          class="input"
          v-model.trim="did"
          placeholder="did:btcr2:..."
          spellcheck="false"
        />
      </div>

      <div class="row">
        <label class="field">Resolution Options (optional JSON)</label>
        <textarea
          class="textarea"
          v-model="optionsText"
          rows="1"
          spellcheck="false"
        />
        <p v-if="optionsError" class="error">JSON error: {{ optionsError }}</p>
      </div>

      <div class="actions">
      <button
        class="btn"
        :disabled="!ready || isLoading"
        @click="handleResolve"
      >
        <span v-if="isLoading" class="spinner" aria-hidden="true" />
        {{ isLoading ? "Resolving…" : "Resolve" }}
      </button>
      </div>

      <details class="snippet" open>
        <summary>Live Preview</summary>
        <pre class="hljs"><code v-html="highlightedSnippet"></code></pre>
      </details>

      <h4 class="sep">Response</h4>
      <pre class="out">{{ output || (isLoading ? "" : "—") }}</pre>
    </div>
  </ClientOnly>
</template>

<style scoped>
.demo-card {
  border: 1px solid var(--vp-c-divider);
  padding: 12px;
  border-radius: 10px;
  display: grid;
  gap: 12px;
}
.row {
  display: grid;
  gap: 6px;
}
label {
  font-weight: 600;
}
select,
input,
textarea {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 8px;
  border-radius: 8px;
  font-family: inherit;
}
textarea {
  resize: vertical;
}
.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.btn {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: white;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 6px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.hint {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.error {
  color: var(--vp-c-danger-1);
}
.snippet summary {
  cursor: pointer;
  font-weight: 600;
}
.snippet pre {
  white-space: pre-wrap;
  word-break: break-word;
}
.sep {
  margin: 4px 0 0;
}
.out {
  white-space: pre-wrap;
  word-break: break-word;
  background: var(--vp-c-bg-soft);
  padding: 10px;
  border-radius: 8px;
}
.hljs {
  border-radius: 8px;
  padding: 12px;
  overflow: auto;
}
</style>

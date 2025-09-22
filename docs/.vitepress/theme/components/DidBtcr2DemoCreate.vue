<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

// --- syntax highlighting (TypeScript) ---
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/github-dark.min.css";
hljs.registerLanguage("typescript", typescript);

// --- secp256k1 (for random key gen) ---
import * as secp from "@noble/secp256k1";

type DemoNamespace = {
  DidBtcr2: {
    create: (args: any) => Promise<any>;
  };
  IntermediateDidDocument: {
    fromPublicKey: (args: any) => any;
  };
};
let DidBtcr2: DemoNamespace["DidBtcr2"] | null = null;
let IntermediateDidDocument: DemoNamespace["IntermediateDidDocument"] | null =
  null;

const ready = ref(false);
const isLoading = ref(false);
const output = ref("");

const networks = [
  "bitcoin",
  "testnet3",
  "testnet4",
  "signet",
  "mutinynet",
  "regtest",
] as const;
type Network = (typeof networks)[number];

const selectedNetwork = ref<Network | "">("");
const idType = ref<"KEY" | "EXTERNAL" | "">("");

const pubKeyHex = ref(""); // shown only when KEY
const intermediateDocText = ref(""); // shown only when EXTERNAL
const intermediateDocError = ref<string | null>(null);

// small helpers
const hexRe = /^[0-9a-fA-F]+$/;
function hexToBytes(hex: string): Uint8Array {
  const clean = hex.trim();
  if (clean.length % 2 !== 0) throw new Error("Hex length must be even");
  if (!hexRe.test(clean)) throw new Error("Invalid hex");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++)
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}
function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

onMounted(async () => {
  try {
    const mod = await import("@did-btcr2/method");
    DidBtcr2 = (mod as any).DidBtcr2;
    IntermediateDidDocument = (mod as any).IntermediateDidDocument;
    ready.value = !!DidBtcr2;
  } catch (error: any) {
    console.error("Failed to load DidBtcr2 module for Create:", error);
    output.value = error?.stack || String(error);
  }
});

watch(intermediateDocText, () => {
  intermediateDocError.value = null;
  const raw = intermediateDocText.value.trim();
  if (!raw) return;
  try {
    JSON.parse(raw);
  } catch (e: any) {
    intermediateDocError.value = e?.message || "Invalid JSON";
  }
});

const isKeyValid = computed(() => {
  if (idType.value !== "KEY") return false;
  const h = pubKeyHex.value.trim();
  if (!h || !hexRe.test(h) || h.length !== 66) return false; // 33 bytes compressed
  const prefix = h.slice(0, 2);
  return prefix === "02" || prefix === "03";
});
const isExternalValid = computed(() => {
  if (idType.value !== "EXTERNAL") return false;
  const raw = intermediateDocText.value.trim();
  if (!raw || intermediateDocError.value) return false;
  return true;
});
const isFormValid = computed(
  () =>
    !!selectedNetwork.value &&
    !!idType.value &&
    (isKeyValid.value || isExternalValid.value)
);

const snippet = computed(() => {
  const net = selectedNetwork.value || "<choose network>";
  if (idType.value === "KEY") {
    const hex = pubKeyHex.value || "<paste compressed pubkey hex>";
    const bytes = isKeyValid.value
      ? `new Uint8Array([${Array.from(hexToBytes(hex))
          .map((b) => b.toString())
          .join(", ")}])`
      : "<Uint8Array of pubkey bytes>";
    return `import { DidBtcr2 } from "@did-btcr2/method";

const options = { version: 1, network: "${net}" as const };
const pubKeyHex = "${hex}";
const pubKeyBytes = ${bytes};

const res = await DidBtcr2.create({
  idType: "KEY",
  pubKeyBytes,
  options
});
console.log(res);`;
  } else if (idType.value === "EXTERNAL") {
    const doc =
      intermediateDocText.value.trim() || "{ /* intermediate DID doc */ }";
    return `import { DidBtcr2 } from "@did-btcr2/method";

const options = { version: 1, network: "${net}" };
const intermediateDidDocument = ${doc};

const res = await DidBtcr2.create({ idType: "EXTERNAL", intermediateDidDocument, options });
console.log(res);`;
  }
  return `// Choose network & idType, then fill
// the fields to see the call`;
});
const highlightedSnippet = computed(
  () => hljs.highlight(snippet.value, { language: "typescript" }).value
);

// randomize button
async function randomize() {
  try {
    // random network
    selectedNetwork.value =
      networks[Math.floor(Math.random() * networks.length)];
    // random id type
    idType.value = Math.random() < 0.5 ? "KEY" : "EXTERNAL";

    const sec = secp.utils.randomSecretKey();
    const pub = secp.getPublicKey(sec, true);
    if (idType.value === "KEY") {
      pubKeyHex.value = bytesToHex(pub);
      intermediateDocText.value = "";
    } else {
      pubKeyHex.value = "";
      const rnd = Math.random().toString(36).slice(2, 10);
      intermediateDocText.value = JSON.stringify(
        IntermediateDidDocument.fromPublicKey(pub),
        undefined,
        4
      );
    }
  } catch (error) {
    console.error("Failed to randomize:", error);
  }
}

// submit
async function handleCreate() {
  if (!DidBtcr2 || !isFormValid.value) return;
  isLoading.value = true;
  output.value = "";
  try {
    const options = { version: 1, network: selectedNetwork.value };
    let res: any;

    if (idType.value === "KEY") {
      const bytes = hexToBytes(pubKeyHex.value);
      res = await DidBtcr2!.create({
        idType: "KEY",
        pubKeyBytes: bytes,
        options,
      });
    } else {
      const doc = JSON.parse(intermediateDocText.value);
      res = await DidBtcr2!.create({
        idType: "EXTERNAL",
        IntermediateDidDocument: doc,
        options,
      });
    }
    output.value = JSON.stringify(res, null, 2);
  } catch (error: any) {
    console.error("Failed to handleCreate:", error);
    output.value = error?.stack || String(error);
  } finally {
    isLoading.value = false;
  }
}

const copied = ref(false);
async function copySnippet() {
  try {
    const text = snippet.value; // raw code, not the highlighted HTML
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
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
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
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
          <span class="label">Bitcoin Network</span>
          <select class="select" v-model="selectedNetwork">
            <option value="" disabled>Select a network…</option>
            <option v-for="n in networks" :key="n" :value="n">{{ n }}</option>
          </select>
        </label>

        <label class="field">
          <span class="label">ID Type</span>
          <select class="select" v-model="idType">
            <option value="" disabled>Select id type…</option>
            <option value="KEY">key</option>
            <option value="EXTERNAL">external</option>
          </select>
        </label>

        <button class="btn primary" :disabled="!ready" @click="randomize">
          Random Inputs
        </button>
      </div>

      <div v-if="idType === 'KEY'" class="field">
        <span class="label"
          >Compressed secp256k1 Public Key (hex, 33 bytes)</span
        >
        <input
          class="input"
          v-model.trim="pubKeyHex"
          placeholder="02… or 03… (66 hex chars)"
          spellcheck="false"
        />
        <p v-if="pubKeyHex && !isKeyValid" class="warn">
          Must be 66 hex chars, starting with 02 or 03.
        </p>
      </div>

      <div v-else-if="idType === 'EXTERNAL'" class="field">
        <span class="label">Intermediate DID Document (JSON)</span>
        <textarea
          class="textarea"
          v-model="intermediateDocText"
          rows="8"
          spellcheck="false"
          placeholder='{\n  "@context": ["https://www.w3.org/ns/did/v1"],\n  "id": "did:example:..."\n}'
        />
        <p v-if="intermediateDocText && intermediateDocError" class="error">
          JSON error: {{ intermediateDocError }}
        </p>
      </div>

      <div class="actions">
        <button
          class="btn primary"
          :disabled="!ready || isLoading || !isFormValid"
          @click="handleCreate"
        >
          <span v-if="isLoading" class="spinner" aria-hidden="true" />
          {{ isLoading ? "Creating…" : "Create" }}
        </button>
      </div>

      <details class="snippet" open>
        <summary>Live args preview</summary>

        <button
          class="copy-control"
          type="button"
          @click="copySnippet"
          :aria-label="copied ? 'Copied' : 'Copy'"
        >
          <!-- Clipboard / Check icon -->
          <svg
            v-if="!copied"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15V5a2 2 0 0 1 2-2h10"></path>
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M20 6L9 17l-5-5"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>

        </button>

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
  border-radius: 8px;
}
.title {
  margin: 0 0 8px 0;
  font-weight: 600;
}
.row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;
  align-items: end;
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
  box-shadow: 0 0 0 2px
    color-mix(in oklab, var(--vp-c-brand-1) 25%, transparent);
}
.actions {
  margin: 10px 0 0;
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
  margin: 14px 0 0;
}
.snippet code {
  white-space: pre-wrap;
  word-break: break-word;
}
.copy-control {
  position: relative;
  padding: 0.25em;
  right: 2em;
  float: right;
}
.copy-control:hover {
  border-color: var(--vp-c-brand);
}
.sep {
  margin: 16px 0 8px;
}
.out {
  margin-top: 6px;
  white-space: pre-wrap;
  word-break: break-word;
  min-height: 40px;
}
.hljs {
  border-radius: 8px;
  padding: 12px;
  overflow: auto;
}
</style>

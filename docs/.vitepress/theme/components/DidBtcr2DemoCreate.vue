<script setup lang="ts">
import { ref, onMounted } from 'vue';

type DidBtcr2NS = { DidBtcr2: { create: (args: any) => Promise<any>, resolve: (args: any) => Promise<any> } };

const ready = ref(false);
const output = ref('');

let DidBtcr2: DidBtcr2NS['DidBtcr2'] | null = null;

onMounted(async () => {
  // dynamic import so SSR never evaluates your browser bundle
  const mod = await import('@did-btcr2/method');
  DidBtcr2 = (mod as any).DidBtcr2;
  ready.value = !!DidBtcr2;
});

async function handleCreate() {
  if (!DidBtcr2) return;
  output.value = 'Working…';
  try {
    const res = await DidBtcr2.create({
      idType: 'KEY',
      pubKeyBytes: Buffer.from('03620d4fb8d5c40b0dc2f9fd84636d85487e51ecf55fbcd5ccf08c6ac148bc8a36', 'hex'),
      options: { version: 1, network: 'bitcoin' }
    });
    output.value = JSON.stringify(res, null, 2);
  } catch (e: any) {
    output.value = e?.stack || String(e);
  }
}
</script>

<template>
  <ClientOnly>
    <div class="demo-card">
      <button class="btn" :disabled="!ready" @click="handleCreate">Create</button>
      <pre class="out">{{ output }}</pre>
    </div>
  </ClientOnly>
</template>

<style scoped>
.demo-card { border: 1px solid var(--vp-c-divider); padding: 12px; border-radius: 8px; }
.btn { padding: 6px 12px; border-radius: 6px; border: 1px solid var(--vp-c-brand-1); }
.out { margin-top: 10px; white-space: pre-wrap; word-break: break-word; }
</style>

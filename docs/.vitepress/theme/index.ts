import DefaultTheme from 'vitepress/theme';
import DidBtcr2DemoCreate from './components/DidBtcr2DemoCreate.vue';
import DidBtcr2DemoResolve from './components/DidBtcr2DemoResolve.vue';
import './custom.css';

const MEMPOOL_RX = /^https?:\/\/(mempool\.space|mempool\.holdings)\b/i;
const originalFetch = globalThis.fetch.bind(globalThis);

globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : (input as URL).toString();
  if (MEMPOOL_RX.test(url)) {
    const proxied = url.replace(MEMPOOL_RX, '/mempool');
    return originalFetch(proxied, init);
  }
  return originalFetch(input as any, init);
};
export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('DidBtcr2DemoCreate', DidBtcr2DemoCreate);
    app.component('DidBtcr2DemoResolve', DidBtcr2DemoResolve);
  },
};

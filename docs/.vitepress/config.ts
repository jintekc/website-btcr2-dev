import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { fileURLToPath } from 'url'

const dayjsEsm = fileURLToPath(new URL('../../node_modules/.pnpm/dayjs@1.11.18/node_modules/dayjs/esm/index.js', import.meta.url))
const sanitizeUrlEsm = fileURLToPath(new URL('../../node_modules/.pnpm/@braintree+sanitize-url@7.1.1/node_modules/@braintree/sanitize-url/dist/index.js', import.meta.url))
const debug = fileURLToPath(new URL('../../node_modules/.pnpm/debug@4.4.1/node_modules/debug/src/browser.js', import.meta.url))

export default withMermaid(
  defineConfig({
    title: 'did:btc1',
    description: 'A censorship-resistant DID Method using the Bitcoin blockchain as a Verifiable Data Registry to announce changes to the DID document.',
    cleanUrls: true,
    mermaid: {
      securityLevel: 'loose',
      theme: 'default'
    },
    mermaidPlugin: {
      class: 'mermaid'
    },
    themeConfig: {
      outline: { level: [3, 4] },
      externalLinkIcon: true,
      search: { provider: 'local' },
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Specification', link: '/spec' },
        { text: 'Diagrams', link: '/diagrams' }
      ],
      footer: {
        copyright: 'Copyright © 2025 Digital Contract Design'
      },
      sidebar: [
        {
          text: 'Implementations',
          link: '/impls',
          items: [
            { text: 'Java', link: '/impls/java' },
            { text: 'Python', link: '/impls/py' },
            { text: 'Rust', link: '/impls/rs' },
            { text: 'TypeScript', link: '/impls/ts' }
          ]
        }
      ],
      socialLinks: [{ icon: 'github', link: 'https://github.com/dcdpr/did-btc1' }]
    },

    // Keep Vite minimal. Only add the include below if you previously saw a sanitize-url warning.
    vite: {
      resolve: {
        alias: {
          dayjs: dayjsEsm,
          '@braintree/sanitize-url': sanitizeUrlEsm,
          debug,
        },
        dedupe: ['@braintree/sanitize-url', 'dayjs', 'debug']
      }
    }
  })
)

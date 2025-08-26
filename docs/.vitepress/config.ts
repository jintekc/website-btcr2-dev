import { defineConfig } from 'vitepress';

export default defineConfig({
  title           : 'did:btc1',
  description     : 'A censorship-resistant DID Method using the Bitcoin blockchain as a Verifiable Data Registry to announce changes to the DID document.',
  cleanUrls       : true,
  themeConfig     : {
    outline : {
      level : [2, 3]
    },
    externalLinkIcon : true,
    search           : {
      provider : 'local'
    },
    nav : [
      { text: 'Home', link: '/' },
      { text: 'Specification', link: '/spec' },
      { text: 'Diagrams', link: '/diagrams' },
    ],
    footer : {
      copyright: "Copyright &copy; 2025 Digital Contract Design"
    },
    sidebar : [
      {
        text  : 'Implementations',
        link  : '/impls',
        items : [
          { text: 'Java', link: '/impls/java' },
          { text: 'Python', link: '/impls/py' },
          { text: 'Rust', link: '/impls/rs' },
          { text: 'TypeScript', link: '/impls/ts' },
        ]
      }
    ],

    socialLinks : [{ icon: 'github', link: 'https://github.com/dcdpr/did-btc1' }],
  }
});
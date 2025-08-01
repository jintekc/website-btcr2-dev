import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config

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
      { text: 'Implementations', link: '/impls' },
    ],
    footer : {
      copyright: "Copyright &copy; 2024 Digital Contract Design"
    },
    sidebar : [
      {
        text  : 'Specification',
        link  : '/spec',
        items : [
          { text: 'Abstract', link: '/spec/abstract' },
          { text: 'Terminology', link: '/spec/terms' },
          { text: 'Introduction & Motivation', link: '/spec/intro' },
          { text: 'Syntax', link: '/spec/syntax' },
          { text: 'CRUD Operations', link: '/spec/crud-ops' },
          { text: 'Update Beacons', link: '/spec/update-beacons' },
          { text: 'Privacy Considerations', link: '/spec/privacy' },
          { text: 'Security Considerations', link: '/spec/security' },
          { text: 'References', link: '/spec/references' },
          { text: 'Appendix', link: '/spec/appendix' },
        ]
      },
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
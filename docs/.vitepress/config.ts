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
          { text: 'Overview', link: '/spec/overview' },
          { text: 'Introduction & Motivation', link: '/spec/intro' },
          { text: 'Terminology', link: '/spec/terminology' },
          { text: 'Syntax', link: '/spec/syntax' },
          { text: 'CRUD Operations', link: '/spec/crud-operations' },
          { text: 'Update Beacons', link: '/spec/update-beacons' },
          { text: 'Privacy Considerations', link: '/spec/privacy-considerations' },
          { text: 'Security Considerations', link: '/spec/security-considerations' },
          { text: 'References', link: '/spec/references' },
          { text: 'Appendix', link: '/spec/appendix' },
        ]
      },
      {
        text  : 'Implementations',
        link  : '/impls',
        items : [
          { text: 'TypeScript', link: '/impls/ts' },
          { text: 'Rust', link: '/impls/rs' },
          { text: 'Python', link: '/impls/py' },
          { text: 'Java', link: '/impls/java' },
        ]
      }
    ],

    socialLinks : [{ icon: 'github', link: 'https://github.com/dcdpr/did-btc1' }],
  }
});
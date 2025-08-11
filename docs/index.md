---
layout: home
hero:
  name: did:btc1
  text: Bitcoin DID Method
  tagline: >
    A censorship-resistant DID Method using the Bitcoin blockchain as a Verifiable Data Registry to announce changes to the DID document.

  actions:
    - theme: brand
      text: Specification
      link: /spec
    - theme: alt
      text: Implementations
      link: /impls# https://vitepress.dev/reference/default-theme-home-page
features:
  - icon: 🛡️
    title: Censorship Resistant
    details: Anchored directly to the Bitcoin blockchain, did:btc1 ensures DIDs cannot be blocked, erased, or overwritten, protecting identity operations from central or state-level interference.
  - icon: 🕵️‍♂️
    title: Private
    details: Avoids reliance on public registries by enabling the secure sidecar delivery of DID Documents—transferred directly from controller to relying party—preserving privacy by default.
  - icon: 🔏
    title: Non-Repudiation with Time Anchoring
    details: Every update is immutably timestamped using Bitcoin, preventing late publishing and enabling a cryptographic chain-of-custody suitable for high-stakes contracts.
  - icon: 🔄
    title: Pairwise Non-Correlation
    details: Supports private, purpose-specific identifiers for each relationship or task, significantly reducing the risk of tracking or correlation across digital interactions.
  - icon: ⚡
    title: Efficient & Scalable Updates
    details: DID creation is possible entirely off-chain at zero cost, while updates can be aggregated, making long-term maintenance on Bitcoin practical and economical.
  - icon: 🔐
    title: Closed-Loop Resolution
    details: DID identifiers remain stable over time, even with frequent updates, making did:btc1 suitable for lasting relationships, recurring interactions, and durable digital identities.
---

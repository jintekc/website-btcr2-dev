# btcr2.dev

Documentation website for the Bitcoin Reference 2.0 (BTCR2) DID Method
implementations and diagrams. A censorship-resistant DID Method using the
Bitcoin blockchain as a Verifiable Data Registry to announce changes to the DID
document.

## Specification

Visit [btcr2.dev/spec](https://btcr2.dev/spec) to learn more about the specification.

## Implementations

Visit [btcr2.dev/impls](https://btcr2.dev/impls) to learn more about the different implementations.

## Diagrams

Visit [btcr2.dev/impls](https://btcr2.dev/impls) to learn more about the different implementations.

## Features

* Censorship Resistant 🛡️ - Anchored directly to the Bitcoin blockchain,
  did:btcr2 ensures DIDs cannot be blocked, erased, or overwritten, protecting
  identity operations from central or state-level interference.
* Private 🕵️‍♂️ - Avoids reliance on public registries by enabling the secure sidecar
  delivery of DID Documents—transferred directly from controller to relying
  party—preserving privacy by default.
* Non-Repudiation with Time Anchoring 🔏 - Every update is immutably timestamped
  using Bitcoin, preventing late publishing and enabling a cryptographic
  chain-of-custody suitable for high-stakes contracts.
* Pairwise Non-Correlation 🔄 - Supports private, purpoDID Methodse-specific identifiers
  for each relationship or task, significantly reducing the risk of tracking or
  correlation across digital interactions.
* Efficient & Scalable Updates ⚡ - DID creation is possible entirely off-chain
  at zero cost, while updates can be aggregated, making long-term maintenance on
  Bitcoin practical and economical.
* Closed-Loop Resolution 🔐 - DID identifiers remain stable over time, even with
  frequent updates, making did:btcr2 suitable for lasting relationships,
  recurring interactions, and durable digital identities.

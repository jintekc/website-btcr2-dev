# Demo

DID Method specifications overload the term "CRUD" to describe how to interact
with the key features of the method: Create, Resolve, Update, Deactivate.
The below sections demo how to use each feature of DID Method BTCR2. 

* [Create](#create) - describes the process for creating a new did:btcr2 identifier (DID)
  and a corresponding DID document from a public key or an existing DID document.
* [Resolve](#resolve) - describes the process for resolving a specific did:btcr2 identifier
  using data found in the Bitcoin blockchain.
* [Update](#update) - describes the process for updating a DID document by commiting the
  patch updates to the Bitcoin blockchain for later resolution.
* [Deactivate](#deactivate) - describes the process for deactivating a DID and corresponding
  DID document to discontinue usage.

## Create

Creating a did:btcr2 identifier is entirely offline, requiring no innate network interactions
or onchain anchoring transactions to generate a new identifier. Each creation starts either
with a public key or a [Genesis Document](https://legreq.github.io/did-btcr2/#def-genesis-document).
For public key creation, the `"idType"` arg is set to `"KEY"`. For
[Genesis Document](https://legreq.github.io/did-btcr2/#def-genesis-document),
creation, the `"idType"` is set to `"EXTERNAL".`

Public key creation must use a compressed secp256k1 public key that follows SEC encoding.
[Genesis Document](https://legreq.github.io/did-btcr2/#def-genesis-document) creation
must use an [intermediate DID document](https://legreq.github.io/did-btcr2/#def-intermediate-did-document)
representation where the identifier has been replaced throughout by the placeholder value
`did:btcr2:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.

did:btcr2 identifiers are created in reference to some specific bitcoin blockchain network.
Currently, the spec supports the following networks: bitcoin, testnet3, testnet4,
signet, mutinynet and regtest.

<DidBtcr2DemoCreate />

## Resolve

Resolving a did:btcr2 identifier can be done in multiple way. If the DID is deterministic
and the DID document has not been updated since creation, resolution is deterministic.

<DidBtcr2DemoResolve />

## Update

Coming Soon

## Deactivate

Coming Soon
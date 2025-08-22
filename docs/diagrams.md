# Diagrams

Below are UML diagrams of the various objects and algorithms in the specification.

## Architecture

The below architecture diagram shows a high-level view of the actors, participants and their interactions as laid out in the specification.

```mermaid
flowchart TB
  Controller([DID Controller])
  Resolver([DID Resolver])

  subgraph SDK["Application / SDK"]
    Create[BTC1Create]
    Read[BTC1Read]
    Update[BTC1Update]
    Factory[BeaconFactory]
    KMS[Key Manager]
    Crypto[Cryptosuite]
  end

  subgraph BTC1Beacon
    SingletonBeacon
    MapBeacon
    SMTBeacon
  end

  BTC[(Bitcoin Blockchain)]
  CAS["CAS (IPFS)"]
  Sidecar[Sidecar Data]

  Controller --> Create
  Controller --> Update
  Update --> KMS
  Update --> Crypto
  Update --> Factory
  Factory --> SingletonBeacon
  Factory --> MapBeacon
  Factory --> SMTBeacon
  Update --> Sidecar

  SingletonBeacon --> BTC
  MapBeacon --> BTC
  SMTBeacon --> BTC

  Resolver --> Read
  Read --> BTC
  Read --> CAS
  Read --> Sidecar
  Read --> Crypto
```

## Sequence

The below sequence diagrams focus on the CRUD algorithms in the specification.

### Create From Deterministic Key Pair

This algorithm encodes a secp256k1 public key as a did:BTC1 identifier. The public key is then used to deterministically generate the initial DID document.

```mermaid
sequenceDiagram
    title 4.1.1 From Deterministic Key Pair
    participant Controller as DID Controller
    participant BTC1Create as "BTC1 Create"
    participant Encode as Identifier Encoding
    participant BTC1Read

    note over Controller, BTC1Read: Offline — no Bitcoin network interaction

    Controller->>BTC1Create: CreateDeterministic(pubKeyBytes, version?, network?)
    BTC1Create->>BTC1Create: idType="key"<br/>version=1<br/>network=desired<br/>genesisBytes=pubKeyBytes
    BTC1Create->>Encode: Encode(idType, version, network, genesisBytes)
    Encode-->>BTC1Create: id
    BTC1Create->>BTC1Read: BTC1Read(did = id)
    BTC1Read-->>BTC1Create: initialDocument
    BTC1Create-->>Controller: did, initialDocument
```

### Create From External Intermediate DID Document

The From Deterministic Key Pair algorithm encodes a secp256k1 public key as a did:BTC1 identifier. The public key is then used to deterministically generate the initial DID document.

```mermaid
sequenceDiagram
    title 4.1.2 From External Intermediate DID Document
    participant Controller
    participant BTC1Create
    participant Encode as Identifier Encoding
    participant Canonicalize as Canonicalize & Hash

    note over Controller, Canonicalize: Offline — no Bitcoin network interaction
    Controller->>BTC1Create: CreateExternal(intermediateDocument, version?, network?)
    BTC1Create->>BTC1Create: idType="external"<br/>version=1<br/>network="bitcoin"
    BTC1Create->>Canonicalize: CanonicalizeAndHash(intermediateDocument)
    Canonicalize-->>BTC1Create: genesisBytes
    BTC1Create->>Encode: Encode(idType, version, network, genesisBytes)
    Encode-->>BTC1Create: id
    BTC1Create->>BTC1Create: initialDocument = copy(intermediateDocument)<br/>Replace all did:BTC1:xxxx... with id
    BTC1Create-->>Controller: did, initialDocument
    Note right of BTC1Create: Optionally, store canonicalBytes on IPFS as CID.
```

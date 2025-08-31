# TypeScript

The TypeScript implementation is structured as a package within a larger monorepo.
The method implementation can be found on npmjs.com under the packages name
[@did-btc1/method](https://www.npmjs.com/package/@did-btc1/method).

## Source Code

To view and contribute to the monorepo, visit the GitHub
respository https://github.com/dcdpr/did-btc1-js/packages/method.

To view and contribute to the method implementation, visit the `method` folder
in the monorepo GitHub repository https://github.com/dcdpr/did-btc1-js/tree/main/packages/method.

## Contributing

To report bugs or request features, open an issue: https://github.com/dcdpr/did-btc1-js/issues.

To fix bugs or build features, follow the steps below:

* Install nodejs >= v22.x

### Windows
```powershell
# system package manager
winget install OpenJS.NodeJS.LTS
# or chocolatey
choco install nodejs-lts -y
```

### MacOS / Linux
```sh
# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# reload your shell, then:
nvm install --lts
nvm use --lts
```

* Install `pnpm`
```sh
npm i -g pnpm
```

* Fork and clone the did-btc1-js monorepo, then change directory.
```sh
git clone https://github.com/{YOUR-USERNAME}/did-btc1-js.git
cd did-btc1-js
```

* Install dependencies.
```sh
pnpm install
```

* Build project packages.
```sh
pnpm build
```

* Checkout a new branch, make changes, push and submit a PR.

## Install

To install the method directly in your existing project:

```bash
pnpm install @did-btc1/method
```

To install the API to interact with the method and supporting packages in your existing project:

```bash
pnpm install @did-btc1/api
```

To install the CLI to interact with the method and supporting packages from your terminal:

```bash
pnpm install -g @did-btc1/cli
```

<span style="color: orange; font-weight: bold;">WARNING</span>
<br>The API and CLI are not stable and/or published for use.
<br>Keep an eye out here for updates to these packages.

## Usage

The main use cases are the [CRUD Operations](https://dcdpr.github.io/did-btc1/#crud-operations).
See the below examples for each available CRUD operation. Currently, the only way to use
`@did-btc1/method` is by directly installing the method package. Coming soon, you
can use the API or CLI. The below CRUD flow shows how to Create, Resolve, Update and Deactivate a DID BTC1 identifier
and DID document.

### Create

To create a new did:btc1 identifier, you can either use a compressed secp256k1 public key or an intmediate DID document. 

#### Deterministic Key Pair Identifier

```ts
import { DidBtc1 } from '@did-btc1/method';
import { SchnorrKeyPair } from '@did-btc1/keypair';

const keys = SchnorrKeyPair.generate() // Or provide your own pubKeyBytes

const { did, initialDocument } = await DidBtc1.create({
    idType: 'KEY',
    pubKeyBytes: keys.publicKey.compressed
})
console.log('DID and Initial DID document Created Successfully!', { did, initialDocument });
```

#### External Intermediate DID document Identifier

```ts
import { DidBtc1 } from '@did-btc1/method';
import { SchnorrKeyPair } from '@did-btc1/keypair';

const intermediateDocument = {
    "id": "did:btc1:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "controller": [
        "did:btc1:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    ],
    "@context": [
        "https://www.w3.org/TR/did-1.1",
        "https://btc1.dev/context"
    ],
    "verificationMethod": [
        {
            "id": "did:btc1:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx#key-0",
            "type": "Multikey",
            "controller": "did:btc1:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "publicKeyMultibase": "zQ3shRAtucgse3YhPjptmFaUKAtTyoqaSAkpj3J1UT2jtMcvg"
        }
    ],
    "authentication": [
        "did:btc1:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx#key-0"
    ],
    "assertionMethod": [
        "did:btc1:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx#key-0"
    ],
    "capabilityInvocation": [
        "did:btc1:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx#key-0"
    ],
    "capabilityDelegation": [
        "did:btc1:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx#key-0"
    ],
    "service": [
        {
            "id": "did:btc1:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx#service-0",
            "type": "SingletonBeacon",
            "serviceEndpoint": "bitcoin:mh9sw9VFe82gNUBbuLXAkBhS42Z1c6JH8E"
        }
    ]
}

const { did, initialDocument } = await DidBtc1.create({
    idType: 'EXTERNAL',
    intermediateDocument
})
console.log('DID and Initial DID document Created Successfully!', { did, initialDocument });
```

### Resolve

```ts
const identifier = 'did:btc1:k1qgpgwtp2dpe3thqny6jngl5eg6p4wghd04yj70jcp8qe4nh75hd4dhc8f08q4';
const resolution = await DidBtc1.resolve(identifier);
console.log('DID Resolved Successfully!', resolution);
```

### Update

```ts
const initialDocument = {
    "id": "did:btc1:k1qgpgwtp2dpe3thqny6jngl5eg6p4wghd04yj70jcp8qe4nh75hd4dhc8f08q4",
    "controller": [
        "did:btc1:k1qgpgwtp2dpe3thqny6jngl5eg6p4wghd04yj70jcp8qe4nh75hd4dhc8f08q4"
    ],
    "@context": [
        "https://www.w3.org/TR/did-1.1",
        "https://did-btc1/TBD/context"
    ],
    "verificationMethod": [
        {
            "id": "did:btc1:k1qgpgwtp2dpe3thqny6jngl5eg6p4wghd04yj70jcp8qe4nh75hd4dhc8f08q4#initialKey",
            "type": "Multikey",
            "controller": "did:btc1:k1qgpgwtp2dpe3thqny6jngl5eg6p4wghd04yj70jcp8qe4nh75hd4dhc8f08q4",
            "publicKeyMultibase": "zQ3shWWSrcY6fu5bzMNy9NmFjtQNKrfBBnF55Ecy2PioFxQKQ"
        }
    ],
    "authentication": [
        "did:btc1:k1qgpgwtp2dpe3thqny6jngl5eg6p4wghd04yj70jcp8qe4nh75hd4dhc8f08q4#initialKey"
    ],
    "assertionMethod": [
        "did:btc1:k1qgpgwtp2dpe3thqny6jngl5eg6p4wghd04yj70jcp8qe4nh75hd4dhc8f08q4#initialKey"
    ],
    "capabilityInvocation": [
        "did:btc1:k1qgpgwtp2dpe3thqny6jngl5eg6p4wghd04yj70jcp8qe4nh75hd4dhc8f08q4#initialKey"
    ],
    "capabilityDelegation": [
        "did:btc1:k1qgpgwtp2dpe3thqny6jngl5eg6p4wghd04yj70jcp8qe4nh75hd4dhc8f08q4#initialKey"
    ],
    "service": [
        {
            "type": "SingletonBeacon",
            "id": "did:btc1:k1qgpgwtp2dpe3thqny6jngl5eg6p4wghd04yj70jcp8qe4nh75hd4dhc8f08q4#initialP2PKH",
            "serviceEndpoint": "bitcoin:mppdEp4wznKcUkDrw7LhrtKpTFx19vXxi8"
        },
        {
            "type": "SingletonBeacon",
            "id": "did:btc1:k1qgpgwtp2dpe3thqny6jngl5eg6p4wghd04yj70jcp8qe4nh75hd4dhc8f08q4#initialP2WPKH",
            "serviceEndpoint": "bitcoin:bcrt1qvcgtvk08lx52apzxxd0c663l6274u4muchq7qg"
        },
        {
            "type": "SingletonBeacon",
            "id": "did:btc1:k1qgpgwtp2dpe3thqny6jngl5eg6p4wghd04yj70jcp8qe4nh75hd4dhc8f08q4#initialP2TR",
            "serviceEndpoint": "bitcoin:bcrt1put79jyupjf66qap9n089m45qwhd53sqmkej66kf5rsxudajsf6dstl5jqw"
        }
    ]
}
// Replace with a real identifier that you control
const identifier = 'did:btc1:k1qgpgwtp2dpe3thqny6jngl5eg6p4wghd04yj70jcp8qe4nh75hd4dhc8f08q4';

// Construct a BTC1 Update Patch
// In this case, we are constructing a patch to replace the first beacon serivce
// in the "service" array in the DID document associated with the identifier.
// In reference to the above initialDocument, this is the 0th object in the "service" field
// with the "id" ending in "#initialP2PKH".
const patch = JSON.patch.create([
  {
    op    : 'replace',
    path  : '/service/0',
    value : BeaconUtils.generateBeaconService({
      id          : identifier,
      publicKey   : getRandomValues(new Uint8Array(32)), // Or your own publicKey
      network     : 'regtest',
      addressType : 'p2pkh',
      beaconType  : 'SingletonBeacon',
    })
  }
]);
// Execute the update
const updated = await DidBtc1.update({
  identifier,
  sourceDocument       : initialDocument,
  sourceVersionId      : 1,
  patch,
  verificationMethodId : initialDocument.capabilityInvocation[0],
  beaconIds            : [initialDocument.service[0].id],
});
console.log('DID document Updated Successfully!', updated);
```

### Deactivate

To deactivate a DID and DID document, use the Update flow and create a JSON patch
for deactivation.

```ts
// Follow above steps from Update section

// Construct a deactivation patch
const patch = JSON.patch.create([
  {
    op    : 'add',
    path  : '/deactivated',
    value : true
  }
]);

// Continue following above steps from Update section
```

### Steps to recreate:

```
bun install
bun hardhat test
```

or `npm` or `yarn` or whatever. All I did to create this repo was:

```
nargo init
npx hardhat init

bun install

nargo codegen-verifier

cp circuits/contract/circuits/plonk_vk.sol contracts/UltraVerifier.sol

bun hardhat test
```

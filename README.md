# FairInbox

Market driven inbox

## Democratize information access
Currently, most people do not open their inboxes to the world because they would be overwhelmed by the amount of messages.

Respecting the recipient's time is acknowlading that time (replying to msgs) costs energy. Hence it is respectful to attach currency to msgs to replisnish the energy of the recipient and respect it's time.

The currency can be arbitrary, of objective value (e.g. USD coin, Gold coin, etc.) xor of subjective value (e.g an art NFT, ticket NFT, etc.)

The ordering of such an inbox is according to social importance. Society/others determine how important a msg is for the recipient.
The order is not simply more-is-better. The FairMarket algorithm fairly interweaves those msgs that offer the minimum required, those that offer more and those that offer subjective value.


## Smart contracts
Smart contracts were written using tealish and make use of modern AVM features like `box`es.

## Frontend
The frontend part of the dapp is work-in-progress and will be available soon

## Web3
The non smart contract code of the dapp (off DLT) will live on IPFS, as a bundle of wasm/js/html

## Build
npx webpack
open `dist/index.html` in browser

## User driven design
Whitelisted user provided css will be used for dapp

## WASM
Some parts needed for Algorand and encoding/decoding do not compile in TinyGo. Regular Go is too large. Rust or julia would be alternatives.
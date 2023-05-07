# FairInbox

Your market driven inbox

Each msg comes with currency attached

You receive the currency if you reply

https://fairinbox.io (not working yet...soon)

## Use

A -> B

- A sends a msg to B some currency (coins) attached.

- A can cancel anytime, whereby the msg disappears from B's inbox and A gets the currency back.

- B receives the currency by replying to the msg

## 

FairInbox uses FairMarket(https://github.com/1m1-github/FairMarket) as the DLT escrow and for the inbox ordering and FairFX (https://github.com/1m1-github/FairFX) as the DLT FX provider.

## Innovation

The default order of an inbox is chronological. In the 90's, Google created an ordering algorithm according to relevance to a search term.
FairMarket is an algorithm that orders msgs fairly according to market driven importance.

## Democratize information access
Currently, most people do not open their inboxes to the world because they would be overwhelmed by the amount of messages.

Respecting the recipient's time is acknowlading that time (replying to msgs) costs energy. Hence it is respectful to attach currency to msgs to replinish the energy of the recipient and respect it's time.

The currency can be arbitrary, of objective value (e.g. USD coin, Gold coin, etc.) xor of subjective value (e.g an art NFT, ticket NFT, etc.).

The ordering of such an inbox is according to social importance. Society/others determine how important a msg is for the recipient.
The order is not simply more-is-better. The FairMarket algorithm fairly interweaves those msgs that offer the minimum required, those that offer more and those that offer subjective value.

## Use cases
We could solve Twitter's revenue problem by allowing dms to come with currency. Trivial to monetize by taking cuts of transactions. Immediately jump starts a new economy whether influencers replying to followers, advisers giving advice, friends respecting each others time.

This dapp is useful for mainstream and can bring real adoption.

Possible path: attention from MegaAce -> meeting with Twitter exec -> meeting with Elon Musk -> add FairInbox to Twitter -> $ALGO 🚀

## Smart contracts
Smart contracts were written using tealish and make use of modern AVM features like `box`es.

Smart contracts make this dapp zero-credit-risk: send large value currency without fear.

## FairEnterprise

FairInbox will exist as a FairEnterprise (https://github.com/1m1-github/FairEnterprise) to give trustless and fair access to value to the community

## Frontend
The frontend part of the dapp is work-in-progress and will be available soon.

## Web3
The non smart contract code of the dapp (off DLT) will live on IPFS, as a bundle of wasm/js/html.

Serverless, trustless, permissionless.

## User driven design
Whitelisted user provided css will be used for dapp

## WASM
Some parts needed for Algorand and encoding/decoding do not compile in TinyGo. Regular Go is too large. Rust or julia would be alternatives. tbd.

## Build
`npx webpack`
`./node_modules/.bin/http-server -a localhost dist`
`npx webpack && ./node_modules/.bin/http-server -a localhost dist`

## Security
The off-DLT code contains vanilla js and html only (future: use WASM instead of js). No js frameworks or libs are used besides the DLT sdk, js-sha512 and the wallet connector sdk. This minimizes the risk of injecting malicious code.

## Learned subjective internal ordering using LLMs
As the theory asks, we choose the learning algorithm (information) as an LLM because our data consists of text. LLMs can understand, given enough examples, and with privacy (your own LLM) that a user can choose this forecasted strategy vs random, which gives a partial ordering overall

## Stream
Dev of the project was/is streamed best-effort: https://www.youtube.com/@1m1-yt/streams



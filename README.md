# FairInbox

Your social importance (or market) driven inbox

Each msg comes with currency attached

You receive the currency if you reply

https://fairinbox.io

## Use

A -> B

- A sends a msg to B some currency (coins) attached.

- A can cancel anytime, whereby the msg disappears from B's inbox and A gets the currency back.

- B receives the currency by replying to the msg

demo: https://youtu.be/qu6TXRGHSr8

## 

FairInbox uses [FairMarket](https://github.com/1m1-github/FairMarket) as the trustless escrow and for the inbox ordering and [FairFX](https://github.com/1m1-github/FairFX) as the trustless FX provider.

## Innovation

The default order of common inboxs nowadays is chronological. In the 90's, Google created an ordering algorithm according to relevance to a search term.
FairMarket is an algorithm that orders msgs fairly according to market driven importance.

## Democratize information access
Currently, most people do not open their inboxes to the world because they would be overwhelmed by the amount of messages.

Respecting the recipient's time is acknowlading that time (replying to msgs) costs energy. Hence it is respectful to attach currency to msgs to replinish the energy of the recipient and respect it's time.

The currency can be arbitrary, of objective value (e.g. USD coin, Gold coin, etc.) xor of subjective value (e.g an art NFT, ticket NFT, etc.).

The ordering of such an inbox is according to social importance. Society/others determine how important a msg is for the recipient.
The order is not simply more-is-better. The FairMarket algorithm fairly interweaves those msgs that offer the minimum required, those that offer more and those that offer subjective value.

## Use cases
Evolve on the current email system.

We could solve X's revenue problem by allowing dms to come with currency. Trivial to monetize by taking cuts of transactions. Immediately jump starts a new economy whether influencers replying to followers, advisers giving advice, friends respecting each others time.

This dapp is useful for mainstream and can bring real adoption.

## Smart contracts
Smart contracts were written using [tealish](https://tealish.tinyman.org/) and make use of modern AVM features like `box`es.

Smart contracts make this dapp zero-credit-risk: send large value currency without fear.

## FairEnterprise

FairInbox will exist as a [FairEnterprise](https://github.com/1m1-github/FairEnterprise) to give trustless and fair access to value to the community

## Frontend
The frontend part of the dapp is minimalistic.

## Trustless computing
We use a mathematical proven trustless computer called Algorand that proves to the user the exact code that runs when the dapp is run. The trustlessness also allows for secure transfer of energy and information, without any need to trust any authority.
Eventually, Algorand will connect via bridges to other trustless computers, giving users elsewhere access to it's FairInbox everywhere; alternatively, FairInbox can also be ported and made available on other trustless computers if that strategy is superior. Algorand would be considered the base barring unforeseen information.

Note that the world trustless refers to systems that do not require the user to trust any operator, whilst the word trusted refers to the opposite, systems that require trust to the operator, as ironic as that sounds. 

## Web3
The non smart contract code of the dapp (trusted computing) is live on IPFS, as a bundle of wasm/js/html, currently served by fleek.

Serverless, trustless, permissionless.

## User driven design
Whitelisted user provided css will be used for dapp.

## WASM
todo: Use e.g. TinyGo to build dApp WASM. Depends on whether the trustless computer sdk can be compiled with TinyGo.

## Build
`npx webpack`
`./node_modules/.bin/http-server -a localhost dist`
`npx webpack && ./node_modules/.bin/http-server -a localhost dist`
build to wasm:
tinygo build -o ./dist/FairInbox.wasm -target wasm .
need cmd to serve wasm+html+js
a golang module with multiple packages that builds to wasm+html+js
tests to run. no main.
(future) CI: push wasm+html+js to ipfs and change ipns

## Security
The trusted computer code contains vanilla js and html only (future: use WASM instead of js). No js frameworks or libs are used besides the trustless computer sdk, js-sha512 and the wallet connector sdk. This minimizes the risk of injecting malicious code.

Smart contract are secured by asserting conditions early. That work was live streamed as well.

## Learned subjective internal ordering using LLMs
potential todo: As the theory asks, we choose the learning algorithm (information) as an LLM because our data consists of text. LLMs can understand, given enough examples, and with privacy (your own LLM) that a user can choose this forecasted strategy vs random, which gives a partial ordering overall

## Design
golang -> WASM -> IPFS -> IPNS

user:
IPNS -> WASM -> WASM runtime -> API -> ACTION -> VIEW

action:
API -> trustless computer

views:
WASM -> HTML
WASM -> ???

## Stream
Dev of the project was/is streamed best-effort: https://www.youtube.com/@1m1-yt/streams



import algosdk from "algosdk";
// // import "./styles.css";
// import { PeraWalletConnect } from "@perawallet/connect";

// const peraWallet = new PeraWalletConnect();

// const connectButton = document.createElement("button");
// let accountAddress = "";

// document.body.appendChild(connectButton);
// connectButton.innerHTML = "Connect to Pera Wallet";

// document.addEventListener("DOMContentLoaded", reconnectSession());

// connectButton.addEventListener("click", (event) => {
//     if (accountAddress) {
//         handleDisconnectWalletClick(event);
//     } else {
//         handleConnectWalletClick(event);
//     }
// });

// function reconnectSession() {
//     // Reconnect to the session when the component is mounted
//     peraWallet
//         .reconnectSession()
//         .then((accounts) => {
//             peraWallet.connector.on("disconnect", handleDisconnectWalletClick);

//             if (accounts.length) {
//                 accountAddress = accounts[0];
//             }

//             connectButton.innerHTML = "Disconnect";
//         })
//         .catch((e) => console.log(e));
// }

// function handleConnectWalletClick(event) {
//     event.preventDefault();

//     peraWallet
//         .connect()
//         .then((newAccounts) => {
//             peraWallet.connector.on("disconnect", handleDisconnectWalletClick);

//             accountAddress = newAccounts[0];

//             connectButton.innerHTML = "Disconnect";

//             console.log('accountAddress', accountAddress)

//             addLoadInboxButton();
//         })
//         .catch((error) => {
//             if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
//                 console.log(error);
//             }
//         });
// }

// function handleDisconnectWalletClick(event) {
//     event.preventDefault();

//     peraWallet.disconnect().catch((error) => {
//         console.log(error);
//     });

//     accountAddress = "";
//     connectButton.innerHTML = "Connect to Pera Wallet";
// }

const baseServer = "https://testnet-idx.algonode.network";
const port = "";
const token = "";
let indexerClient = new algosdk.Indexer(token, baseServer, port);


let algodClient = new algosdk.Algodv2(token, baseServer, port);

// function addLoadInboxButton() {
//     const loadInboxButton = document.createElement("button");

//     document.body.appendChild(loadInboxButton);
//     loadInboxButton.innerHTML = "Load Inbox";

//     loadInboxButton.addEventListener("click", (event) => {
//         handleLoadInbox();
//     });
// }

let accountAddress = "5B3SUGACYLICWU3DHXYCS45NDNEFZCZM4MCKCKQA3DLGKZEOFQR74HLGEU";

function handleLoadInbox() {
    const txns = getBids(accountAddress)
}
// handleLoadInbox()

// let a = "z1KSn8qwtzBsqZaN0f7JCf2frBhqhFY9v5BiJQdY+pg="
// var b = new Uint8Array(atob(a).split("").map(function(c) {return c.charCodeAt(0); }));
// console.log(b)
// let c = algosdk.decodeObj(b)
// console.log(String.fromCharCode.apply(null, b))
// // let c = algosdk.encodeAddress(b)
// // console.log(c)
// // Z5JJFH6KWC3TA3FJS2G5D7WJBH6Z7LAYNKCFMPN7SBRCKB2Y7KMPU46Z4M


// let addr_bytes = algosdk.decodeAddress("HQMMGGF3KJRPTEZV6GKGT6PNQJBZWUBIQMHG4XBVGBIV2E2V4LWOFHVEAA")
// console.log(addr_bytes)

// let int_bytes = algosdk.bigIntToBytes(1)
// console.log(int_bytes)

// let str_bytes = algosdk.encodeObj("hello world")
// console.log(str_bytes)


// "dependencies": {
//     "@json-rpc-tools/utils": "^1.7.6",
//     "@perawallet/connect": "^1.2.3",
//     "@wagmi/core": "^0.10.9",
//     "@walletconnect/client": "^1.8.0",
//     "@web3modal/ethereum": "^2.3.0",
//     "@web3modal/html": "^2.3.0",
//     "algorand-walletconnect-qrcode-modal": "^1.8.0",
//     "algosdk": "^2.2.0",
//     "ethers": "^5.7.2",
//     "js-sha512": "^0.8.0"
//   },
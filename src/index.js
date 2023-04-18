import "./global.js"
import "./get_bids.js"
import { init } from "./views"
import "./pera.js"

init()

// const text = 'Hello, world!';
// const encoder = new TextEncoder();
// const byteArray = encoder.encode(text);
// console.log(byteArray)

// import algosdk from "algosdk";
// import {b64_to_uint8array} from "./global"
// console.log(algosdk.encodeObj("hi"))
// console.log(b64_to_uint8array("DE3nPpeMfDw9oia3b1/i1+4+5mtbh1wlgopyju6eWFg="))

// // import "./styles.css";


// function addLoadInboxButton() {
//     const loadInboxButton = document.createElement("button");

//     document.body.appendChild(loadInboxButton);
//     loadInboxButton.innerHTML = "Load Inbox";

//     loadInboxButton.addEventListener("click", (event) => {
//         handleLoadInbox();
//     });
// }

// let accountAddress = "5B3SUGACYLICWU3DHXYCS45NDNEFZCZM4MCKCKQA3DLGKZEOFQR74HLGEU";

// function handleLoadInbox() {
//     const txns = getBids(accountAddress)
// }
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
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
const FAIRMARKET_APP = 190904981;

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
async function handleLoadInbox() {
    // const transactionInfo = await indexerClient
    //     .searchForTransactions()
    //     .applicationID(FAIRMARKET_APP)
    //     .txType("appl")
    //     .notePrefix(btoa(`${accountAddress}.`))
    //     .do();
    // console.log(transactionInfo);

    const transactionInfo = await indexerClient
        .searchForTransactions()
        .txid("QPDRSHL44EU3WMLZKUD7QLMECWJ3HNKOJYQHSEPJIHLUVYN3CG6Q")
        .do();

    let txns = []
    // for (const t in transactionInfo.transactions) {
        const t = transactionInfo.transactions[0]
        console.log("t", t)
        {

        const args = t["application-transaction"]["application-args"];
        const bid_id = args[args.length-1];
        console.log("bid_id", bid_id)
        const bid_id_uint8 = new Uint8Array(atob(bid_id).split("").map(function(c) {return c.charCodeAt(0); }));
        console.log("bid_id_uint8", bid_id_uint8)

        const boxResponse = await algodClient.getApplicationBoxByName(FAIRMARKET_APP, bid_id_uint8).do();
        const bid_uint8 = boxResponse.value;
        console.log("bid_uint8", bid_uint8)

        const A = algosdk.encodeAddress(bid_uint8.slice(0, 32))
        const B = algosdk.encodeAddress(bid_uint8.slice(32, 64))
        console.log("A", A)
        console.log("B", B)

        const currency_id = algosdk.bytesToBigInt(bid_uint8.slice(64, 72))
        console.log("currency_id", currency_id)
        const currency_amount = algosdk.bytesToBigInt(bid_uint8.slice(72, 80))
        console.log("currency_amount", currency_amount)

        const fx_n = algosdk.bytesToBigInt(bid_uint8.slice(80, 88))
        console.log("fx_n", fx_n)
        const fx_d = algosdk.bytesToBigInt(bid_uint8.slice(88, 96))
        console.log("fx_d", fx_d)

        const type = String.fromCharCode.apply(null, bid_uint8[96]);
        console.log("type", type)

        const time = algosdk.bytesToBigInt(bid_uint8.slice(97, 105))
        console.log("time", time)

        let ns = []
        for (const a in bid_uint8.slice(105, bid_uint8.length)) {
            const s = String.fromCharCode.apply(null, a)
            console.log("s", s)
            ns.push(s)
        }
        const note = ns.join()
        console.log("note", note)

        // txn = {
        //     A: t.sender,
        //     currency_id: t.currency_id
        //     currency_amount: int
        //     fx_n: 
        //     fx_d: 
        //     type
        //     time
        //     msg: 
        // }
        txns.push(txn)
    }
    console.log(txns);
}
handleLoadInbox()


// let a = "z1KSn8qwtzBsqZaN0f7JCf2frBhqhFY9v5BiJQdY+pg="
// var b = new Uint8Array(atob(a).split("").map(function(c) {
//     return c.charCodeAt(0); }));
// console.log(b)
// let c = algosdk.encodeAddress(b)
// console.log(c)
// Z5JJFH6KWC3TA3FJS2G5D7WJBH6Z7LAYNKCFMPN7SBRCKB2Y7KMPU46Z4M
console.log('hi')

// const token = '';
// const server = 'https://algoindexer.testnet.algoexplorerapi.io';
// const port = 80;
// const client = new algosdk.Algodv2(token, server);

// (async () => {
//   console.log(await client.status().do());
// })().catch((e) => {
//   console.log(e);
// });

// const indexerToken = {
//     'X-API-Key': 'k98avqiDwn1zWb6R0HZJ84tsTZqjmhjf6qiMmnDZ'
// }
// // const indexerToken = 'k98avqiDwn1zWb6R0HZJ84tsTZqjmhjf6qiMmnDZ';
// const indexerServer = 'https://testnet-algorand.api.purestake.io/idx2';
// const indexerPort = '';
// const indexerClient = new algosdk.Indexer(
//     indexerToken,
//     indexerServer,
//     // indexerPort
// );
// console.log(indexerClient);

let B = '5B3SUGACYLICWU3DHXYCS45NDNEFZCZM4MCKCKQA3DLGKZEOFQR74HLGEU';
let notePrefixBase64Encoded = 'NUIzU1VHQUNZTElDV1UzREhYWUNTNDVORE5FRlpDWk0';
const SYSTEM_APP = 190904981;
// // const transactionInfo = await indexerClient
// //     .searchForTransactions()
// //     .applicationID(SYSTEM_APP)
// //     .txType("appl")
// //     // .notePrefix(notePrefixBase64Encoded)
// //     .do();
// // console.log(transactionInfo.transactions.map((t) => t.id));
// indexerClient
//     .searchForTransactions()
//     .applicationID(SYSTEM_APP)
//     // .txType("appl")
//     // .notePrefix(notePrefixBase64Encoded)
//     .do().then((transactionInfo)=> {
//         console.log(transactionInfo.transactions.map((t) => t.id));
//     })

// const algosdk = require('algosdk');
// const baseServer = "https://testnet-algorand.api.purestake.io/idx2";
const baseServer = "https://testnet-idx.algonode.network";
const port = "";
// const token = {
//     'X-API-key': 'k98avqiDwn1zWb6R0HZJ84tsTZqjmhjf6qiMmnDZ',
// }
token = "";

let indexerClient = new algosdk.Indexer(token, baseServer, port);

(async () => {
    // let blockInfo = await indexerClient.lookupBlock(5).do()
    const transactionInfo = await indexerClient
    .searchForTransactions()
    .applicationID(SYSTEM_APP)
    .txType("appl")
    .notePrefix("NUIzU1VHQUNZTElDV1UzREhYWUNTNDVORE5FRlpDWk00TUNLQ0tRQTNETEdLWkVPRlFSNzRITEdFVS5oZWxsbyA=")
    .do()
    console.log(transactionInfo)
})().catch(e => {
    console.log(e);
});

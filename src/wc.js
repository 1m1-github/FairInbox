import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import algosdk from "algosdk";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";

// Create a connector
const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org", // Required
  qrcodeModal: QRCodeModal,
});

// Check if connection is already established
if (!connector.connected) {
  // create new session
  connector.createSession();
}

// Subscribe to connection events
connector.on("connect", (error, payload) => {
  if (error) {
    throw error;
  }

  // Get provided accounts
  const { accounts } = payload.params[0];
});

connector.on("session_update", (error, payload) => {
  if (error) {
    throw error;
  }

  // Get updated accounts 
  const { accounts } = payload.params[0];
});

connector.on("disconnect", (error, payload) => {
  if (error) {
    throw error;
  }
});

// const txns = [txn]
// const txnsToSign = txns.map(txn => {
//   const encodedTxn = Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64");

//   return {
//     txn: encodedTxn,
//     message: 'Description of transaction being signed',
//     // Note: if the transaction does not need to be signed (because it's part of an atomic group
//     // that will be signed by another party), specify an empty singers array like so:
//     // signers: [],
//   };
// });

// const requestParams = [txnsToSign];

// const request = formatJsonRpcRequest("algo_signTxn", requestParams);
// const result = await this.connector.sendCustomRequest(request);
// const decodedResult = result.map(element => {
//   return element ? new Uint8Array(Buffer.from(element, "base64")) : null;
// });

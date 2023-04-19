// imports
import algosdk from "algosdk";
import { PeraWalletConnect } from "@perawallet/connect";

// constants
export const FAIRMARKET_ACCOUNT = "A2P7TMONFNNJKNDKMDIOGAOQ3HCELYA6OCWR4JIF2PBT6KNQCPVHKY3IVQ"
export const FAIRMARKET_APP = 190904981

export const FX_APP = 178969021
export const FX_LP_APP = 148607000
export const FX_LP_ACCOUNT = {
    10458941: "UDFWT5DW3X5RZQYXKQEMZ6MRWAEYHWYP7YUAPZKPW6WJK3JH3OZPL7PO2Y",
    21582981: "DNPVHOLSYCBDA6UAB3MREZN6W4MZZV4OL227B5ABABQTHCJFMLD345JPXE",
}

export const SEND_ALGO = 268900

// algonode
const baseServerIndexer = "https://testnet-idx.algonode.cloud";
const baseServerAlgod = "https://testnet-api.algonode.cloud";
const port = "";
const token = "";
export const indexer = new algosdk.Indexer(token, baseServerIndexer, port);
export const algod = new algosdk.Algodv2(token, baseServerAlgod, port);

// vars
export let user = "";
export let bid_ins = {};
export let bid_outs = {};

export const peraWallet = new PeraWalletConnect();
console.log("global", peraWallet.isConnected)

// utils
export const b64_to_uint8array = (a) => new Uint8Array(atob(a).split("").map(function(c) {return c.charCodeAt(0); }));

export function uint8ArrayToBase64(uint8Array) {
    return new Promise((resolve, reject) => {
        const blob = new Blob([uint8Array], { type: 'application/octet-binary' });
        const reader = new FileReader();

        reader.onload = (event) => {
            const dataUrl = event.target.result;
            const base64 = dataUrl.split(',')[1];
            resolve(base64);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(blob);
    });
}

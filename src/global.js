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
export const indexerClient = new algosdk.Indexer(token, baseServerIndexer, port);
export const algodClient = new algosdk.Algodv2(token, baseServerAlgod, port);

// vars
export let user = "";
export let bid_ins = {};
export let bid_outs = {};

export const peraWallet = new PeraWalletConnect();

// utils
export const b64_to_uint8array = (a) => new Uint8Array(atob(a).split("").map(function(c) {return c.charCodeAt(0); }));
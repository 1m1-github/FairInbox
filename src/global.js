// imports
import algosdk from "algosdk"
import { PeraWalletConnect } from "@perawallet/connect"

// constants
export const FAIRMARKET_ACCOUNT = "7XDQJVL4XBHQSKF5FVUDMJ4U3W4UCQ5DO7JWAOCPRFZN2AEEQIXV27YE5I"
export const FAIRMARKET_APP = 202947056

export const FX_APP = 178969021
export const FX_LP_APP = 148607000
export const FX_LP_ACCOUNT = {
    10458941: "UDFWT5DW3X5RZQYXKQEMZ6MRWAEYHWYP7YUAPZKPW6WJK3JH3OZPL7PO2Y",
    21582981: "DNPVHOLSYCBDA6UAB3MREZN6W4MZZV4OL227B5ABABQTHCJFMLD345JPXE",
}

export const SEND_ALGO_AMOUNT = 268900
export const CREATE_PARAMS_ALGO_AMOUNT = 53700

export const MIN_ROUND = 29287438

export const CHRONY_PRECISION = 0.1

// algonode
const baseServerIndexer = "https://testnet-idx.algonode.cloud"
const baseServerAlgod = "https://testnet-api.algonode.cloud"
const port = ""
const token = ""
export const indexer = new algosdk.Indexer(token, baseServerIndexer, port)
export const algod = new algosdk.Algodv2(token, baseServerAlgod, port)

// vars
export let user = ""
export let bid_ins = []
export let bid_outs = []

export const peraWallet = new PeraWalletConnect()
console.log("global", peraWallet.isConnected)

// utils
export const b64_to_uint8array = (a) => new Uint8Array(atob(a).split("").map((c) => c.charCodeAt(0)))

export function uint8ArrayToBase64(uint8Array) {
    return new Promise((resolve, reject) => {
        const blob = new Blob([uint8Array], { type: 'application/octet-binary' })
        const reader = new FileReader()

        reader.onload = (event) => {
            const dataUrl = event.target.result
            const base64 = dataUrl.split(',')[1]
            resolve(base64)
        }

        reader.onerror = (error) => {
            reject(error)
        }

        reader.readAsDataURL(blob)
    })
}

export async function sign_and_send(txns, signer) {
    const txnGroup = algosdk.assignGroupID(txns)
    console.log("txnGroup", txnGroup)

    const txnGroupWithSigners = txnGroup.map((txn) => {return { txn: txn, signers: [signer] }})
    console.log("txnGroupWithSigners", txnGroupWithSigners)

    try {
        const signedTxn = await peraWallet.signTransaction([txnGroupWithSigners])
        const result = await algod
        .sendRawTransaction(signedTxn)
        .do()
        console.log("result", result)
    } catch (error) {
        console.log("cancel", error)
    }
}

export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    [array[i], array[j]] = [array[j], array[i]]
}
}

export function find_bid_by_id(bids, bid_id) {
    for (const bid of bids) {
        if (bid.id == bid_id) return bid
    }
    throw new Error("find_bid_in")
}

export async function get_box(box_id) {
    try {
        const boxResponse = await algod.getApplicationBoxByName(FAIRMARKET_APP, box_id).do()
        return boxResponse.value
    } catch (e) {
        return null
    }
}
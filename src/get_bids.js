import { get_box, indexer, user, bid_ins, bid_outs, peraWallet, MIN_ROUND, b64_to_uint8array, FAIRMARKET_ACCOUNT, uint8ArrayToBase64 } from "./global"
import algosdk from "algosdk"
import { fairmarket_ordering } from "./fairmarket"

function array_to_map(bids_array) {
    const bids_map = {}
    for (const bid of bids_array) {
        bids_map[bid.id] = bid
    }
    return bids_map
}

export async function get_in_bids() {
    console.log("get_in_bids", peraWallet.isConnected)
    
    const B = user
    const B_bytes = algosdk.decodeAddress(B).publicKey

    const transactionInfo = await indexer
        .searchForTransactions()
        .minRound(MIN_ROUND)
        .address(FAIRMARKET_ACCOUNT)
        .addressRole("receiver")
        .txType("axfer")
        .notePrefix(B_bytes)
        .do()
    console.log(transactionInfo)
    const bid_ins_array = await get_bids(transactionInfo.transactions)
    const bid_ins_map = array_to_map(bid_ins_array)
    const historical_types = [] // assume no history for now...TODO
    const bids = fairmarket_ordering(historical_types, Object.values(bid_ins_map))
    bid_ins = bids["non_LURK"]
    return bid_ins
}

export async function get_out_bids() {
    const A = user
    const transactionInfoFromA = await indexer
        .searchForTransactions()
        .minRound(MIN_ROUND)
        .address(A)
        .addressRole("sender")
        .txType("axfer")
        .do()
    const transactionInfo = transactionInfoFromA.transactions.filter((txn) => txn["asset-transfer-transaction"].receiver === FAIRMARKET_ACCOUNT)
    console.log("transactionInfo", transactionInfo)
    const bid_outs_array = await get_bids(transactionInfo)
    console.log("bid_outs_array", bid_outs_array)
    const bid_outs_map = array_to_map(bid_outs_array)
    console.log("bid_outs_map", bid_outs_map)
    const historical_types = [] // assume no history for now...TODO
    const bids = fairmarket_ordering(historical_types, Object.values(bid_outs_map))
    console.log("bids", bids)
    bid_outs = [...bids["non_LURK"], ...bids["LURK"]]
    return bid_outs
}

async function get_bids(transactions) {
    let bids = []
    for (const txn of transactions) {
        try { // for txns sent from A to FAIRMARKET_ACCOUNT without correct structure
            const bid = await bid_from_txn(txn)
            if (bid) bids.push(bid)
        } catch {
            console.error("bid_from_txn failed for txn", txn)
        }
    }
    console.log(bids)
    return bids
}

export async function bid_from_txn(txn) {
    // console.log(txn)

    const note_b64 = txn["note"]
    console.log("bid_from_txn, note_b64", note_b64)
    const note_bytes = b64_to_uint8array(note_b64)
    console.log("bid_from_txn, note_bytes", note_bytes)
    const bid_id_bytes = note_bytes.slice(33, 65)
    console.log("bid_from_txn, bid_id_bytes", bid_id_bytes)
    const bid_id = await uint8ArrayToBase64(bid_id_bytes)
    console.log("bid_from_txn, bid_id", bid_id)

    const bid_bytes = await get_box(bid_id_bytes)
    console.log("bid_bytes", bid_bytes)
    if (!bid_bytes) return null

    let counter = 0
    const INT_LENGTH = 8
    const ADDRESS_LENGTH = 32

    const time = algosdk.bytesToBigInt(bid_bytes.slice(counter, counter + INT_LENGTH))
    counter += INT_LENGTH
    console.log("time", time)

    const A = algosdk.encodeAddress(bid_bytes.slice(counter, counter + ADDRESS_LENGTH))
    counter += ADDRESS_LENGTH
    const B = algosdk.encodeAddress(bid_bytes.slice(counter, counter + ADDRESS_LENGTH))
    counter += ADDRESS_LENGTH
    console.log("A", A)
    console.log("B", B)

    const currency_id = Number(algosdk.bytesToBigInt(bid_bytes.slice(counter, counter + INT_LENGTH)))
    counter += INT_LENGTH
    console.log("currency_id", currency_id)
    const currency_amount = algosdk.bytesToBigInt(bid_bytes.slice(counter, counter + INT_LENGTH))
    counter += INT_LENGTH
    console.log("currency_amount", currency_amount)

    const fx_n = algosdk.bytesToBigInt(bid_bytes.slice(counter, counter + INT_LENGTH))
    counter += INT_LENGTH
    console.log("fx_n", fx_n)
    const fx_d = algosdk.bytesToBigInt(bid_bytes.slice(counter, counter + INT_LENGTH))
    counter += INT_LENGTH
    console.log("fx_d", fx_d)

    const chrony_importance = algosdk.bytesToBigInt(bid_bytes.slice(counter, counter + INT_LENGTH))
    counter += INT_LENGTH
    console.log("chrony_importance", chrony_importance)

    const highroller_importance = algosdk.bytesToBigInt(bid_bytes.slice(counter, counter + INT_LENGTH))
    counter += INT_LENGTH
    console.log("highroller_importance", highroller_importance)

    const subjective_importance = algosdk.bytesToBigInt(bid_bytes.slice(counter, counter + INT_LENGTH))
    counter += INT_LENGTH
    console.log("subjective_importance", subjective_importance)

    const min = algosdk.bytesToBigInt(bid_bytes.slice(counter, counter + INT_LENGTH))
    counter += INT_LENGTH
    console.log("min", min)

    const encryption_public_key = new Uint8Array(bid_bytes.slice(counter, counter + ADDRESS_LENGTH))
    counter += ADDRESS_LENGTH

    const data = String.fromCharCode.apply(null, bid_bytes.slice(counter, bid_bytes.length))
    console.log("data", data)

    return {
        id: bid_id,

        time, // epoch

        A, // from
        B, // to

        // currency
        currency_id,
        currency_amount,
        fx_n,
        fx_d,
        // currency

        // params
        importance: {
            CHR: chrony_importance,
            HR: highroller_importance,
            SUBJ: subjective_importance,
            LURK: 0,
        },
        min, // always in base currency
        // params

        // box public key
        // https://cs.opensource.google/go/x/crypto/+/refs/heads/master:nacl/box/box.go;drc=a8cc953517d1e689f501d9fcd7b6659a177d2216;l=165
        encryption_public_key,

        // msg
        data,
    }
}
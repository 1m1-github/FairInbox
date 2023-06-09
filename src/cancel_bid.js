// goal app call --from $A --app-id $FAIRMARKET_APP --app-arg "str:cancel_bid" --app-arg $BID_ID --box $BID_ID --foreign-asset $CURRENCY_ID --fee 2000

import algosdk from "algosdk"
import { textEncoder, sign_and_send, FAIRMARKET_APP, user, bid_outs, algod, peraWallet, b64_to_uint8array, find_bid_by_id } from "./global"

export function cancel(bid_id) {
    console.log("cancel", peraWallet.isConnected)
    const bid = find_bid_by_id(bid_outs, bid_id)
    return cancel_bid(user, bid_id, bid.currency_id)
}

async function cancel_bid(A, bid_id, currency_id) {
    console.log("cancel_bid", A, bid_id, currency_id)

    const suggestedParams = await algod.getTransactionParams().do()
    suggestedParams.fee = 3000
    suggestedParams.flatFee = true

    const arg0 = textEncoder.encode("cancel_bid")
    const arg1 = b64_to_uint8array(bid_id)
    const box = {appIndex: FAIRMARKET_APP, name: arg1}

    const txn = algosdk.makeApplicationCallTxnFromObject({
        from: A,
        appIndex: FAIRMARKET_APP,
        foreignAssets: [currency_id],
        appArgs: [arg0, arg1],
        boxes: [box],
        suggestedParams: suggestedParams,
    })
    console.log("txn", txn)

    return sign_and_send([txn], A)
}
// goal app call --from $A --app-id $FAIRMARKET_APP --app-arg "str:cancel_bid" --app-arg $BID_ID --box $BID_ID --foreign-asset $CURRENCY_ID --fee 2000

import algosdk from "algosdk";
import { FAIRMARKET_APP, user, bid_outs, algod, peraWallet, b64_to_uint8array } from "./global";

export function cancel(bid_id) {
    console.log("cancel", peraWallet.isConnected)
    const bid = bid_outs[bid_id]
    return cancel_bid(user, bid_id, bid.currency_id)
}

async function cancel_bid(A, bid_id, currency_id) {
    console.log("cancel_bid", A, bid_id, currency_id)

    const suggestedParams = await algod.getTransactionParams().do();
    suggestedParams.fee = 2000;
    suggestedParams.flatFee = true;

    const encoder = new TextEncoder();
    const arg0 = encoder.encode("cancel_bid")
    const arg1 = b64_to_uint8array(bid_id)
    const box = {appIndex: FAIRMARKET_APP, name: arg1}

    const txn = algosdk.makeApplicationCallTxnFromObject({
        from: A,
        appIndex: FAIRMARKET_APP,
        foreignAssets: [10458941],
        appArgs: [arg0, arg1],
        boxes: [box],
        suggestedParams: suggestedParams,
    });
    console.log("txn", txn)

    const txns = [{ txn, signers: [A] }]
    // console.log("txns", txns)

    try {
        const signedTxn = await peraWallet.signTransaction([txns]);
        // console.log("signedTxn", signedTxn)
        const result = await algod
        .sendRawTransaction(signedTxn)
        .do();
        console.log("result", result)
    } catch (error) {
        console.log("cancel", error);
    }
}
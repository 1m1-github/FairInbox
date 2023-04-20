// goal asset optin --account $B --assetid $CURRENCY_ID --out $TXNS_DIR/trade_optin.txn
// goal app call --from $B --app-id $FAIRMARKET_APP --app-account $A --foreign-asset $CURRENCY_ID --app-arg "str:trade" --app-arg $BID_ID --box $BID_ID --note $NOTE_2 --out $TXNS_DIR/trade_app_call.txn --fee 3000

import algosdk from "algosdk";
import { sign_and_send, user, bid_ins, algod, FAIRMARKET_APP, b64_to_uint8array, peraWallet } from "./global";

export function reply(bid_id) {
    console.log("reply", peraWallet.isConnected)
    const bid = bid_ins[bid_id]
    return trade(bid.A, user, bid_id, bid.currency_id, "ty")
}

async function trade(A, B, bid_id, currency_id, data) {
    console.log(A, B, bid_id, currency_id, data)

    const suggestedParams = await algod.getTransactionParams().do();
    
    // only needed if B not opted-in
    const optin_txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: B,
        to: B,
        amount: 0,
        assetIndex: currency_id,
        suggestedParams: suggestedParams,
    });

    const encoder = new TextEncoder();
    const arg0 = encoder.encode("trade")
    const arg1 = b64_to_uint8array(bid_id)
    const box0 = {appIndex: FAIRMARKET_APP, name: arg1}
    const note_bytes = encoder.encode(data)
    const suggestedParamsAppCall = {...suggestedParams}
    suggestedParamsAppCall.flatFee = true
    suggestedParamsAppCall.fee = 3000
    const app_call_txn = algosdk.makeApplicationCallTxnFromObject({
        from: B,
        appIndex: FAIRMARKET_APP,
        accounts: [A],
        foreignAssets: [currency_id],
        appArgs: [arg0, arg1],
        boxes: [box0],
        note: note_bytes,
        suggestedParams: suggestedParamsAppCall,
    });

    return sign_and_send([optin_txn, app_call_txn], B)
}
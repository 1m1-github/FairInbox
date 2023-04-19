// goal asset optin --account $B --assetid $CURRENCY_ID --out $TXNS_DIR/trade_optin.txn
// goal app call --from $B --app-id $FAIRMARKET_APP --app-account $A --foreign-asset $CURRENCY_ID --app-arg "str:trade" --app-arg $BID_ID --box $BID_ID --note $NOTE_2 --out $TXNS_DIR/trade_app_call.txn --fee 3000

import { bid_ins, algodClient, peraWallet } from "./global";

export function reply(bid_id) {
    console.log("reply", peraWallet.isConnected)
    const bid = bid_ins[bid_id]
    return trade(bid.A, user, bid_id, bid.currency_id, "ty")
}

async function trade(A, B, bid_id, currency_id, data) {
    const suggestedParams = await algodClient.getTransactionParams().do();
    
    // only needed if B not opted-in
    const optin = makeAssetTransferTxnWithSuggestedParams({
        from: B,
        to: B,
        amount: 0,
        assetIndex: currency_id,
        suggestedParams: suggestedParams,
    });

    const app_call = makeApplicationCallTxnFromObject({
        from: B,
        appIndex: FAIRMARKET_APP,
        accounts: [A],
        foreignAssets: [currency_id],
        appArgs: ["str:trade", bid_id],
        boxes: [bid_id],
        note: data,
        suggestedParams: suggestedParams,
    });

    const txnArray = [app_call];
    const txnGroup = algosdk.assignGroupID(txnArray);
    const signedTxns = txnGroup.map((txn) => txn.signTxn(B.privateKey))
    await algodClient.sendRawTransaction(signedTxns).do();
}
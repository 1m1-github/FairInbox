// goal app call --from $A --app-id $FX_APP --foreign-app $FX_LP_APP --foreign-asset $CURRENCY_ID --app-account $FX_LP_ACCOUNT --out $TXNS_DIR/FX.txn
// goal clerk send --from $A --to $FAIRMARKET_ACCOUNT --amount 268900 --out $TXNS_DIR/algo_send.txn
// goal app call --from $A --app-id $FAIRMARKET_APP --foreign-asset $CURRENCY_ID --app-arg "str:create_bid" --app-arg "addr:$B" --box $BID_ID --note $B.$NOTE_0 --out $TXNS_DIR/app_call.txn --fee 2000
// goal asset send --from $A --to $FAIRMARKET_ACCOUNT --amount $CURRENCY_AMOUNT --assetid $CURRENCY_ID --out $TXNS_DIR/asset_send.txn
// goal app call --from $A --app-id $FAIRMARKET_APP --app-arg "str:add_data" --note $NOTE_1 --out $TXNS_DIR/note_extra_1.txn
// BID_ID = hash($A$B$CURRENCY_ID$CURRENCY_AMOUNT$NOTE)

export function send(B, currency_amount, currency_id) {
    return create_bid(user, B, currency_amount, currency_id)
}

async function create_bid(A, B, currency_amount, currency_id) {
    const suggestedParams = await algodClient.getTransactionParams().do();

    const asset_send = makeAssetTransferTxnWithSuggestedParams({
        from: A,
        to: FAIRMARKET_ACCOUNT,
        amount: currency_amount,
        assetIndex: currency_id,
        suggestedParams: suggestedParams,
    });

    const app_call = makeApplicationCallTxnFromObject({
        from: A,
        appIndex: FAIRMARKET_APP,
        foreignAssets: [currency_id],
        appArgs: ["str:create_bid", `addr:${B}`, `b64:${bid_id}`],
        boxes: [bid_id],
        note: `${B}.${data}`,
        suggestedParams: suggestedParams,
    });

    const FX_txn = makeApplicationCallTxnFromObject({
        from: A,
        appIndex: FX_APP,
        accounts: [FX_LP_ACCOUNT[currency_id]],
        foreignApps: [FX_LP_APP],
        foreignAssets: [currency_id],
        suggestedParams: suggestedParams,
    });

    const algo_send = makePaymentTxnWithSuggestedParamsFromObject({
        from: A,
        to: FAIRMARKET_ACCOUNT,
        amount: SEND_ALGO,
        suggestedParams: suggestedParams,
    });

    const txnArray = [FX_txn, algo_send, app_call, asset_send];
    const txnGroup = algosdk.assignGroupID(txnArray);
    const signedTxns = txnGroup.map((txn) => txn.signTxn(A.privateKey))
    await algodClient.sendRawTransaction(signedTxns).do();
    // await algosdk.waitForConfirmation(client, alicesTxn.txID().toString(), 3);
}

// send msg

const suggestedParams = await client.getTransactionParams().do();

// goal app call --from $A --app-id $FX_APP --foreign-app $FX_LP_APP --foreign-asset $CURRENCY_ID --app-account $FX_LP_ACCOUNT --out $TXNS_DIR/FX.txn
// goal clerk send --from $A --to $FAIRMARKET_ACCOUNT --amount 268900 --out $TXNS_DIR/algo_send.txn
// goal app call --from $A --app-id $FAIRMARKET_APP --foreign-asset $CURRENCY_ID --app-arg "str:create_bid" --app-arg "addr:$B" --box $BID_ID --note $B.$NOTE_0 --out $TXNS_DIR/app_call.txn --fee 2000
// goal asset send --from $A --to $FAIRMARKET_ACCOUNT --amount $CURRENCY_AMOUNT --assetid $CURRENCY_ID --out $TXNS_DIR/asset_send.txn
// goal app call --from $A --app-id $FAIRMARKET_APP --app-arg "str:add_data" --note $NOTE_1 --out $TXNS_DIR/note_extra_1.txn

const asset_send = makeAssetTransferTxnWithSuggestedParams({
    from: A,
    to: FAIRMARKET_ACCOUNT,
    amount: CURRENCY_AMOUNT,
    assetIndex: CURRENCY_ID,
    suggestedParams: suggestedParams,
});

const app_call = makeApplicationCallTxnFromObject({
    from: A,
    appIndex: FAIRMARKET_APP,
    foreignAssets: [CURRENCY_ID],
    appArgs: ["str:create_bid", "addr:$B"],
    boxes: [BID_ID],
    note: "${B}.${msg}",
    suggestedParams: suggestedParams,
});

const FX_txn = makeApplicationCallTxnFromObject({
    from: A,
    appIndex: FX_APP,
    accounts: [FX_LP_ACCOUNT],
    foreignApps: [FX_LP_APP],
    foreignAssets: [CURRENCY_ID],
    suggestedParams: suggestedParams,
});

const algo_send = makePaymentTxnWithSuggestedParamsFromObject({
    from: A,
    to: FAIRMARKET_ACCOUNT,
    amount: 268900,
    appIndex: FX_APP,
    accounts: [FX_LP_ACCOUNT],
    foreignApps: [FX_LP_APP],
    foreignAssets: [CURRENCY_ID],
    suggestedParams: suggestedParams,
});
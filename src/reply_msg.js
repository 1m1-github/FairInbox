
// send msg

const suggestedParams = await client.getTransactionParams().do();

// goal asset optin --account $B --assetid $CURRENCY_ID --out $TXNS_DIR/trade_optin.txn
// goal app call --from $B --app-id $FAIRMARKET_APP --app-account $A --foreign-asset $CURRENCY_ID --app-arg "str:trade" --app-arg $BID_ID --box $BID_ID --note $NOTE_2 --out $TXNS_DIR/trade_app_call.txn --fee 3000

const reply = makeApplicationCallTxnFromObject({
    from: B,
    appIndex: FAIRMARKET_APP,
    accounts: [A],
    foreignAssets: [CURRENCY_ID],
    appArgs: ["str:trade", BID_ID],
    boxes: [BID_ID],
    note: msg,
    suggestedParams: suggestedParams,
});

const optin = makeAssetTransferTxnWithSuggestedParams({
    from: B,
    to: B,
    amount: 0,
    assetIndex: CURRENCY_ID,
    suggestedParams: suggestedParams,
});
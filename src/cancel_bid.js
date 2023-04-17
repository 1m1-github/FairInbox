// goal app call --from $A --app-id $FAIRMARKET_APP --app-arg "str:cancel_bid" --app-arg $BID_ID --box $BID_ID --foreign-asset $CURRENCY_ID --fee 2000

async function cancel_bid(A, bid_id, currency_id) {
    const suggestedParams = await client.getTransactionParams().do();

    const txn = makeApplicationCallTxnFromObject({
        from: A,
        appIndex: FAIRMARKET_APP,
        foreignAssets: [currency_id],
        appArgs: ["str:cancel_bid", bid_id],
        boxes: [bid_id],
        suggestedParams: suggestedParams,
    });

    await algodClient
    .sendRawTransaction(txn.signTxn(A.privateKey))
    .do();
}
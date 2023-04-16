
// cancel msg

const suggestedParams = await client.getTransactionParams().do();

// goal app call --from $A --app-id $FAIRMARKET_APP --app-arg "str:cancel_bid" --app-arg $BID_ID --box $BID_ID --foreign-asset $CURRENCY_ID --fee 2000

const cancel_msg = makeApplicationCallTxnFromObject({
    from: A,
    appIndex: FAIRMARKET_APP,
    foreignAssets: [CURRENCY_ID],
    appArgs: ["str:cancel_bid", BID_ID],
    boxes: [BID_ID],
    suggestedParams: suggestedParams,
});

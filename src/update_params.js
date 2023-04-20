// goal app call --from $B --app-id $FAIRMARKET_APP --app-arg "str:update_params" --app-arg $CHRONY_IMPORTANCE --app-arg $HIGHROLLER_IMPORTANCE --app-arg $SUBJECTIVE_IMPORTANCE --app-arg $MIN --app-arg $DESCRIPTION --app-arg $ENCRYPTION_PUBLIC_KEY --box "addr:$B"

import algosdk, { bigIntToBytes } from "algosdk";
import { algod } from "./global"

export async function update_params(chrony_importance, highroller_importance, subjective_importance, min, description, encryption_public_key) {
    const suggestedParams = await algod.getTransactionParams().do();

    const encoder = new TextEncoder();
    const arg0 = encoder.encode("update_params")
    const arg1 = bigIntToBytes(chrony_importance, 8)
    const arg2 = bigIntToBytes(highroller_importance, 8)
    const arg3 = bigIntToBytes(subjective_importance, 8)
    const arg4 = bigIntToBytes(min, 8)
    const arg5 = encoder.encode(description)
    const arg6 = encryption_public_key
    const box0 = {appIndex: FAIRMARKET_APP, name: user}
    const update_txn = algosdk.makeApplicationCallTxnFromObject({
        from: user,
        appIndex: FAIRMARKET_APP,
        appArgs: [arg0, arg1, arg2, arg3, arg4, arg5, arg6],
        boxes: [box0],
        suggestedParams: suggestedParams,
    });
    console.log("update_txn", update_txn)

    return sign_and_send([update_txn], user)
}
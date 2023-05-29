// goal app call --from $B --app-id $FAIRMARKET_APP --app-arg "str:update_params" --app-arg $CHRONY_IMPORTANCE --app-arg $HIGHROLLER_IMPORTANCE --app-arg $SUBJECTIVE_IMPORTANCE --app-arg $MIN --app-arg $DESCRIPTION --app-arg $ENCRYPTION_PUBLIC_KEY --box "addr:$B"

import algosdk, { bigIntToBytes } from "algosdk";
import { algod, user, FAIRMARKET_APP, get_box, sign_and_send } from "./global"

export async function get_params() {
    console.log("get_params, user", user)
    const user_uint8 = algosdk.decodeAddress(user).publicKey
    console.log("get_params, user_uint8", user_uint8)
    const box = await get_box(user_uint8)
    console.log("get_params, box", box)
    if (!box) {
        // default params
        return {
            chrony_importance: 1,
            highroller_importance: 1,
            subjective_importance: 1,
            min: 1,
            description: "00000000000000000000000000000000",
            encryption_public_key: "00000000000000000000000000000000",
        }
    }

    let counter = 0
    const INT_LENGTH = 8
    const ADDRESS_LENGTH = 32
    
    const chrony_importance = algosdk.bytesToBigInt(box.slice(counter, counter + INT_LENGTH))
    counter += INT_LENGTH
    const highroller_importance = algosdk.bytesToBigInt(box.slice(counter, counter + INT_LENGTH))
    counter += INT_LENGTH
    const subjective_importance = algosdk.bytesToBigInt(box.slice(counter, counter + INT_LENGTH))
    counter += INT_LENGTH
    const min = algosdk.bytesToBigInt(box.slice(counter, counter + INT_LENGTH))
    counter += INT_LENGTH
    
    const description = new Uint8Array(box.slice(counter, counter + ADDRESS_LENGTH))
    counter += ADDRESS_LENGTH
    const encryption_public_key = new Uint8Array(box.slice(counter, counter + ADDRESS_LENGTH))
    counter += ADDRESS_LENGTH

    return {
        chrony_importance,
        highroller_importance,
        subjective_importance,
        min,
        description,
        encryption_public_key,
    }
}

export async function update_params(chrony_importance, highroller_importance, subjective_importance, min, description, encryption_public_key) {
    const suggestedParams = await algod.getTransactionParams().do();

    const encoder = new TextEncoder();
    const arg0 = encoder.encode("update_params")
    const arg1 = bigIntToBytes(chrony_importance, 8)
    const arg2 = bigIntToBytes(highroller_importance, 8)
    const arg3 = bigIntToBytes(subjective_importance, 8)
    const arg4 = bigIntToBytes(min, 8)
    const arg5 = encoder.encode(description)
    const arg6 = encoder.encode(encryption_public_key)
    const box0 = {appIndex: FAIRMARKET_APP, name: algosdk.decodeAddress(user).publicKey}
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
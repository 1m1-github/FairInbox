import algosdk from "algosdk";
import { user, peraWallet, algod } from "./global"
import { addLoggedInView, connectButton } from "./views"

export function reconnectSession() {
    console.log("reconnectSession", peraWallet.isConnected)
    // Reconnect to the session when the component is mounted
    peraWallet
        .reconnectSession()
        .then((accounts) => {
            peraWallet.connector.on("disconnect", handleDisconnectWalletClick);
            console.log("reconnectSession 2", peraWallet.isConnected)
            if (accounts.length) {
                user = accounts[0];
            }

            connectButton.innerHTML = "logout";
        })
        .catch((e) => console.log(e));
}

export function handleConnectWalletClick(event) {
    event.preventDefault();
    console.log("handleConnectWalletClick", peraWallet.isConnected)

    peraWallet
        .connect()
        .then((newAccounts) => {
            peraWallet.connector.on("disconnect", handleDisconnectWalletClick);
            console.log("handleConnectWalletClick 2", peraWallet.isConnected)
            user = newAccounts[0];

            connectButton.innerHTML = "logout";
            
            run()

            console.log('user', user)

            addLoggedInView()

        })
        .catch((error) => {
            if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
                console.log(error);
            }
        });
}

export function handleDisconnectWalletClick(event) {
    event.preventDefault();
    console.log("handleDisconnectWalletClick", peraWallet.isConnected)
    peraWallet.disconnect().catch((error) => {
        console.log(error);
        console.log("handleDisconnectWalletClick 2", peraWallet.isConnected)
    });

    user = "";
    connectButton.innerHTML = "login";
}

async function generatePaymentTxns({
    to,
    initiatorAddr
}) {
    console.log("initiatorAddr", initiatorAddr)
    console.log("to", to)
    const suggestedParams = await algod.getTransactionParams().do();

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: initiatorAddr,
        to,
        amount: 1,
        suggestedParams
    });

    return [{ txn, signers: [initiatorAddr] }];
}

async function run() {
    console.log("user 1", user)
    const txGroups = await generatePaymentTxns({
        to: "GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A",
        initiatorAddr: user
    });
    console.log("user 2", user)
    try {
        const signedTxnGroup = await peraWallet.signTransaction([txGroups]);
        const { txId } = await algod.sendRawTransaction(signedTxnGroup).do();
    } catch (error) {
        console.log("Couldn't sign payment txns", error);
    }
}
import { user, peraWallet } from "./global"
import { addLoggedInView, loginButton } from "./views"

export function reconnectSession() {
    console.log("reconnectSession", peraWallet.isConnected)
    // Reconnect to the session when the component is mounted
    peraWallet
        .reconnectSession()
        .then((accounts) => {
            peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);
            console.log("reconnectSession 2", peraWallet.isConnected)
            if (accounts.length) {
                user = accounts[0];
                addLoggedInView()
            }

            loginButton.innerHTML = "logout";
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

            loginButton.innerHTML = "logout";
            
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
    loginButton.innerHTML = "login";
}
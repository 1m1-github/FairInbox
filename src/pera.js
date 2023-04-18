import { user, peraWallet } from "./global"
import { addLoggedInView, connectButton } from "./views"

export function reconnectSession() {
    // Reconnect to the session when the component is mounted
    peraWallet
        .reconnectSession()
        .then((accounts) => {
            peraWallet.connector.on("disconnect", handleDisconnectWalletClick);

            if (accounts.length) {
                user = accounts[0];
            }

            connectButton.innerHTML = "logout";
        })
        .catch((e) => console.log(e));
}

export function handleConnectWalletClick(event) {
    event.preventDefault();

    peraWallet
        .connect()
        .then((newAccounts) => {
            peraWallet.connector.on("disconnect", handleDisconnectWalletClick);

            user = newAccounts[0];

            connectButton.innerHTML = "logout";

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

    peraWallet.disconnect().catch((error) => {
        console.log(error);
    });

    user = "";
    connectButton.innerHTML = "login";
}
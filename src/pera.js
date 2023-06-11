import { user, peraWallet } from "./global"
import { init } from "./views"

document.addEventListener("DOMContentLoaded", reconnectSession()) // TODO creates infinite loop

export function reconnectSession() {
    console.log("reconnectSession", peraWallet.isConnected)
    // Reconnect to the session when the component is mounted
    peraWallet
        .reconnectSession()
        .then((accounts) => {
            peraWallet.connector?.on("disconnect", handleDisconnectWalletClick)
            console.log("reconnectSession 2", peraWallet.isConnected)
            if (peraWallet.isConnected && accounts.length) {
                user = accounts[0]
                init()
            }
        })
        .catch((e) => console.log(e))
}

export function handleConnectWalletClick(event) {
    event.preventDefault()
    console.log("handleConnectWalletClick", peraWallet.isConnected)

    peraWallet
        .connect()
        .then((newAccounts) => {
            peraWallet.connector.on("disconnect", handleDisconnectWalletClick)
            console.log("handleConnectWalletClick 2", peraWallet.isConnected)
            user = newAccounts[0]            
            console.log('user', user)
            init()
        })
        .catch((error) => {
            if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
                console.log(error)
            }
        })
}

export function handleDisconnectWalletClick(event) {
    event.preventDefault()
    console.log("handleDisconnectWalletClick", peraWallet.isConnected)
    peraWallet.disconnect().catch((error) => {
        console.log(error)
        console.log("handleDisconnectWalletClick 2", peraWallet.isConnected)
    })
    user = ""
    init()
}
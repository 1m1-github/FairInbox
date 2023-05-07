import { reconnectSession, handleConnectWalletClick, handleDisconnectWalletClick } from "./pera.js"
import { user, peraWallet } from "./global.js"
import { get_in_bids, get_out_bids } from "./get_bids.js"
import { cancel } from "./cancel_bid.js"
import { reply } from "./trade.js"
import { send } from "./create_bid.js"
import { update_params } from "./update_params.js"

export function init() {
    addLoginButton()

    // DEBUG
    addLoggedInView()
}

export const connectButton = document.createElement("button");

export async function addLoggedInView() {
    await addSendButton()
    await addInOutboxButtons()
    await addSettingsButton()
}

// login
function addLoginButton() {
    document.body.appendChild(connectButton);
    connectButton.innerHTML = "login";
    document.addEventListener("DOMContentLoaded", reconnectSession());
    connectButton.addEventListener("click", (event) => {
        if (user) {
            handleDisconnectWalletClick(event);
        } else {
            handleConnectWalletClick(event);
        }
    });
}

// settings
export function addSettingsButton() {
    const button = document.createElement("button");
    document.body.appendChild(button);
    button.innerHTML = "settings"
    button.addEventListener("click", (event) => {
        console.log("addSettingsButton", peraWallet.isConnected)
        if (!user) return
        // TODO show settings and allow update
    });
}

// send
export function addSendButton() {
    const button = document.createElement("button");
    document.body.appendChild(button);
    button.innerHTML = "send"
    button.addEventListener("click", (event) => {
        console.log("addCreateBidButton", peraWallet.isConnected)
        if (!user) return
        let A = "HQMMGGF3KJRPTEZV6GKGT6PNQJBZWUBIQMHG4XBVGBIV2E2V4LWOFHVEAA"
        let B = A
        // let B = "5B3SUGACYLICWU3DHXYCS45NDNEFZCZM4MCKCKQA3DLGKZEOFQR74HLGEU"
        let currency_amount = 2
        let currency_id = 10458941
        let data = "hi"
        return send(B, currency_id, currency_amount, data)
    });
}

// iobox
export function addInOutboxButtons() {
    addInboxButton()
    addOutboxButton()
}
const addInboxButton = () => addIOButton("inbox", () => reload(get_in_bids, "reply", reply))
const addOutboxButton = () => addIOButton("outbox", () => reload(get_out_bids, "cancel", cancel))
function addIOButton(name, reload_f) {
    const button = document.createElement("button");
    document.body.appendChild(button);
    button.innerHTML = name
    button.addEventListener("click", (event) => {
        console.log("global", peraWallet.isConnected)
        if (!user) return
        return reload_f();
    });
}
async function reload(get_bids, action_name, action_f) {
    console.log("global", peraWallet.isConnected)
    const bids_map = await get_bids();
    const bids = Object.values(bids_map)
    document.body.appendChild(document.createElement("br"))
    for (const bid of bids) {
        const bidDiv = bid_to_html(bid, action_name, action_f)
        document.body.appendChild(bidDiv)
        document.body.appendChild(document.createElement("br"))
    }
    return bids
}

function bid_to_html(bid, action_name, action_f) {
    const bidDiv = document.createElement("div");
    const f = `${action_f}("${bid.id}")`;
    console.log(f)
    bidDiv.innerHTML = `
    <div>${bid.A}</div>
    <div>${bid.B}</div>
    <div>${bid.currency_id}</div>
    <div>${bid.currency_amount}</div>
    <div>${bid.type}</div>
    <div>${bid.time}</div>
    <div>${bid.data}</div>
    `
    const action = document.createElement("button")
    action.innerHTML = action_name
    action.onclick = () => action_f(bid.id)
    bidDiv.append(action)
    return bidDiv
}
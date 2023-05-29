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

export const loginButton = document.createElement("button");

export async function addLoggedInView() {
    await addSendButton()
    await addInOutboxButtons()
    await addSettingsButton()
}

// login
function addLoginButton() {
    document.body.appendChild(loginButton);
    loginButton.innerHTML = "login"
    loginButton.id = "loginbutton"
    loginButton.classList = "button"
    document.addEventListener("DOMContentLoaded", reconnectSession());
    loginButton.addEventListener("click", (event) => {
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
    button.id = "settingsbutton"
    button.classList = "button"
    button.addEventListener("click", (event) => {
        console.log("addSettingsButton", peraWallet.isConnected)
        if (!user) return
        // TODO show settings and allow update
    });
}

// send
export function addSendButton() {
    const B = document.createElement("input");
    B.id = "send_B"
    B.classList = "input addr"
    B.setAttribute("placeholder", "To")
    document.body.appendChild(B);
    const currency_amount = document.createElement("input");
    currency_amount.id = "send_currency_amount"
    currency_amount.classList = "input int"
    currency_amount.setAttribute("placeholder", "currency amount")
    document.body.appendChild(currency_amount);
    const currency_id = document.createElement("input");
    currency_id.id = "send_currency_id"
    currency_id.classList = "input int"
    currency_id.setAttribute("placeholder", "currency id")
    document.body.appendChild(currency_id);
    const data = document.createElement("input");
    data.id = "send_data"
    data.classList = "input str"
    data.setAttribute("placeholder", "msg")
    document.body.appendChild(data);
    const button = document.createElement("button");
    button.id = "send_button"
    button.classList = "button"
    document.body.appendChild(button);
    button.innerHTML = "send"
    button.addEventListener("click", (event) => {
        console.log("addCreateBidButton", peraWallet.isConnected)
        if (!user) return
        // let A = "HQMMGGF3KJRPTEZV6GKGT6PNQJBZWUBIQMHG4XBVGBIV2E2V4LWOFHVEAA"
        // let B = A
        // // let B = "5B3SUGACYLICWU3DHXYCS45NDNEFZCZM4MCKCKQA3DLGKZEOFQR74HLGEU"
        // let currency_amount = 2
        // let currency_id = 10458941
        // let data = "hi"
        console.log("B", B.value)
        // return send(B.value, Number(currency_id.value), Number(currency_amount.value), data.value)
        return send("5B3SUGACYLICWU3DHXYCS45NDNEFZCZM4MCKCKQA3DLGKZEOFQR74HLGEU", Number(currency_id.value), Number(currency_amount.value), data.value)
    });
}

// iobox
export function addInOutboxButtons() {
    addInboxButton()
    addOutboxButton()
}
const addInboxButton = () => addIOButton("inbox", () => reload(get_in_bids, reply_action))
const addOutboxButton = () => addIOButton("outbox", () => reload(get_out_bids, cancel_action))
function addIOButton(name, reload_f) {
    const button = document.createElement("button");
    button.id = `${name}_button`
    button.classList = "button"
    document.body.appendChild(button);
    button.innerHTML = name
    button.addEventListener("click", (event) => {
        console.log("global", peraWallet.isConnected)
        if (!user) return
        return reload_f();
    });
}
async function reload(get_bids, action_f) {
    console.log("global", peraWallet.isConnected)
    const bids_map = await get_bids();
    const bids = Object.values(bids_map)
    document.body.appendChild(document.createElement("br"))
    for (const bid of bids) {
        const bidDiv = bid_to_html(bid, action_f)
        document.body.appendChild(bidDiv)
        document.body.appendChild(document.createElement("br"))
    }
    return bids
}

function reply_action(bid_id) {
    const msg = document.createElement("input")
    msg.id = `${bid_id}_reply_msg`
    msg.classList = "reply str"
    const button = document.createElement("button")
    button.id = `${bid_id}_reply_button`
    button.classList = "reply button"
    button.innerHTML = "reply"
    button.onclick = () => reply(bid_id, msg.value)
    const div = document.createElement("div")
    div.id = `${bid_id}_reply`
    div.classList = "reply"
    div.append(msg)
    div.append(button)
    return div
}

function cancel_action(bid_id) {
    const button = document.createElement("button")
    button.id = `${bid_id}_cancel_button`
    button.classList = "cancel button"
    button.innerHTML = "cancel"
    button.onclick = () => cancel(bid_id)
    return button
}

function bid_to_html(bid, action_f) {
    const bidDiv = document.createElement("div");
    bidDiv.id = bid.id
    bidDiv.classList = "bid"
    const f = `${action_f}("${bid.id}")`;
    console.log(f)
    bidDiv.innerHTML = `
    <div id=${bid.id}_A class="A addr">${bid.A}</div>
    <div id=${bid.id}_B class="B addr">${bid.B}</div>
    <div id=${bid.id}_currency_id class="int">${bid.currency_id}</div>
    <div id=${bid.id}_currency_amount class="int">${bid.currency_amount}</div>
    <div id=${bid.id}_type class="bid_type">${bid.type}</div>
    <div id=${bid.id}_time class="time">${bid.time}</div>
    <div id=${bid.id}_data class="str">${bid.data}</div>
    `
    const action = action_f(bid.id)
    bidDiv.append(action)
    return bidDiv
}
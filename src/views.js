import { handleConnectWalletClick, handleDisconnectWalletClick } from "./pera.js"
import { user, peraWallet } from "./global.js"
import { get_in_bids, get_out_bids } from "./get_bids.js"
import { cancel } from "./cancel_bid.js"
import { reply } from "./trade.js"
import { send } from "./create_bid.js"
import { get_params, update_params } from "./params.js"
import { get_replies } from "./get_replies.js"

export function init() {

    console.log("init, user", user)

    clear()
    
    addAboutButton()
    addLoginButton()
    
    if (user) {
        addComposeButton()
        addInOutboxButtons()
        addRepliesButton()
        addParamsButton()
    }
}

function clear() {
    document.body.replaceChildren()
}

// about
function addAboutButton() {
    const button = document.createElement("button")
    document.body.appendChild(button)
    button.id = "aboutbutton"
    button.classList = "button"
    button.innerHTML = "about"
    button.addEventListener("click", (event) => {
        init()
        const msgs = [
            "* fairinbox",
            "* evolution of the inbox ~ attach coins to any msg ~ recipient gets coins if it replies",
            "* <a href=https://github.com/1m1-github/FairInbox>open source</a>",
            "* market driven order ~ <a href=https://github.com/1m1-github/FairMarket/blob/main/whitepaper/FairMarket.pdf>white paper</a>",
            "* minimalistic ~ WASM -> HTML + vanilla js",
            "* decentralized: ipfs + trustless computer (Algorand)",
            "* user driven design ~ submit your css to <a href=mailto:fairinbox@1m1.io>fairinbox@1m1.io</a> with a single .css file attached and the subject \"FAIRINBOX CSS\" ~ if your file passes the security check, it will be available for everyone to use ~ the default is css free",
            "* privacy ~ encrypted msgs coming soon (if there is demand)",
            "* community owned ~ value and governance will be fully run by the community",
            "* <a href=https://youtu.be/qu6TXRGHSr8>demo</a>",
            "* prev commit: 0edb96af0dd34b35192a9cb46de986da0640a54d",
            "* reward: auto-receive 1 project coin when sending or replying to a msg (if you are opted-in): ASA ID 1130719852",
        ]
        for (const msg of msgs) {
            const d = document.createElement("div")
            d.innerHTML = msg
            document.body.appendChild(d)
        }
    })
}

// login
function addLoginButton() {
    const loginButton = document.createElement("button")
    document.body.appendChild(loginButton)
    loginButton.id = "loginbutton"
    loginButton.classList = "button"
    loginButton.innerHTML = user ? `logout ${user}` : `login`
    loginButton.addEventListener("click", (event) => {
        if (user) {
            handleDisconnectWalletClick(event)
        } else {
            handleConnectWalletClick(event)
        }
    })
}

// settings
export function addParamsButton() {
    const button = document.createElement("button")
    document.body.appendChild(button)
    button.innerHTML = "params"
    button.id = "params_button"
    button.classList = "button"
    button.addEventListener("click", async (event) => {

        init()

        console.log("addParamsButton", peraWallet.isConnected)
        if (!user) return
        
        const params = await get_params()
        console.log("addParamsButton, params", params)

        const params_div = document.createElement("div")
        params_div.id = "params"
        params_div.classList = "params"

        const chrony_importance_input = document.createElement("input")
        chrony_importance_input.id = "chrony_importance_input"
        chrony_importance_input.classList = "params importance int"
        chrony_importance_input.setAttribute("placeholder", "chrony importance")
        chrony_importance_input.type = "number"
        chrony_importance_input.value = params["chrony_importance"]
        params_div.appendChild(chrony_importance_input)

        const highroller_importance_input = document.createElement("input")
        highroller_importance_input.id = "highroller_importance_input"
        highroller_importance_input.classList = "params importance int"
        highroller_importance_input.setAttribute("placeholder", "highroller importance")
        highroller_importance_input.type = "number"
        highroller_importance_input.value = params["highroller_importance"]
        params_div.appendChild(highroller_importance_input)

        const subjective_importance_input = document.createElement("input")
        subjective_importance_input.id = "subjective_importance_input"
        subjective_importance_input.classList = "params importance int"
        subjective_importance_input.setAttribute("placeholder", "subjective importance")
        subjective_importance_input.type = "number"
        subjective_importance_input.value = params["subjective_importance"]
        params_div.appendChild(subjective_importance_input)

        const min_input = document.createElement("input")
        min_input.id = "min_input"
        min_input.classList = "params min int"
        min_input.setAttribute("placeholder", "min")
        min_input.type = "number"
        min_input.value = params["min"]
        params_div.appendChild(min_input)

        const update_params_button = document.createElement("button")
        update_params_button.id = "update_params_button"
        update_params_button.classList = "button params"
        update_params_button.innerHTML = "update params"
        update_params_button.addEventListener("click", (event) => {
            console.log("updateParamsButton", peraWallet.isConnected)
            if (!user) return
            const description = "00000000000000000000000000000000" // TODO
            const encryption_public_key = "00000000000000000000000000000000" // TODO
            return update_params(chrony_importance_input.value, highroller_importance_input.value, subjective_importance_input.value, min_input.value, description, encryption_public_key)
        })
        params_div.appendChild(update_params_button)

        document.body.appendChild(params_div)
    })
}

// send
export function addComposeButton() {
    const compose_button = document.createElement("button")
    compose_button.id = "compose_button"
    compose_button.classList = "button"
    document.body.appendChild(compose_button)
    compose_button.innerHTML = "compose"
    compose_button.addEventListener("click", (event) => {
        init()

        if (!user) return

        document.body.appendChild(document.createElement("br"))

        const B = document.createElement("input")
        B.id = "send_B"
        B.classList = "input addr"
        B.setAttribute("placeholder", "To")
        document.body.appendChild(B)

        document.body.appendChild(document.createElement("br"))

        const currency_amount = document.createElement("input")
        currency_amount.id = "send_currency_amount"
        currency_amount.classList = "input int"
        currency_amount.setAttribute("placeholder", "currency amount")
        document.body.appendChild(currency_amount)

        document.body.appendChild(document.createElement("br"))

        const currency_id = document.createElement("input")
        currency_id.id = "send_currency_id"
        currency_id.classList = "input int"
        currency_id.setAttribute("placeholder", "currency id")
        document.body.appendChild(currency_id)

        document.body.appendChild(document.createElement("br"))

        const data = document.createElement("input")
        data.id = "send_data"
        data.classList = "input str"
        data.setAttribute("placeholder", "msg")
        document.body.appendChild(data)

        // console.log("addCreateBidButton", peraWallet.isConnected)
        // let A = "HQMMGGF3KJRPTEZV6GKGT6PNQJBZWUBIQMHG4XBVGBIV2E2V4LWOFHVEAA"
        // let B = A
        // // let B = "5B3SUGACYLICWU3DHXYCS45NDNEFZCZM4MCKCKQA3DLGKZEOFQR74HLGEU"
        // let currency_amount = 2
        // let currency_id = 10458941
        // let data = "hi"
        // console.log("B", B.value)

        document.body.appendChild(document.createElement("br"))

        const send_button = document.createElement("button")
        send_button.id = "send_button"
        send_button.classList = "button"
        document.body.appendChild(send_button)
        send_button.innerHTML = "send"
        send_button.addEventListener("click", (event) => {
            // return send("5B3SUGACYLICWU3DHXYCS45NDNEFZCZM4MCKCKQA3DLGKZEOFQR74HLGEU", Number(currency_id.value), Number(currency_amount.value), data.value)
            return send(B.value, Number(currency_id.value), Number(currency_amount.value), data.value)
        })
    })
}

// iobox
export function addInOutboxButtons() {
    addInboxButton()
    addOutboxButton()
}
const addInboxButton = () => addIOButton("inbox", () => reload(get_in_bids, reply_action))
const addOutboxButton = () => addIOButton("outbox", () => reload(get_out_bids, cancel_action))
function addIOButton(name, reload_f) {
    const button = document.createElement("button")
    button.id = `${name}_button`
    button.classList = "button"
    document.body.appendChild(button)
    button.innerHTML = name
    button.addEventListener("click", (event) => {
        console.log("global", peraWallet.isConnected)
        init()
        if (!user) return
        return reload_f()
    })
}
async function reload(get_bids, action_f) {
    console.log("global", peraWallet.isConnected)
    const bids_map = await get_bids()
    const bids = Object.values(bids_map)
    document.body.appendChild(document.createElement("br"))
    
    if (bids.length === 0) {
        const inbox_empty = document.createElement("div")
        inbox_empty.id = "empty_message"
        inbox_empty.classList = "info"
        inbox_empty.innerHTML = "empty"
        document.body.appendChild(inbox_empty)
    }

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
    const bidDiv = document.createElement("div")
    bidDiv.id = bid.id
    bidDiv.classList = "bid"
    const f = `${action_f}("${bid.id}")`
    console.log(f)
    bidDiv.innerHTML = `
    <div id=${bid.id}_A class="A addr">from: ${bid.A}</div>
    <div id=${bid.id}_B class="B addr">to: ${bid.B}</div>
    <div id=${bid.id}_currency_id class="int">currency id: ${bid.currency_id}</div>
    <div id=${bid.id}_currency_amount class="int">currency amount: ${bid.currency_amount}</div>
    <div id=${bid.id}_time class="time">time: ${bid.time}</div>
    <div id=${bid.id}_data class="str">data: ${bid.data}</div>
    `
    const action = action_f(bid.id)
    bidDiv.append(action)
    return bidDiv
}

function addRepliesButton() {
    const button = document.createElement("button")
    document.body.appendChild(button)
    button.innerHTML = "replies"
    button.addEventListener("click", async (event) => {
        console.log("replies", peraWallet.isConnected)
        init()
        if (!user) return
        const replies = await get_replies()

        if (replies.length === 0) {
            const inbox_empty = document.createElement("div")
            inbox_empty.id = "empty_message"
            inbox_empty.classList = "info"
            inbox_empty.innerHTML = "empty"
            document.body.appendChild(inbox_empty)
        }

        for (const reply of replies) {
            document.body.appendChild(reply)
            document.body.appendChild(document.createElement("br"))
        }
    })
}

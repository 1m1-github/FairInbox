import { indexer, FAIRMARKET_APP, user, MIN_ROUND, b64_to_uint8array, FAIRMARKET_ACCOUNT, uint8ArrayToBase64 } from "./global"
import { bid_from_txn } from "./get_bids"
import algosdk from "algosdk"

export async function get_replies() {
    const A = user
    console.log("get_replies, A", A)
    const A_uint8 = algosdk.decodeAddress(A).publicKey
    console.log("get_replies, A_uint8", A_uint8)
    const A_b64 = await uint8ArrayToBase64(A_uint8)
    console.log("get_replies, A_b64", A_b64)

    const transactionInfo = await indexer
        .searchForTransactions()
        .minRound(MIN_ROUND)
        .address(FAIRMARKET_ACCOUNT)
        .addressRole("sender")
        .txType("axfer")
        .notePrefix(A_b64)
        .do()
    console.log("transactionInfo", transactionInfo)
    return get_replies_from_transactionInfo(transactionInfo)
}

async function get_replies_from_transactionInfo(transactionInfo) {
    let replies = []
    for (const txn of transactionInfo.transactions) {
        // const txn = transactionInfo.transactions[0]
        // console.log("txn", txn)
        const reply = await reply_from_txn(txn)
        const html = reply_to_html(reply)
        if (reply) replies.push(html)
    }
    console.log(replies)
    return replies
}

async function reply_from_txn(reply_txn) {
    console.log("reply_from_txn, reply_txn", reply_txn)
    // console.log(txn["application-transaction"])
    // console.log(txn["application-transaction"]["application-args"])
    const args = reply_txn["application-transaction"]["application-args"]
    const bid_id = args[1]
    console.log("reply_from_txn, bid_id", bid_id)
    if (!bid_id) return null
    const bid_id_bytes = b64_to_uint8array(bid_id)
    console.log("reply_from_txn, bid_id_bytes", bid_id_bytes)
    
    const A = user
    const B = reply_txn["sender"]
    
    const note1_bytes = new TextEncoder().encode(`${B}.`)
    const note_bytes = new Uint8Array([...note1_bytes, ...bid_id_bytes])
    console.log("reply_from_txn, note1_bytes", note1_bytes)
    console.log("reply_from_txn, note_bytes", note_bytes)

    const transactionInfoBid = await indexer
        .searchForTransactions()
        .minRound(MIN_ROUND)
        .address(A)
        .addressRole("sender")
        // .address(FAIRMARKET_ACCOUNT)
        // .addressRole("receiver")
        .txType("axfer")
        .notePrefix(note_bytes)
        .do()
    
    console.log("reply_from_txn, transactionInfoBid", transactionInfoBid)
    // if (transactionInfoBid.transactions.length !== 1) return null // should find exactly 1 match
    const bid_axfer_txn = transactionInfoBid.transactions[0]
    console.log("reply_from_txn, bid_axfer_txn", bid_axfer_txn)

    const currency_id = bid_axfer_txn["asset-transfer-transaction"]["asset-id"]
    const currency_amount = bid_axfer_txn["asset-transfer-transaction"]["amount"]
    const time = bid_axfer_txn["round-time"]
    
    const question_bytes = b64_to_uint8array(bid_axfer_txn["note"]).slice(92)
    const question = new TextDecoder().decode(question_bytes)
    
    const answer_bytes = b64_to_uint8array(reply_txn["note"])
    const answer = new TextDecoder().decode(answer_bytes)

    const obj = {
        id: bid_id,
        A,
        B,
        currency_id,
        currency_amount,
        time,
        question,
        answer,
    }
    console.log("reply_from_txn, obj", obj)

    return obj
}

function reply_to_html(reply) {
    const replyDiv = document.createElement("div")
    replyDiv.id = reply.id
    replyDiv.classList = "reply"
    replyDiv.innerHTML = `
    <div id=${reply.id}_A class="A addr">from: ${reply.A}</div>
    <div id=${reply.id}_B class="B addr">to: ${reply.B}</div>
    <div id=${reply.id}_currency_id class="int">currency id: ${reply.currency_id}</div>
    <div id=${reply.id}_currency_amount class="int">currency amount: ${reply.currency_amount}</div>
    <div id=${reply.id}_time class="time">time: ${reply.time}</div>
    <div id=${reply.id}_question class="str data question">data: ${reply.question}</div>
    <div id=${reply.id}_answer class="str data answer">data: ${reply.answer}</div>
    `
    return replyDiv
}
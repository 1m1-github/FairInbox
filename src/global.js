// imports
import algosdk from "algosdk"
import { PeraWalletConnect } from "@perawallet/connect"

export const textEncoder = new TextEncoder()
export const textDecoder = new TextDecoder()

// constants MAINNET
export const PROJECT_COIN = 1130719852

export const FAIRMARKET_ACCOUNT = "EMHKWV5XTWAEVM3WN2FFHGHO5AWQSAC6VUNK36PWYC4AK4ARMULCQY7IY4"
export const FAIRMARKET_APP = 1123674460

export const FX_APP = 1118290368
export const FX_LP_APP = 1002541853
export const FX_LP_ACCOUNT = {
    31566704: "2PIFZW53RHCSFSYMCFUBW4XOCXOMB7XOYQSQ6KGT3KVGJTL4HM6COZRNMM",
    1096015467: "QT2GLKM6FSVHQMRQ53POMDBMCHH452FERI6WGNAT2J34KVRZPV6GA5DGOI",
    287867876: "6JRMS5GWPSRHBDKNWO46PDVMOLWYURW2VXZEWBR2QOKHOFNR2VLAFDU3TU",
    793124631: "6NAKH5IVZGBDTDEETKV6SLBJNDHZZASX2YO2CUPESH2IPRBN3LSKCH4E2M",
    27165954: "X2YCX7P6MUEANKFOTTDXXKTAZFKKKYZ544W6TWFARGVRTEWQQNZP4BY7ZA",
    470842789: "DJIP7MVWAAJKTPDG7SEH64OD4QIZMRHOH5LYHY4YXWRZRG6YMD2ERJ4C2Q",
    523683256: "6FS7FD2Q6LCSCDDMAQMRZFYRXAC7XATD5XE777TH5HP3CKYRINMF4YNYJA",
    386192725: "FKMV6GSU57764TQ5NLSBEDXNPUXL7OAOKANVDP2A6FSB77BHI3GTWHQAZA",
    388592191: "TVFMM3ZTK3QJM2BT5AZ4O3VIU4XMODAGWJ2AMAJ64OI55NO5DLHXS4ADTY",
    2751733: "7UDZ3MGXEYHJ2OGC5ST4WEHE7GRHEGWIBTPX6L4NUKHINGFEMFGESRXFXI",
    312769: "MM4NTQDAT32TSVDE65YXYUPDFVMVP2LUREJCQ4PJV4MFQCW5VV23Y5SEHM",
    975807033: "XQZ7P6QN6A77RHWK6G3LTCBHZJG3NRZFUT6BYJMOTOUAAWHBL7AEKNAV2I",
    753137719: "BQ64QBC7CLJI5SUMOWZPYHN4R4RRI52LUWGDO2SASVWJ7KABC66LPW6A4Q",
    226701642: "VTO4WOPIS4TAYYECOZXS6LHMACE46MWW36X3A7X5MKJVK37UCC6IFJFULI",
    1076768277: "RIGDKWA7VJNZ4OAKNV53UJ4RDKA2DOFVFZ2U4VDP64IR4CKSNOP45EVAX4",
    251014570: "P6ZE6ZTUZCMRUXHJ7ZFAXYDZSUYZRJHAEG3NYGHYZURLOMOEMRILCYJTVM",
    1054801592: "SKFWGGQAFA2DPZXCPUNBWZZGI42ZWCJ35XYTN6XFFZATHY355NBRVP5BEU",
    790704501: "2JKSQ4VSLLTPJB6E7FFKO5BMUUPCBKC75QMCJF4K4JE6URFF2JNJW23V4I",
    386195940: "L6CDM74YQEZ7RABX7AGTD32ZJEMDOJ5OGY4QNGZUS35S5VPIGC5UNHZTPA",
    923640017: "ED57RDPEG53HHJKAHQGFBF74GUZ5JHH464424OZ4NSOJVV5VAL5YLZXQ5U",
    1065092715: "4PE4NCV73L26GIUKZPZTIEASAERJQL2E4IFVXPTOPWVQFZ2RHCQW3VU7AM",
    818432243: "RAMRCQUQBSWOKOLV6OGBK6LTURVFMY2Z4U47FFO2NIPEOUI53UMRYW2TZY",
    756578163: "UFSDSEJIMDSZY6AN2ZWJDJS2YSYVAXDSO5FLJAPCTS2NGRGTAEJDGR34QY",
    300208676: "JEHWNGR6SW3VWEHFHCNWHNQFVS5U7FW2P6JCGU327Z2DNN2RL77EIVESUQ",
    403499324: "G6ACWKTWJAFNSEAIDNBUIX6UOSDBRXL46ULGBD62RQTM7CLM6IYF2WT3UQ",
    444035862: "FX2SYGWYWUEMJCQCL33VH36P4NI2STOWXATPIEVEKJKRCDHDSHFLJNDACM",
    947923645: "7GYM7BFFGSE3WOGWF6M47VXORZKTP37FULMLPHWMTH2ICDQ6DPCXXUH6Q4",
}

// constants TESTNET
// export const PROJECT_COIN = 240148078 // TESTNET

// export const FAIRMARKET_ACCOUNT = "LBO7BOTQ4TYJMXN6CLVAW27O7FLG2PNSLKPKZD2TV63J65E2777HHB7GRA"
// export const FAIRMARKET_APP = 236003065

// export const FX_APP = 178969021
// export const FX_LP_APP = 148607000
// export const FX_LP_ACCOUNT = {
//     10458941: "UDFWT5DW3X5RZQYXKQEMZ6MRWAEYHWYP7YUAPZKPW6WJK3JH3OZPL7PO2Y",
//     21582981: "DNPVHOLSYCBDA6UAB3MREZN6W4MZZV4OL227B5ABABQTHCJFMLD345JPXE",
// }

export const NFD_URL = "https://api.nf.domains/nfd"
// export NFD_URL = "https://api.testnet.nf.domains/nfd" // TESTNET

export const SEND_ALGO_AMOUNT = 298900
export const CREATE_PARAMS_ALGO_AMOUNT = 53700

export const MIN_ROUND = 29617434

export const CHRONY_PRECISION = 0.1

// algonode
const baseServerIndexer = "https://mainnet-idx.algonode.cloud"
const baseServerAlgod = "https://xna-mainnet-api.algonode.cloud"
// const baseServerIndexer = "https://testnet-idx.algonode.cloud"
// const baseServerAlgod = "https://testnet-api.algonode.cloud"
const port = ""
const token = ""
export const indexer = new algosdk.Indexer(token, baseServerIndexer, port)
export const algod = new algosdk.Algodv2(token, baseServerAlgod, port)

// vars
export let user = ""
export let bid_ins = []
export let bid_outs = []

export const peraWallet = new PeraWalletConnect()
console.log("global", peraWallet.isConnected)

// utils
export const b64_to_uint8array = (a) => new Uint8Array(atob(a).split("").map((c) => c.charCodeAt(0)))

export function uint8ArrayToBase64(uint8Array) {
    return new Promise((resolve, reject) => {
        const blob = new Blob([uint8Array], { type: 'application/octet-binary' })
        const reader = new FileReader()

        reader.onload = (event) => {
            const dataUrl = event.target.result
            const base64 = dataUrl.split(',')[1]
            resolve(base64)
        }

        reader.onerror = (error) => {
            reject(error)
        }

        reader.readAsDataURL(blob)
    })
}

export async function sign_and_send(txns, signer) {
    const txnGroup = algosdk.assignGroupID(txns)
    console.log("txnGroup", txnGroup)

    const txnGroupWithSigners = txnGroup.map((txn) => { return { txn: txn, signers: [signer] } })
    console.log("txnGroupWithSigners", txnGroupWithSigners)

    try {
        const signedTxn = await peraWallet.signTransaction([txnGroupWithSigners])
        const result = await algod
            .sendRawTransaction(signedTxn)
            .do()
        console.log("result", result)
    } catch (error) {
        console.log("cancel", error)
    }
}

// TODO weird stuff going on:
// console.log("shuffle, array", array) shows elements in diff order than // console.log("shuffle, array[0]", array[0])
export default function shuffle(array) {
    // console.log("shuffle, array", array)
    for (let i = 0; i < array.length; i++) {
        // console.log("shuffle, i", i)
        // console.log("shuffle, array[0]", array[0])
        // console.log("shuffle, array[1]", array[1])
        // console.log("shuffle, array[i]", array[i])
        // console.log("shuffle, array[j]", array[j])
        const j = Math.floor(Math.random() * array.length)
        // console.log("shuffle, j", j)
        // console.log("shuffle, array[0]", array[0])
        // console.log("shuffle, array[1]", array[1])
        // console.log("shuffle, array[i]", array[i])
        // console.log("shuffle, array[j]", array[j])
        if (i !== j) {
            // console.log("shuffle, swap", i, j)
            // console.log("shuffle, array[0]", array[0])
            // console.log("shuffle, array[1]", array[1])
            // console.log("shuffle, array[i]", array[i])
            // console.log("shuffle, array[j]", array[j])
            const tmp = array[i]
            // console.log("shuffle, tmp", tmp)
            // console.log("shuffle, array[0]", array[0])
            // console.log("shuffle, array[1]", array[1])
            // console.log("shuffle, array[i]", array[i])
            // console.log("shuffle, array[j]", array[j])
            array[i] = array[j]
            // console.log("shuffle, array[i]", array[i])
            array[j] = tmp
            // console.log("shuffle, array[j]", array[j])
        }
    }
    // console.log("shuffle, after array", array)
}

export function find_bid_by_id(bids, bid_id) {
    for (const bid of bids) {
        if (bid.id == bid_id) return bid
    }
    throw new Error("find_bid_in")
}

export async function get_box(box_id) {
    try {
        const boxResponse = await algod.getApplicationBoxByName(FAIRMARKET_APP, box_id).do()
        return boxResponse.value
    } catch (e) {
        return null
    }
}

export function bid_type(bid, min) {
    console.log("bid_type, bid.id, min, bid.fx_d == 0, bid.fx_n == 0", bid.id, min, bid.fx_d == 0, bid.fx_n == 0)
    if (bid.fx_d == 0 && bid.fx_n == 0) return "SUBJ"

    const value_in_base = Number(bid.currency_amount) * Number(bid.fx_n) / Number(bid.fx_d)
    console.log("bid_type, bid.currency_amount, bid.fx_n, bid.fx_d, bid.fx_n / bid.fx_d, value_in_base", bid.currency_amount, bid.fx_n, bid.fx_d, bid.fx_n / bid.fx_d, value_in_base)

    const upper_bound_CHRONY = Number(min) * Math.exp(CHRONY_PRECISION)
    const lower_bound_CHRONY = Number(min) * Math.exp(-CHRONY_PRECISION)
    console.log("bid_type, upper_bound_CHRONY", upper_bound_CHRONY)
    console.log("bid_type, lower_bound_CHRONY", lower_bound_CHRONY)

    if (value_in_base < lower_bound_CHRONY) return "LURK"
    if (value_in_base <= upper_bound_CHRONY) return "CHR"
    return "HR"
}
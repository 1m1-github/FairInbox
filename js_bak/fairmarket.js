// fair ordering
// https://github.com/1m1-github/FairMarket

import { CHRONY_PRECISION, shuffle } from "./global"

const TYPES = ["CHR", "HR", "LURK", "SUBJ"]

const bid_to_params_summary = (bid) => `${bid.importance["CHR"]}.${bid.importance["HR"]}.${bid.importance["LURK"]}.${bid.importance["SUBJ"]}.${bid.min}`

function create_blocks(bids) {
    // group by sequential constant params
    let blocks = []
    let current_block = []
    let previous_params = ''
    for (const bid of bids) {
        const current_params = bid_to_params_summary(bid)

        if (current_params == previous_params) {
            current_block.push(bid)
        }
        else {
            blocks.push(current_block)
            current_block = [bid]
        }

        previous_params = current_params
    }
    if (0 < current_block.length) blocks.push(current_block)
    return blocks.slice(1) // remove first, current_block = []
}

// CHANGES current_block and ordered_LURK_bids
function promote_LURK(current_block, ordered_LURK_bids, block_min) {

    // promote LURK if appropriate
    const promoted_ix = []
    for (let j = 0; j < ordered_LURK_bids.length; j++) {
        const bid = ordered_LURK_bids[j]
        const new_type_for_LURK = bid_type(bid, block_min)
        // console.log("new_type_for_LURK", new_type_for_LURK)
        if (new_type_for_LURK !== "LURK") {
            // bid is before blocks[i] in time
            promoted_ix.push(j)
        }
    }

    // console.log("promoted_ix", promoted_ix)
    // console.log("ordered_LURK_bids", ordered_LURK_bids)

    // move promoted LURK to block
    // const promoted_LURK_bids = []
    let splice_offset = 0
    for (const j of promoted_ix) {
        // console.log("j", j)
        const bid = ordered_LURK_bids[j + splice_offset]
        // console.log("bid", bid)
        // promoted_LURK_bids.push(bid)
        current_block.unshift(bid)
        // console.log("promoted_LURK_bids", promoted_LURK_bids)
        ordered_LURK_bids.splice(j + splice_offset, 1)
        // console.log("ordered_LURK_bids", ordered_LURK_bids)
        splice_offset -= 1
    }
    // console.log("promoted_LURK_bids", promoted_LURK_bids)
    // console.log("ordered_LURK_bids", ordered_LURK_bids)
    // console.log("current_block", current_block)
    // current_block = [...promoted_LURK_bids, ...current_block]
    // console.log("current_block", current_block)
}

export function fairmarket_ordering(historical_types, bids) {
    console.log("bids", bids)
    // order by time
    bids = bids.sort((a, b) => a.time - b.time) // TODO check

    // group by constant sequetial params
    const blocks = create_blocks(bids)

    // order constant param groups
    const ordered_bids = []
    const ordered_LURK_bids = []
    for (let i = 0; i < blocks.length; i++) {

        // console.log("i", i)

        let current_block = blocks[i]
        const block_min = current_block[0].min
        const block_importance = current_block[0].importance

        if (0 < i) { // only possible from 2nd block
            // changes current_block, ordered_LURK_bids
            // console.log("before promote", current_block, ordered_LURK_bids, block_min)
            promote_LURK(current_block, ordered_LURK_bids, block_min)
            // console.log("after promote", current_block, ordered_LURK_bids, block_min)
        }

        const { bids, bids_map } = fairmarket_ordering_given_constant_params(historical_types, current_block, block_min, block_importance)
        ordered_bids.push(...bids)

        ordered_LURK_bids.push(...bids_map["LURK"])

        historical_types.push(...ordered_bids) // TODO check
    }

    // merge
    return ordered_bids
}

// input: bids have same params and ordered by time
// example
// historical_types = now ... [CHSCH] ... later history
// (actual historical types are {"CHR", "HR", "LURK", "SUBJ"})
// now = T(0)
// bids = [B_T(1), ..., B_T(N)]
// bids_map[CHR] = [B_T(1), B_T(2)]
// bids_map[HR] = [B_T(6), B_T(3)]
// bids_map[SUBJ] = []
// bids_map[LURK] = [B_T(5), B_T(4)]
// target importance = {CHF=1, HR = 1, SUBJ = 1, LURK = 0} => dec target importance = (1/3 1/3)
// => ideal types future = [HSCHCHS] ... now ... historical_types

// target importance = {CHF=1, HR = 2, SUBJ = 1, LURK = 0} => dec target importance = (1/4 2/4)
// attack  => ideal types future = [CHH SSSSSSSSSSSSSSSHS] ... now ... historical_types
// attack  => ideal types future = [HCH SSSSSSSSSSSSSSSHS] ... now ... historical_types
// theory
// X_N_CHS
// C_N_CHS (2/4,1/4) 0.3535533905932738
// H_N_CHS (1/4,2/4) 0
// S_N_CHS (1/4,1/4) 0.25
// X_N_HCH
// C_N_HCH (2/4,2/4) 0.25
// H_N_HCH (1/4,3/4) 0.25
// S_N_HCH (1/4,2/4) 0
// X_N_SHC
// C_N_SHC (2/4,1/4) 0.3535533905932738
// H_N_SHC (1/4,2/4) 0
// S_N_SHC (1/4,1/4) 0.25
// X_N_HSH
// C_N_HSH (1/4,2/4) 0
// H_N_HSH (0,3/4) 0.3535533905932738
// S_N_HSH (0,2/4) 0.25
// X_N_CHS

// [...SHCHSHCHSH_N_CHS]

// // no S

// X_N_CHS
// C_N_CHS (2/4,1/4) 0.3535533905932738
// H_N_CHS (1/4,2/4) 0
// X_N_HCH
// C_N_HCH (2/4,2/4) 0.25
// H_N_HCH (1/4,3/4) 0.25
// X_N_HHC
// C_N_HHC (2/4,2/4) 0.25
// H_N_HHC (1/4,3/4) 0.25
// X_N_CHH
// C_N_CHH (2/4,1/4) 0.3535533905932738
// H_N_CHH (1/4,3/4) 0.25
// X_N_HCH
// C_N_HCH (2/4,2/4) 0.25
// H_N_HCH (1/4,3/4) 0.25
// X_N_HHC
// C_N_HHC (2/4,2/4) 0.25
// H_N_HHC (1/4,3/4) 0.25
// X_N_CHH
// C_N_CHH (2/4,1/4) 0.3535533905932738
// H_N_CHH (1/4,3/4) 0.25
// X_N_HCH
// C_N_HCH (2/4,2/4) 0.25
// H_N_HCH (1/4,3/4) 0.25
// X_N_HHC

// [...HHCHHCHH_N_CHS]

// => ideal types future = [HSCHSHH HH] ... now ... historical_types
// C_N_HC => (2/3,1/3)
// H_N_HC => (1/3,2/3) => 0
// S_N_HC => (1/3,1/3)
// => X_N_HHC

// is all future S disappear, does the future change?

// hard case: one empty cat
// future ... C ... now ... CH => dec import = (2/3 1/3) => delta = 0.4714045207910317
// future ... H ... now ... CH => dec import = (1/3 2/3) => delta = 0.0
// future ... S ... now ... CH => dec import = (1/3 1/3) => delta = 0.3333333333333333
// => no winner => ok
// future_C == future_H?
// future ... C ... C ... now ... CH => dec import = (1 0) => delta = 0.9428090415820634
// future ... H ... C ... now ... CH => dec import = (2/3 1/3) => delta = 0.4714045207910317
// future ... C ... H ... now ... CH => dec import = (2/3 1/3) => delta = 0.4714045207910317
// future ... H ... H ... now ... CH => dec import = (1/3 2/3) => delta = 0.0
// => H

// follow the theory, whitepaper, live
// that is what is guaranteed
// need to show that maximal wait time is guaranteed ()
// actual wait time can be better
// those that leave the market need not be accounted for anymore
// serviced/traded reality matters

function fairmarket_ordering_given_constant_params(historical_types, chronological_bids, block_min, block_importance) {

    // console.log("chronological_bids", chronological_bids)

    const block_decimal_importance = decimal_importance(block_importance)

    // filtering
    const bids_map = create_bids_map(chronological_bids, block_min)

    // SUBJ - later apply learning algo ~ e.g. on special SUBJ bids where the data is text which is also the currency as an NFT representing a promise/contract which is stated in said text ~ an LLM could learn to mimick ones likes and dislikes, opening for the most open and fair human bartering market
    // for now, randomize, its the same as having a learning algo without data
    shuffle(bids_map["SUBJ"])

    // internal ordering of HR is by value
    const value = (a) => a.currency_amount * a.fx_n / a.fx_d
    bids_map["HR"].sort((a, b) => value(b) - value(a))
    bids_map["LURK"].sort((a, b) => value(b) - value(a))
    
    // console.log("bids_map", bids_map)

    const actual_importance = {
        CHR: 0,
        HR: 0,
        SUBJ: 0,
        LURK: 0,
    }
    const history_length = Math.min(historical_types.length, importance_sum(block_importance) - 1)
    historical_types.slice(0, history_length).map(ht => actual_importance[ht]++)
    // console.log("history_length", history_length)

    const bids = []
    const indices = {
        CHR: 0,
        HR: 0,
        SUBJ: 0,
        LURK: 0,
    }

    const num_non_LURK_bids = bids_map["CHR"].length + bids_map["HR"].length + bids_map["SUBJ"].length
    for (let i = 0; i < num_non_LURK_bids; i++) {

        // console.log("i", i)

        // simulation for each type
        let min_delta = Infinity
        let min_type = "CHR"
        for (const type of TYPES) {
            // console.log("type", type)

            // LURKERS are never part of its own bids block
            if (type == "LURK") continue

            // nothing left
            if (bids_map[type].length == 0) continue
            if (indices[type] == bids_map[type].length) continue
            // console.log("something left")

            // simulation of actual_importance change
            actual_importance[type]++
            const actual_decimal_importance = decimal_importance(actual_importance)
            // console.log("actual_decimal_importance", actual_decimal_importance)
            // console.log("target_decimal_importance", target_decimal_importance)
            const d = delta(actual_decimal_importance, block_decimal_importance)
            // console.log("d", d)
            if (d < min_delta) {
                min_delta = d
                min_type = type
            }
            actual_importance[type]--
        }

        // push
        bids.push(bids_map[min_type][indices[min_type]])
        indices[min_type]++

        // update actual_importances
        actual_importance[min_type]++
        if (i < history_length) {
            actual_importance[historical_types[history_length - i - 1]]--
        }
        else {
            const bid_to_lose = bids[i - history_length]
            const type_to_lose = bid_type(bid_to_lose, bid_to_lose.min)
            actual_importance[type_to_lose]--
        }

        // console.log("actual_importances", actual_importances)
        // console.log("min_delta", min_delta)
        // console.log("min_type", min_type)
        // console.log("indices", indices)
        // console.log("bids", bids)
    }

    return {
        bids,
        bids_map,
    }
}

function create_bids_map(bids, block_min) {
    const bids_map = {
        CHR: [],
        HR: [],
        SUBJ: [],
        LURK: [],
    }
    for (const bid of bids) {
        // console.log("bid", bid)
        const type = bid_type(bid, block_min)
        // console.log(bid.id, type)
        bids_map[type].push(bid)
    }
    return bids_map
}

function bid_type(bid, min) {
    // console.log("bid_type", bid.id, min)
    if (bid.fx_d == 0 && bid.fx_n == 0) return "SUBJ"

    const value_in_base = bid.currency_amount * bid.fx_n / bid.fx_d
    // console.log("bid_type, value_in_base", value_in_base)

    const upper_bound_CHRONY = Number(min) * Math.exp(CHRONY_PRECISION)
    const lower_bound_CHRONY = Number(min) * Math.exp(-CHRONY_PRECISION)
    // console.log("bid_type, upper_bound_CHRONY", upper_bound_CHRONY)
    // console.log("bid_type, lower_bound_CHRONY", lower_bound_CHRONY)

    if (value_in_base < lower_bound_CHRONY) return "LURK"
    if (value_in_base <= upper_bound_CHRONY) return "CHR"
    return "HR"
}

function importance_sum(importances) {
    return Number(importances["CHR"] + importances["HR"] + importances["SUBJ"])
}
function decimal_importance(importances) {
    const N = importance_sum(importances)
    return [
        Number(importances["CHR"]) / N,
        Number(importances["HR"]) / N,
    ]
}

const delta = (vec1, vec2) => Math.sqrt((vec1[0] - vec2[0]) ** 2 + (vec1[1] - vec2[1]) ** 2)

// TESTS

// import
// const CHRONY_PRECISION = 0
// function shuffle(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }
// }

// // delta
// console.log(delta([0.1, 0.3], [0.2, 0.5]) === 0.223606797749979)
// console.log("\n")

// // decimal_importance
// console.log(decimal_importance({
//     CHR: 1,
//     HR: 2,
//     SUBJ: 3,
//     LURK: 0,
// }))
// console.log([1 / 6, 2 / 6])
// console.log("\n")

// // bid_type(bid, min)
// console.log(bid_type({
//     currency_amount: 1,
//     fx_n: 1,
//     fx_d: 1,
// }, 1) === "CHR")
// console.log(bid_type({
//     currency_amount: 1.11,
//     fx_n: 1,
//     fx_d: 1,
// }, 1) === "HR")
// console.log(bid_type({
//     currency_amount: 1,
//     fx_n: 2,
//     fx_d: 1,
// }, 1) === "HR")
// console.log(bid_type({
//     currency_amount: 1,
//     fx_n: 1,
//     fx_d: 2,
// }, 1) === "LURK")
// console.log(bid_type({
//     currency_amount: 0.95,
//     fx_n: 1,
//     fx_d: 1,
// }, 1) === "CHR")
// console.log(bid_type({
//     currency_amount: 0.95,
//     fx_n: 0,
//     fx_d: 0,
// }, 1) === "SUBJ")
// console.log("\n")

// fairmarket_ordering_given_constant_params(historical_types, chronological_bids)

// let id = 0
// const chrony = (importance, min) => {
//     return {
//         id: id++,
//         currency_amount: min,
//         fx_n: 1,
//         fx_d: 1,
//         importance,
//         min,
//     }
// }
// const highroller = (importance, min) => {
//     return {
//         id: id++,
//         currency_amount: min + id,
//         fx_n: 1,
//         fx_d: 1,
//         importance,
//         min,
//     }
// }
// const lurker = (importance, min) => {
//     return {
//         id: id++,
//         currency_amount: min - id,
//         fx_n: 1,
//         fx_d: 1,
//         importance,
//         min,
//     }
// }
// const subjective = (importance, min) => {
//     return {
//         id: id++,
//         currency_amount: 0,
//         fx_n: 0,
//         fx_d: 0,
//         importance,
//         min,
//     }
// }

// // importance = {
// //     CHR: 1,
// //     HR: 2,
// //     SUBJ: 1,
// //     LURK: 0,
// // }
// // const min = 100
// // console.log(fairmarket_ordering_given_constant_params(["CHR", "HR", "SUBJ"], [
// //     chrony(importance, min),
// //     chrony(importance, min),
// //     highroller(importance, min),
// //     highroller(importance, min),
// //     subjective(importance, min),
// //     subjective(importance, min),
// //     lurker(importance, min),
// //     lurker(importance, min),
// // ]))

// // fairmarket_ordering(historical_types, bids)
// // importance_1 = {
// //     CHR: 1,
// //     HR: 2,
// //     SUBJ: 1,
// //     LURK: 0,
// // }
// // const min_1 = 100
// // importance_2 = {
// //     CHR: 1,
// //     HR: 2,
// //     SUBJ: 1,
// //     LURK: 0,
// // }
// // const min_2 = 90
// // importance_3 = {
// //     CHR: 1,
// //     HR: 2,
// //     SUBJ: 1,
// //     LURK: 0,
// // }
// // const min_3 = 100
// // const ordered_bids = fairmarket_ordering(["CHR", "HR", "SUBJ"], [
// //     chrony(importance_1, min_1),
// //     chrony(importance_1, min_1),
// //     highroller(importance_1, min_1),
// //     highroller(importance_1, min_1),
// //     subjective(importance_1, min_1),
// //     subjective(importance_1, min_1),
// //     lurker(importance_1, min_1),
// //     lurker(importance_1, min_1),
// //     chrony(importance_2, min_2),
// //     chrony(importance_2, min_2),
// //     highroller(importance_2, min_2),
// //     highroller(importance_2, min_2),
// //     subjective(importance_2, min_2),
// //     subjective(importance_2, min_2),
// //     lurker(importance_2, min_2),
// //     lurker(importance_2, min_2),
// //     // chrony(importance_3, min_3),
// //     // chrony(importance_3, min_3),
// //     // highroller(importance_3, min_3),
// //     // highroller(importance_3, min_3),
// //     // subjective(importance_3, min_3),
// //     // subjective(importance_3, min_3),
// //     // lurker(importance_3, min_3),
// //     // lurker(importance_3, min_3),
// // ])
// // // console.log(ordered_bids)
// // // console.log(ordered_bids.map((bid) => bid_type(bid, bid.min)))
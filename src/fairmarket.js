// fair ordering
// https://github.com/1m1-github/FairMarket

import { CHRONY_PRECISION, shuffle } from "./global"

const TYPES = ["CHR", "HR", "LURK", "SUBJ"]

const bid_to_params_summary = (bid) => `${bid.chrony_importance}.${bid.highroller_importance}.${bid.subjective_importance}.${bid.min}`

function fairmarket_ordering(historical_types, bids) {

    // order by time
    bids = bids.sort((a, b) => a.time - b.time) // TODO check

    // group by sequential constant params
    const blocks = []
    const current_block = []
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
    blocks = blocks.slice(1)

    // order constant param groups
    const ordered_bids = []
    const ordered_LURK = []
    for (let i = 0; i < blocks.length; i++) {
        const {bids, bids_map} = fairmarket_ordering_given_constant_params(historical_types, blocks[i])
        ordered_bids.push(...bids)

        if (0 < i) {
            for (const bid of ordered_LURK) {
                const new_type_for_LURK = bid_type(bid, bids[0].min)
                if (new_type_for_LURK !== "LURK") {
                    ordered_bids.push(bid)
                }
            }
        }
        ordered_LURK.push(...bids_map["LURK"])

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

function fairmarket_ordering_given_constant_params(historical_types, chronological_bids) {

    // importance
    const importances = {
        CHR: chronological_bids[0].chrony_importance,
        HR: chronological_bids[0].highroller_importance,
        SUBJ: chronological_bids[0].subjective_importance,
        LURK: 0,
    }
    const target_decimal_importance = decimal_importance(importances)

    // filtering
    const bids_map = {
        CHR: [],
        HR: [],
        SUBJ: [],
        LURK: [],
    }
    for (const bid of chronological_bids.reverse()) {
        const type = bid_type(bid, bid.min)
        if (type == "CHR") bids_map["CHR"].push(bid)
        else if (type == "HR") bids_map["HR"].push(bid)
        else if (type == "SUBJ") bids_map["SUBJ"].push(bid)
        else if (type == "LURK") bids_map["LURK"].push(bid)
        else throw new Error("impossible bid type", bid, type)
    }

    // SUBJ - later apply learning algo ~ e.g. on special SUBJ bids where the data is text which is also the currency as an NFT representing a promise/contract which is stated in said text ~ an LLM could learn to mimick ones likes and dislikes, opening for the most open and fair human bartering market
    // for now, randomize, its the same as having a learning algo without data
    shuffle(bids_map["SUBJ"])

    // internal ordering of HR is by value
    const value = (a) => a.currency_amount * a.fx_n / a.fx_d
    bids_map["HR"].sort((a, b) => value(a) - value(b)) // TODO check
    bids_map["LURK"].sort((a, b) => value(a) - value(b)) // TODO check

    const actual_importances = {
        CHR: 0,
        HR: 0,
        SUBJ: 0,
        LURK: 0,
    }
    const history_length = Math.min(historical_types.length, importance_sum - 1)
    historical_types.slice(0, history_length).map(ht => actual_importances[ht]++)
    
    const bids = []
    const indices = {
        CHR: 0,
        HR: 0,
        SUBJ: 0,
        LURK: 0,
    }
    let min_delta = Inf
    let min_type = "CHR"
    for (let i = 0; i < chronological_bids.length; i++) {
        
        // simulation for each type
        for (let type of TYPES) {
            // LURKERS are never part of its own bids block
            if (type == "LURK") continue

            // nothing left
            if (bids_map[type].length == 0) continue
            if (indices[type] == bids_map[type].length) continue

            // simulation of actual_importance change
            actual_importances[type]++
            const actual_decimal_importance = decimal_importance(actual_importances)
            const d = delta(actual_decimal_importance, target_decimal_importance)
            if (d < min_delta) {
                min_delta = d
                min_type = type
            }
            actual_importances[type]--

            // push
            bids.push(bids_map[min_type][indices[type]])
            indices[type]++
        }
    }

    return {
        bids,
        bids_map,
    }
}

function bid_type(bid, min) {
    if (bid.fx_d == 0 && bid.fx_n == 0) return "SUBJ"

    const value_in_base = bid.amount * bid.fx_n / bid.fx_d

    const upper_bound_CHRONY = min * Math.exp(CHRONY_PRECISION)
    const lower_bound_CHRONY = min * Math.exp(-CHRONY_PRECISION)

    if (value_in_base < lower_bound_CHRONY) return "LURK"
    if (value_in_base <= upper_bound_CHRONY) return "CHR"
    return "HR"
}

function decimal_importance(importances) {
    const importance_sum = importances["CHR"] + importances["HR"] + importances["SUBJ"]
    return [
        importances["CHR"] / importance_sum,
        importances["HR"] / importance_sum,
    ]
}

const delta = (vec1, vec2) => Math.sqrt((vec1[0] - vec2[0])^2 + (vec1[1] - vec2[1])^2)
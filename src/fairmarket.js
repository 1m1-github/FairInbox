// fair ordering
// https://github.com/1m1-github/FairMarket

import { CHRONY_PRECISION } from "./global"

const bid_to_params_summary = (bid) => `${bid.chrony_importance}.${bid.highroller_importance}.${bid.subjective_importance}.${bid.min}`

function fairmarket_ordering(bids) {

    // order by time
    bids = bids.sort((a, b) => a.time - b.time)

    // group by sequential constant params
    const groups = []
    const current_group = []
    let previous_params = ''
    for (const bid of bids) {
        const current_params = bid_to_params_summary(bid)
        
        if (current_params == previous_params) {
            current_group.push(bid)
        }
        else {
            groups.push(current_group)
            current_group = [bid]
        }

        previous_params = current_params
    }
    if (0 < current_group.length) groups.push(current_group)
    groups = groups.slice(1)

    // order constant param groups
    const ordered_groups = groups.map(fairmarket_ordering_given_constant_params)

    // merge
    return ordered_groups.flat()
}

function bid_type(bid) {
    if (fx_d == 0 && fx_n == 0) return "SUBJ"
    
    const currency_amount_after_fx = bid.currency_amount * bid.fx_n / bid.fx_d
    const chrony_lower_bound = max(0.0, bid.min * Math.exp(-CHRONY_PRECISION))
    const chrony_upper_bound = bid.min * Math.exp(CHRONY_PRECISION)

    if (currency_amount_after_fx < chrony_lower_bound) return "LURK"
    if (currency_amount_after_fx <= chrony_upper_bound) return "CHR"
    return "HR"
}

// input: bids have same params and ordered by time
// example
// historical_types = now ... [CHSCH] ... later history
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

function fairmarket_ordering_given_constant_params(historical_types, bids) {

    // importance
    const importances = {
        CHR: bids[0].chrony_importance,
        HR: bids[0].highroller_importance,
        SUBJ: bids[0].subjective_importance,
        LURK: 0,
    }
    const importance_sum = importances["CHR"] + importances["HR"] + importances["SUBJ"]
    const importances_decimal = {
        CHR: importances["CHR"] / importance_sum,
        HR: importances["HR"] / importance_sum,
        SUBJ: importances["SUBJ"] / importance_sum,
        LURK: 0,
    }

    // filtering
    const bids_map = {
        CHR: [],
        HR: [],
        SUBJ: [],
        LURK: [],
    }
    for (const bid of bids) {
        const type = bid_type(bid)
        if (type == "CHR") bids_map["CHR"].push(bid)
        if (type == "HR") bids_map["HR"].push(bid)
        if (type == "SUBJ") bids_map["SUBJ"].push(bid)
        if (type == "LURK") bids_map["LURK"].push(bid)
        throw new Error("impossible bid type", bid, type)
    }

    // internal ordering of HR is by value
    const value = (a) => a.currency_amount * a.fx_n / a.fx_d
    bids_map["HR"].sort((a, b) => value(a) - value(b))

    // indices
    const indices = {
        CHR: 0,
        HR: 0,
        SUBJ: 0,
        LURK: 0,
    }

    for (let i = 0; i < bids.length; i++) {
        
    }

    return {
        bids: ordered_bids,
        subjective: subjective_bids,
    }
}
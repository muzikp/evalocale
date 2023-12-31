"use strict";
var currencies = new Map();
["AFN","EUR","ALL","DZD","USD","EUR","AOA","XCD",null,"XCD","ARS","AMD","AWG","AUD","EUR","AZN","BSD","BHD","BDT","BBD","BYN","EUR","BZD","XOF","BMD","INR","BTN","BOB","BOV","USD","BAM","BWP","NOK","BRL","USD","BND","BGN","XOF","BIF","CVE","KHR","XAF","CAD","KYD","XAF","XAF","CLP","CLF","CNY","AUD","AUD","COP","COU","KMF","CDF","XAF","NZD","CRC","XOF","HRK","CUP","CUC","ANG","EUR","CZK","DKK","DJF","XCD","DOP","USD","EGP","SVC","USD","XAF","ERN","EUR","SZL","ETB","EUR","FKP","DKK","FJD","EUR","EUR","EUR","XPF","EUR","XAF","GMD","GEL","EUR","GHS","GIP","EUR","DKK","XCD","EUR","USD","GTQ","GBP","GNF","XOF","GYD","HTG","USD","AUD","EUR","HNL","HKD","HUF","ISK","INR","IDR","XDR","IRR","IQD","EUR","GBP","ILS","EUR","JMD","JPY","GBP","JOD","KZT","KES","AUD","KPW","KRW","KWD","KGS","LAK","EUR","LBP","LSL","ZAR","LRD","LYD","CHF","EUR","EUR","MOP","MKD","MGA","MWK","MYR","MVR","XOF","EUR","USD","EUR","MRU","MUR","EUR","XUA","MXN","MXV","USD","MDL","EUR","MNT","EUR","XCD","MAD","MZN","MMK","NAD","ZAR","AUD","NPR","EUR","XPF","NZD","NIO","XOF","NGN","NZD","AUD","USD","NOK","OMR","PKR","USD",null,"PAB","USD","PGK","PYG","PEN","PHP","NZD","PLN","EUR","USD","QAR","EUR","RON","RUB","RWF","EUR","SHP","XCD","XCD","EUR","EUR","XCD","WST","EUR","STN","SAR","XOF","RSD","SCR","SLL","SGD","ANG","XSU","EUR","EUR","SBD","SOS","ZAR",null,"SSP","EUR","LKR","SDG","SRD","NOK","SEK","CHF","CHE","CHW","SYP","TWD","TJS","TZS","THB","USD","XOF","NZD","TOP","TTD","TND","TRY","TMT","USD","AUD","UGX","UAH","AED","GBP","USD","USD","USN","UYU","UYI","UYW","UZS","VUV","VES","VND","USD","USD","XPF","MAD","YER","ZMW","ZWL","XBA","XBB","XBC","XBD","XTS","XXX","XAU","XPD","XPT","XAG","AFA","FIM","ALK","ADP","ESP","FRF","AOK","AON","AOR","ARA","ARP","ARY","RUR","ATS","AYM","AZM","RUR","BYB","BYR","RUR","BEC","BEF","BEL","BOP","BAD","BRB","BRC","BRE","BRN","BRR","BGJ","BGK","BGL","BUK","HRD","HRK","CYP","CSJ","CSK","ECS","ECV","GQE","EEK","XEU","FIM","FRF","FRF","FRF","GEK","RUR","DDM","DEM","GHC","GHP","GRD","FRF","GNE","GNS","GWE","GWP","ITL","ISJ","IEP","ILP","ILR","ITL","RUR","RUR","LAJ","LVL","LVR","LSM","ZAL","LTL","LTT","LUC","LUF","LUL","MGF","MWK","MVQ","MLF","MTL","MTP","FRF","MRO","FRF","MXP","RUR","FRF","MZE","MZM","NLG","ANG","NIC","PEH","PEI","PEN","PES","PLZ","PTE","FRF","ROK","ROL","RON","RUR","FRF","FRF","FRF","ITL","STD","CSD","EUR","SKK","SIT","ZAL","SDG","RHD","ESA","ESB","ESP","SDD","SDP","SRG","SZL","CHC","RUR","TJR","IDR","TPE","TRL","TRY","RUR","TMM","UGS","UGW","UAK","SUR","USS","UYN","UYP","RUR","VEB","VEF","VEF","VEF","VNC","YDD","YUD","YUM","YUN","ZRN","ZRZ","ZMK","ZWC","ZWD","ZWD","ZWN","ZWR","XFO","XRE","XFU"].filter(e => e).forEach(c => currencies.set(c.toLowerCase(),1));
const languages = new Map();
require("i18n-locales").forEach(l => languages.set(l.toLowerCase(),1));
let alertsOn;

function language(value, returnNullIfNotFound = false) {
    if(languages.get((value || "").toLowerCase())) return value;
    else {        
        if(alertsOn) console.warn("Unknown language code: " + value);
        return returnNullIfNotFound ? null : value;
    };
}

function currency(value) {
    if(currencies.get((value || "").toLowerCase())) return value.toUpperCase();
    else {        
        if(alertsOn) console.warn("Unknown currency code: " + value);
        return value;
    };
}
/**
 * @obsolete The module will be gone soon.
 * @param {*} _alertsOn 
 * @returns 
 */
module.exports = function(_alertsOn) {
    alertsOn = _alertsOn;    
    return {
        currency: currency,
        language: language        
    }
}
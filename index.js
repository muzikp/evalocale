var rnd = require("randomstring").generate;
var numeral = require("numeral");
var moment = require("moment");
var numeralLocales = require('numeral/locales');
var x = numeral.locales;
var locList = require("i18n-locales");
module.exports = {
    moment: moment,
    numeral: numeral    
}

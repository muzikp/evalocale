"use strict";
const rnd = (n = 8) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';  
    for (let i = 0; i < n; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }  
    return randomString;
};
var i18n = require("i18n-locales").filter(e => e).map(e => {return {key: e, code: e.split("-")[0]?.toLowerCase(), region: e.split("-")[1]?.toLowerCase(), script: e.split("-")[2]?.toLowerCase()}});
var parser = require("accept-language-parser");
var check = require("./intl-check");

module.exports = function(config = {}) {
    let _library = {};
    let _default = getSystemLocale();
    let _metadata = {};
    let _alertsOn = false;
    let _aliases = {};
    let _language;
    const _defaultChars = 8;

    const evalocale = function(code, data = {}, language) {    
        if(!code) return "";
        var _ = dict(language || _default || getSystemLocale());
        if(!_) {
            if(_alertsOn) console.warn(`Dictionary ${language || _default || getSystemLocale()} not found.`);
            return "";
        };    
        var _text = _[code];        
        if(!_text) return _replace(code,{value: code});
        else {
            _text = _replace(_text, data)
            return _text;
        }
    };

    // #region PROPERTIES

    Object.defineProperty(evalocale, "length", {
        readonly: true,
        get: function(){
            return Math.max(...Object.keys(_library || {}).map((lkey) => Object.keys(_library[lkey] || {}).length));
        }
    });

    Object.defineProperty(evalocale, "system", {
        readonly: true,
        get: () => getSystemLocale()
    });

    Object.defineProperty(evalocale, "default", {    
        get: () => getSystemLocale(),
        set: function(value) {
            if(_library[value] && _alertsOn) console.warn(`Dictionary ${value } does not exist.`);
            _default = value;
        }
    });

    Object.defineProperty(evalocale, "alertsOn", {
        get: () => _alertsOn,
        set: function(on) {
            _alertsOn = !!on;
        }
    });

    Object.defineProperty(evalocale, "library", {
        get: () => _library,
        set: function(value) {
            if(typeof value != "object") throw "Library must be an object.";
            else _library = value;
        }
    })

    Object.defineProperty(evalocale, "metadata", {
        get: () => _metadata,
        set: function(value) {
            if(typeof value != "object") throw "Metadata must be an object.";
            else _metadata = value;
        }
    });

    // #endregion

    // #region METHODS

    Object.defineProperty(evalocale, "alias", {
        readonly: true,
        value: function(language, codes = []) {
            if(_aliases[language]) _aliases[language] = [];
            _aliases[language] = typeof codes == "function" ? codes : Array.isArray(codes) ? codes : [codes];
            return this;
        }
    });

    Object.defineProperty(evalocale, "clean", {
        readonly: true,
        value: function(separate = false){
            if(separate) {
                Object.keys(_library || {}).forEach(function(lkey){
                    Object.keys(_library[lkey]).forEach(function(ik){
                        if(_library[lkey][ik] == "") delete _library[lkey][ik];
                    });
                });
            } else {
                var keys = Object.keys(getBundleKeys());
                for(let k of keys)
                {
                    var onlyEmpty = true;
                    for(let l in (_library || {})) {
                        if(_library[l]?.[k] != "") onlyEmpty = false;                    
                    }
                    if(onlyEmpty){
                        for(let l in _library || {}) {
                            delete _library[l]?.[k];
                        }    
                    }
                }
            }        
            return this;
        }
    });

    Object.defineProperty(evalocale, "closest", {
        readonly: true,
        value: function(what, returnDetail = false) {
            return guessBestFit(what, false);
        }
    });

    Object.defineProperty(evalocale, "create", {
        readonly: true,
        value: function(length = 1, chars) {
            if(Object.keys(_library).length == 0) throw "Cannot create records without at least one dictionary defined.";
            if(chars === undefined || chars < 2) {
                var chs = [...Object.keys(_library).map((lkey) => Object.keys(_library[lkey]).map(ikey => ikey.length))].flat();
                if(chs.length > 0) chars = Math.round(chs.reduce((a,b) => a+b)/chs.length);
                else chars = 8;
            }
            for(var i = 0; i < length; i++) {
                var _id = rnd(chars);
                Object.keys(_library).forEach(lkey => _library[lkey][_id] = "");
            }
            return this;
        }
    });

    Object.defineProperty(evalocale, "csvToJson", {
        readonly: true,
        value: function(csv) {

        }
    })

    /**
     * Derives a secondary metadata package based on the keys in the library. Metadata has the same keys as libraries, but their values are objects with properties defined using the schema argument. Metadata is used for a more precise description of individual language records.
     */
    Object.defineProperty(evalocale, "deriveMetadata", {
        readonly: true,
        value: function(schema = {}) {
            var keys = new Map();
            Object.keys(_library).forEach(function(libKey){
                Object.keys(_library[libKey]).forEach(function(itemKey){
                    keys.set(itemKey, "");
                })
            });
            var _schema = {};
            if(Array.isArray(schema)) {
                for(let s of schema) {
                    _schema[s] = ""
                }            
            }
            else if (typeof schema == "object") _schema = schema;
            [...keys.keys()].forEach(function(key){
                _metadata[key] = _schema;
            });
            return this;
        }
    });

    Object.defineProperty(evalocale, "dictionary", {
        readonly: true,
        value: function(nameOrAlias) {
            return dict(nameOrAlias)
        }
    });

    Object.defineProperty(evalocale, "generate", {
        readonly: true,
        value: function(config) {      
            if(typeof config != "object") config = {};
            if(!config.language) config.language = [getSystemLocale()];
            else if(!Array.isArray(config.language)) config.language = [config.language || getSystemLocale()];
            config.total = isNaN(config.total) || Number(config.total) < 1 ? 1 : Number(config.total);
            config.chars = isNaN(config.chars) || Number(config.chars) < 1 ? _defaultChars : Math.round(Number(config.chars));
            var items = [...Array(config.total)].map(e => rnd(config.chars));        
            for(let l of config.language) {
                if(!_library[l]) _library[l] = {};
                for(let i of items){
                    _library[l][i] = ""
                }
            }
            if(config.metadata) this.deriveMetadata(config.metadata)
            return this;
        }
    });

    Object.defineProperty(evalocale, "load", {
        readonly: true,
        value: function() {
            var arg = [...arguments][0];
            try {
                if(typeof arg == "string") arg = JSON.parse(arg);
            } catch(e){
                throw "Failed to load the data."            
            }
            if(typeof arg != "object") throw "The locale 'load' argument must be an object."
            else if(Array.isArray(arg)) throw "The locale 'load' argument must be an object, not an array.";
            else {
                _library = arg.library
                _metadata = arg.metadata;
                _language = arg.language;

            }
            return this;
        }
    });

    Object.defineProperty(evalocale, "save", {
        readonly: true,
        value: function(){        
            return {
                library: _library,
                metadata: _metadata,
                language: _language || this.default
            }
        }
    })

    Object.defineProperty(evalocale, "set", {
        readonly: true,
        value: function(language, data = {}) {
            let args = [...arguments];
            if(args.length == 0) return this;
            else if(args.length == 1) {
                if(typeof args[0] == "object") {
                    if(args[0].library) {
                        this.load(args[0]);
                        return this;
                    }
                    //if(args[0].metadata) this.deriveMetadata(args[0].metadata);
                    if(args[0].default) _default = args[0].default;
                    if(args[0].alertsOn) _alertsOn = true;
                    //if(args[0].sync || args[0].sync) this.sync();
                    //if(args[0].language) this.language = args[0].language;
                } else if(typeof args[0] == "string") {
                    this.default = args[0];
                } else {
                    debugger;
                }
                return this;            
            }
            else if(args.length % 2 == 0) {
                for(var i = 0; i < args.length; i += 2) {
                    var language = args[i], data = args[i+1];                
                    if(!_library[language]) _library[language] = {};
                    Object.keys(data).forEach(function(key){
                        _library[language][key] = data[key];
                    });        
                }            
            }        
            return this;
        }
    });

    /**
     * Extends the keys of all language libraries so that they all have the same keys. Ignores existing keys and adds only those that are missing from the given library.
     * @param {boolean} writeValues If true, writes the last found value of the given key. Default false.
     * @returns {self} Returns the locale function.
     */
    Object.defineProperty(evalocale, "sync", {
        readonly: true,
        value: function(writeValues = false){
            var keys = new Map();
            Object.keys(_library).forEach(function(libKey){
                Object.keys(_library[libKey]).forEach(function(itemKey){
                    keys.set(itemKey, writeValues ? _library[libKey][itemKey] : "");
                })
            });            
            
            [...keys.keys()].forEach(function(key){                 
                Object.keys(_library).forEach(function(libKey){                                
                    if(_library[libKey][key] === undefined) _library[libKey][key] = writeValues ? keys.get(key) : "";                
                });
            });
            return this;
        }
    })

    // #region FORMATTERS

    Object.defineProperty(evalocale, "number", {
        readonly: true,
        value: function(value, decimals = undefined, language) {
            if(decimals !== undefined && decimals < 1) decimals = 1;
            return new Intl.NumberFormat(language || _language || _default, { maximumSignificantDigits: decimals }).format(value);
        }
    })

    Object.defineProperty(evalocale, "currency", {
        readonly: true,
        value: function(value, currency = "USD", language) {
            currency = check(_alertsOn).currency(currency);
            return new Intl.NumberFormat(language || _language || _default, { style: 'currency', currency: currency }).format(value);
        }
    });

    Object.defineProperty(evalocale, "time", {
        readonly: true,
        value: function(value, short = false, language) {        
            return new Intl.DateTimeFormat(language ||_language || _default, {hour: "numeric", minute: "numeric", second: short ? undefined : "numeric", hour12: false }).format(value);
        }
    });

    Object.defineProperty(evalocale, "date", {
        readonly: true,
        value: function(value, short = false, language) {        
            return new Intl.DateTimeFormat(language || _language || _default, {year: 'numeric', month: short ? "numeric" : "long", day: 'numeric'}).format(value);
        }
    });

    Object.defineProperty(evalocale, "diff", {
        readonly: true,
        value: function(thisTime, thatTime, language) {                  
            var diff = new Date(thatTime).getTime() - new Date(thisTime).getTime();
            var d = Math.abs(diff) / 1000;
            var unit = d < 60 ? "second" : d < 60*60 ? "minute" : d < 60*60*24 ? "hour" : d < 60 * 60 * 24 * 31 ? "day" : d < 60 * 60 * 24 * 365 ? "month" : "year";
            diff = unit == "second" ? diff/1000 : unit == "minute" ? diff/(60*1000) : unit == "hour" ? diff/(60*60*1000) : unit == "day" ? diff/(60*1000*60*24) : unit == "month" ? diff/(60*1000*60*24*30) : unit == "year" ? diff/(60*1000*60*24*365) : diff;
            return new Intl.RelativeTimeFormat(language || _language || _default, {style: "long", numeric: "auto"}).format(Math.round(diff), unit);
        }
    });

    // #endregion

    // #region IO

    Object.defineProperty(evalocale, "toCSV", {
        readonly: true,
        value: function(delimiter = ";"){
            var arr = this.toArray();
            var str = "";
            str += Object.keys(arr[0]).map(e => `"${e}"`).join(delimiter) + "\n";
            for(var i = 1; i < arr.length; i++) {
                str += Object.keys(arr[0]).map(k => typeof arr[i][k] == "string" ? `"${arr[i][k]}"` : arr[i][k]).join(delimiter) + "\n";            
            }
            return str;        
        }
    });

    Object.defineProperty(evalocale, "fromCSV", {
        readonly: true,
        value: function(content, config = {delimiter: ";", languages: null,autoformat: true}){        
            var headers = content.split(/\n/g)[0].split(config.delimiter).map(e => e.replace(/\"/g,""));        
            let chunks = content.split(/\n/g).filter((v,i) => i > 0 && v != "");                
            var arr = [];
            for(var ch of chunks) {
                var o = {};
                var v = ch.split(config.delimiter).map(e => e.replace(/\"/g,""));
                for(var h = 0; h < headers.length; h++)
                {
                    o[headers[h]] = isNaN(v[h]) ? v[h] : Number(v[h]);
                }            
                arr.push(o);            
            };        
            return this.fromArray(arr);
        }
    });

    Object.defineProperty(evalocale, "toArray", {
        readonly: true,
        value: function() {
            var keys = Object.keys(getBundleKeys());
            var mh = Object.keys(getMetadataHeaders());
            var lh = Object.keys(_library);
            var arr = [];    
            for(let key of keys) {
                var obj = {_id: key};
                for(let _mh of mh)
                {
                    obj[_mh] = (_metadata || {})[key][_mh]
                }
                for(let _lh of lh) {
                    obj[_lh] = (_library?.[_lh] || {})[key]
                }
                arr.push(obj);
            }
            return arr;
        }
    });

    Object.defineProperty(evalocale, "fromArray", {
        readonly: true,
        value: function(arr, config = {languages: null}) {        
            var languages;        
            if(Array.isArray(config.languages)) languages = languages;
            else {
                languages = Object.keys(arr[0]).filter(h => check(false).language(h, true));
            }
            for(let l of languages) {
                if(_library[l]) _library[l] = {}
            }
            var mh = Object.keys(arr[0]).filter(h => languages.indexOf(h) < 0 && h != "_id");
            if(mh.length > 0)
            {
                if(!_metadata) _metadata = {};
                for(var i=0; i < arr.length; i++)
                {
                    _metadata[arr[i]._id] = {};
                    for(let h of mh) {
                        _metadata[arr[i]._id][h] = arr[i][h]
                    }
                }
            }
            if(languages.length > 0)
            {            
                for(let l of languages) {
                    if(!_library[l]) _library[l] = {};
                    for(var i=0; i < arr.length; i++)
                    {                    
                        _library[l][arr[i]._id] = arr[i][l] || "";
                    }
                }            
            }        
            return this;
        }
    });

    // #endregion

    // #region UTILS

    function dict(nameOrAlias, returnKey = false) {    
        if(_library[nameOrAlias]) return _library[nameOrAlias];      
        else if(!Array.isArray(nameOrAlias) && typeof nameOrAlias == "object") return guessBestFit(nameOrAlias, returnKey);
        else {
            var matchedAlias = Object.entries(_aliases).find(function([key,value]){            
                if(typeof value == "function") return value(nameOrAlias);
                else if(Array.isArray(value)) return value.map(e => String(e).toLowerCase()).indexOf(nameOrAlias.toLowerCase()) > -1;            
                else if(typeof value == "string") return nameOrAlias.toLowerCase() == value.toLowerCase();
            });
            if(matchedAlias) return returnKey ? matchedAlias[0] :_library[matchedAlias[0]];
            else {
                var bestFit = guessBestFit(nameOrAlias, false);
                return returnKey ? bestFit :_library[bestFit];
            } 
        }
    }

    function guessBestFit(what, returnDetails = false) {    
        var langs = parser.parse(what);
        var scores = [];
        langs.forEach(function(x){
            var _scores = Object.keys(_library).map(function(k) {
                var score = 0;
                var s = k.split(/\-/g).map(e => e?.toLowerCase());
                if(s[0] === x.code?.toLowerCase()) score += 0.5;
                if(s[1] === x.region?.toLowerCase()) score += 0.4;
                if(s[2] === x.region?.toLowerCase()) score += 0.1;        
                return {
                    key: k,
                    score: score * x.quality
                }
            });
            scores.push(..._scores);
        });    
        scores = scores.sort((a,b) => a.score < b.score ? 1 : a.score > b.score ? -1 : 0);
        if(returnDetails) return scores;
        else return scores[0].key;    
    }

    function getSystemLocale(){
        if(typeof window !== "undefined") return window?.localStorage?.getItem("language") || window.navigator?.language || window.navigator?.userLanguage || _language;
        else return Intl.DateTimeFormat().resolvedOptions().locale;
    }

    function getMetadataHeaders(){
        var m = new Map();
        Object.keys(_metadata || {}).forEach(function(mk){
            Object.keys((_metadata||{})[mk]).forEach(function(_){
                var type = typeof (_metadata || {})[mk][_];
                if(m.get(_) === undefined) m.set(_, type);
                else if(type == "string") m.set(_, "string");            
            });
        });
        return mapToObject(m);    
    }

    function getBundleKeys() {
        var map = new Map();
        Object.keys((_metadata || {})).forEach(function(key){
            map.set(key,1)
        });
        Object.keys(_library).forEach(function(lang){
            Object.keys(_library[lang]).forEach(function(key){
                map.set(key, 1);
            });
        });
        return mapToObject(map);
    }

    function mapToObject(m) {
        var obj = {};
        [...m].forEach(_ => obj[_[0]] = _[1]);
        return obj;
    }

    function fromCSV(content, config = {delimiter: ";", languages: null, autoformat: true}){        
        var headers = content.split(/\n/g)[0].split(config.delimiter).map(e => e.replace(/\"/g,""));        
        let chunks = content.split(/\n/g).filter((v,i) => i > 0 && v != "");                
        var arr = [];
        for(var ch of chunks) {
            var o = {};
            var v = ch.split(config.delimiter).map(e => e.replace(/\"/g,""));
            for(var h = 0; h < headers.length; h++)
            {
                o[headers[h]] = isNaN(v[h]) ? v[h] : Number(v[h]);
            }            
            arr.push(o);            
        };        
        return fromArray(arr);
    }

    function fromArray(arr, config = {languages: null}) {        
        var result = {}, __library ={}, __metadata = {};
        var languages;        
        if(Array.isArray(config.languages)) languages = languages;
        else {
            languages = Object.keys(arr[0]).filter(h => check(false).language(h, true));
        }
        for(let l of languages) {
            if(__library[l]) __library[l] = {}
        }
        var mh = Object.keys(arr[0]).filter(h => languages.indexOf(h) < 0 && h != "_id");
        if(mh.length > 0)
        {        
            for(var i=0; i < arr.length; i++)
            {
                __metadata[arr[i]._id] = {};
                for(let h of mh) {
                __metadata[arr[i]._id][h] = arr[i][h]
                }
            }
        }
        if(languages.length > 0)
        {            
            for(let l of languages) {
                if(!__library[l]) _library[l] = {};
                for(var i=0; i < arr.length; i++)
                {                    
                    __library[l][arr[i]._id] = arr[i][l] || "";
                }
            }            
        }        
        return {library: __library, metadata: __metadata};
    }

    const _replace = function(text, data) {
        var keys = (text.match(/\{\{(.*?)\}\}/g) || []).map(i => i.match(/\{\{(.*)\}\}/)[1]);
        keys.forEach(function(k){
            text = text.replace("\{\{" + k + "\}\}", () => data[k])
        });
        return text;
    }

    function humanizeLanguage(value, target) {
        try {
            const displayNames = new Intl.DisplayNames([target || value], { type: 'language' });    
            return displayNames.of(value);
        } catch (error) {        
            return value;
        }
    };

    String.prototype.getLanguage = function(target) {
        return humanizeLanguage(this, target);
    }    
    // #endregion

    if(typeof config != "object") return evalocale;
    else return evalocale.set(config);
};
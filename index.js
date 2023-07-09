"use strict";
var rnd = require("randomstring").generate;
var check = require("./intl-check");
let _library = {};
let _default = getDefaultLocale();
let _metadata = {};
let _alertsOn = false;
let _language;
const evalocale = function() {    
    if(typeof [...arguments][0] == "function") {
        [...arguments][0](this);
        return this;
    } else if(typeof [...arguments][0] == "string") 
    {
        let code = [...arguments][0];
        let data = [...arguments][1];
        let _ = _library[_language || _default] || _library[(Object.keys(_library) || [])[0]] || {};    
        if(!code) return "";
        else if(typeof code == "object") {
            var _text = _default ? code[_default] : Object.entries(code)[0][1];
            return _replace(_text, data)
        }
        var _text = _[code];        
        if(!_text) return _replace(code,{value: code});
        else {
            _text = _replace(_text, data)
            return _text;
        }
    };
    
};

Object.defineProperty(evalocale, "default", {
    readonly: true,
    get: () => getDefaultLocale()
});

Object.defineProperty(evalocale, "language", {
    get: () => _language,
    set: function(language) {
        if(!_library[language]) _library[language] = {};
        _language = language;
    }
});

Object.defineProperty(evalocale, "library", {
    readonly: true,
    value: _library
})

Object.defineProperty(evalocale, "metadata", {
    readonly: true,
    value: _metadata
})

/**
 * Loads a serialized locale bundle into the method's storage.
 */
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

        }
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

Object.defineProperty(evalocale, "generate", {
    readonly: true,
    value: function(config = {chars: 8, total: 100}) {
        if(!config.language) throw "At least one language must be specified";
        else if(!Array.isArray(config.language)) config.language = [config.language];
        config.total = Number(config.total) < 1 ? 1 : Number(config.total);
        config.chars = Number(config.chars) < 1 ? 1 : Math.round(Number(config.chars));
        var items = [...Array(10)].map(e => rnd(config.chars));        
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

/**
 * Extends the keys of all language libraries so that they all have the same keys. Ignores existing keys and adds only those that are missing from the given library.
 * @param {boolean} writeValues If true, writes the last found value of the given key. Default false.
 * @returns {self} Returns the locale function.
 */
Object.defineProperty(evalocale, "syncLanguages", {
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
                if(args[0].metadata) this.deriveMetadata(args[0].metadata);
                if(args[0].default) 
                {
                    Object.defineProperty(evalocale, "default", {
                        get: _default,
                        set: args[0].default
                    });
                }
                if(args[0].alertsOn) _alertsOn = true;
                if(args[0].sync || args[0].syncLanguages) this.syncLanguages();
                if(args[0].language) this.language = args[0].language;
            } else if(typeof args[0] == "string") {
                this.switch(args[0]);
            } else {

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

Object.defineProperty(evalocale, "number", {
    readonly: true,
    value: function(value, decimals = undefined) {
        if(decimals !== undefined && decimals < 1) decimals = 1;
        return new Intl.NumberFormat(_language || _default, { maximumSignificantDigits: decimals }).format(value);
    }
})

Object.defineProperty(evalocale, "currency", {
    readonly: true,
    value: function(value, currency = "USD") {
        currency = check(_alertsOn).currency(currency);
        return new Intl.NumberFormat(_language || _default, { style: 'currency', currency: currency }).format(value);
    }
});

Object.defineProperty(evalocale, "time", {
    readonly: true,
    value: function(value, short = false) {        
        return new Intl.DateTimeFormat(_language || _default, {hour: "numeric", minute: "numeric", second: short ? undefined : "numeric", hour12: false }).format(value);
    }
});

Object.defineProperty(evalocale, "date", {
    readonly: true,
    value: function(value, short = false) {        
        return new Intl.DateTimeFormat(_language || _default, {year: 'numeric', month: short ? "numeric" : "long", day: 'numeric'}).format(value);
    }
});

Object.defineProperty(evalocale, "diff", {
    readonly: true,
    value: function(thisTime, thatTime) {                  
        var diff = new Date(thatTime).getTime() - new Date(thisTime).getTime();
        var d = Math.abs(diff) / 1000;
        var unit = d < 60 ? "second" : d < 60*60 ? "minute" : d < 60*60*24 ? "hour" : d < 60 * 60 * 24 * 31 ? "day" : d < 60 * 60 * 24 * 365 ? "month" : "year";
        diff = unit == "second" ? diff/1000 : unit == "minute" ? diff/(60*1000) : unit == "hour" ? diff/(60*60*1000) : unit == "day" ? diff/(60*1000*60*24) : unit == "month" ? diff/(60*1000*60*24*30) : unit == "year" ? diff/(60*1000*60*24*365) : diff;
        return new Intl.RelativeTimeFormat(_language || _default, {style: "long", numeric: "auto"}).format(Math.round(diff), unit);
    }
});

function getDefaultLocale(){
    if(typeof window !== "undefined") return window?.localStorage?.getItem("language") || window.navigator?.language || window.navigator?.userLanguage || _language;
    else return Intl.DateTimeFormat().resolvedOptions().locale;
}

const _replace = function(text, data) {
    var keys = (text.match(/\{\{(.*?)\}\}/g) || []).map(i => i.match(/\{\{(.*)\}\}/)[1]);
    keys.forEach(function(k){
        text = text.replace("\{\{" + k + "\}\}", () => data[k])
    });
    return text;
}

module.exports = evalocale;
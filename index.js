var rnd = require("randomstring").generate;
let _library = {};
let _metadata = {};
let _language;
var locale = function() {    
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

Object.defineProperty(locale, "default", {
    readonly: true,
    value: function() {
        if(typeof window !== "undefined") return window?.localStorage?.getItem("language") || window.navigator?.language || window.navigator?.userLanguage || _language;
        else return Intl.DateTimeFormat().resolvedOptions().locale;
    }
});

Object.defineProperty(locale, "language", {
    get: () => _language,
    set: (language) => _language = language
});

Object.defineProperty(locale, "library", {
    readonly: true,
    value: _library
})

Object.defineProperty(locale, "metadata", {
    readonly: true,
    value: _metadata
})

/**
 * Returns the default language guessed by either the Node or the browser environment.
 */
Object.defineProperty(locale, "default", {
    readonly: true,
    get: () => _default    
});

/**
 * Loads a serialized locale bundle into the method's storage.
 */
Object.defineProperty(locale, "load", {
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

Object.defineProperty(locale, "save", {
    readonly: true,
    value: function(){        
        return {
            library: _library,
            metadata: _metadata,
            language: _language
        }
    }
})

Object.defineProperty(locale, "generate", {
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
        return this;
    }
});

/**
 * Extends the keys of all language libraries so that they all have the same keys. Ignores existing keys and adds only those that are missing from the given library.
 * @param {boolean} writeValues If true, writes the last found value of the given key. Default false.
 * @returns {self} Returns the locale function.
 */
Object.defineProperty(locale, "syncLanguages", {
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
Object.defineProperty(locale, "deriveMetadata", {
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
            _metadata[key] = schema;
        });
        return this;
    }
})

Object.defineProperty(locale, "set", {
    readonly: true,
    value: function(language, data = {}) {                
        if(!_library[language]) _library[language] = {};
        Object.keys(data).forEach(function(key){
            _library[language][key] = data[key];
        });        
        return this;
    }
});

const _replace = function(text, data) {
    var keys = (text.match(/\{\{(.*?)\}\}/g) || []).map(i => i.match(/\{\{(.*)\}\}/)[1]);
    keys.forEach(function(k){
        text = text.replace("\{\{" + k + "\}\}", () => data[k])
    });
    return text;
}

module.exports = locale;
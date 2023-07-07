var rnd = require("randomstring").generate;
const lib = {};
let _language;
let _default = (function() {
    if(typeof window !== "undefined") return window?.localStorage?.getItem("language") || window.navigator?.language || window.navigator?.userLanguage || __default;
    else return Intl.DateTimeFormat().resolvedOptions().locale;
})();
var locale = function() {    
    if(typeof [...arguments][0] == "function") {
        [...arguments][0](this);
        return this;
    } else if(typeof [...arguments][0] == "string") 
    {
        let code = [...arguments][0];
        let data = [...arguments][1];
        let _ = lib[_language || _default] || lib[(Object.keys(lib) || [])[0]] || {};    
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

Object.defineProperty(locale, "language", {
    get: () => _language,
    set: (language) => _language = language
});

Object.defineProperty(locale, "library", {
    readonly: true,
    value: lib
})

Object.defineProperty(locale, "default", {
    readonly: true,
    get: () => _default    
});

Object.defineProperty(locale, "load", {
    readonly: true,
    value: function(data) {
        if(typeof data != "object") {
            try {
                data= JSON.parse(data);
            } catch(e) { 
                console.error("Failed to read the data.");
            } finally {
                return this;
            }
        }

    }
});

Object.defineProperty(locale, "generate", {
    readonly: true,
    value: function(config = {chars: 8, total: 100}) {
        if(!config.language) throw "At least one language must be specified";
        else if(!Array.isArray(config.language)) config.language = [config.language];
        config.total = Number(config.total) < 1 ? 1 : Number(config.total);
        config.chars = Number(config.chars) < 1 ? 1 : Math.round(Number(config.chars));
        var items = [...Array(10)].map(e => rnd(config.chars));        
        for(let l of config.language) {
            if(!lib[l]) lib[l] = {};
            for(let i of items){
                lib[l][i] = ""
            }
        }
        return this;
    }
})

Object.defineProperty(locale, "set", {
    readonly: true,
    value: function(language, data) {                
        if(!lib[language]) lib[language] = {};
        Object.keys(data).forEach(function(key){
            lib[language][key] = data[key];
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
#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const $$ = require("./index")({alertsOn: true});
const _langs = new Map();
console.msg = function() {
    console.log("\x1b[33m", ...arguments);
}
Array.prototype.distinct = function() {
    var m = new Map();
    this.forEach(e => m.set(e,1));
    return [...m.keys()];
}
require("i18n-locales").forEach(l => _langs.set(l.toLowerCase(),l));

program
  .version('1.0.0')
  .description('Evalocale CLI command');

program.command("create")  
  .option('-t, --total <count>', 'Number of records to be generated (default 10)')
  .option('-c, --chars <length>', 'Length of a text key (default 8)')
  .option('-m, --metadata <Array>', 'Metadata attribute to add.', collectMetadata, [])
  .option('-l, --language <Array>', 'Language(s) to be created', collectLanguage, [])
  .option('-f, --format <string>', 'Output format: either json (default) or csv')
  .option('-n, --name <string>', 'The name of the bundle')
  .option('-p, --path <string>', 'Directory to save the file to (default evalocale.json or evalocale.csv')
  .option('-w, --no-watch', 'Starts watching a CSV file for changes and automatically converts it to a JSON file')
  .description('Creates an evalocale file')
  .action(function() {
    try {
        var config = arguments[0];
        var config = arguments[0];
        var total = Math.round(Number(config.total)) > 0 ? Math.round(Number(config.total)) : 10;
        var chars = Math.round(Number(config.chars)) > 0 ? Math.round(Number(config.chars)) : 8;
        var metadata = config.metadata;
        var language = config.language.length > 0 ? config.language : [$$.system];        
        var format = ["json","csv"].indexOf(config.format?.toLowerCase().trim()) < 0 ? "json" : config.format;
        var name = config.name || "evalocale";
        var _path = config.path ? `${config.path}/${name}.${format}` : path.join(process.cwd(), `${name}.${format}`);        
        var bundle = {
            library: {},
            metadata: {}
        };        
        var keys = [...Array(total)].map(i => $$.random(chars));        
        for(let l of language)
        {
            bundle.library[l] = {};            
            keys.forEach(function(k){
                bundle.library[l][k] = "";
            });
        }
        if(metadata.length > 0) {
            var md = {};
            for(let m of metadata) {                      
                md[m.name] = m.def;
            }            
            keys.forEach(function(k){                     
                bundle.metadata[k] = md;
            });            
        }
        bundle.language = Object.keys(bundle.library)[0];        
        var content = format == "csv" ? $$.load(bundle).toCSV() : JSON.stringify(bundle, null, "\t");        
        fs.writeFileSync(_path, content);
        modifyConfig(function(config){
            config.default = _path;
            return config;
        });
        console.msg(`- evalocale file ${name} created and set as default`);
        if(!config.watch && format == "csv") {
            watchCSV(_path, name);
        }        
    } catch(e) {
        console.error("type npx evalocale create -h for a help", e)        
    }    
});

function collectMetadata(value, metadata) {
    const types = ["string", "number", "boolean"]
    var name, type, def;
    if(value.match(/\=/g)) {
        def = value.split(/\=/g)[1];
        name = value.split(/\=/g)[0];
        if(name.match(/\:/g)) {
            type = name.split(/\:/g)[1]?.toLowerCase();
            name = name.split(/\:/g)[0];            
        } else {            
            type = "string";
        }
    }
    else {
        if(value.match(/\:/g)) {
            name = value.split(/\:/g)[0];
            type = value.split(/\:/g)[1];
        } else {         
            name = value;   
            type = "string";
        }
    }
    if(name?.trim().length == 0) throw "Metadata name cannot be empty";
    name = name.trim();
    if(["_id"].indexOf(name) > -1) throw `Metadata ${name} is a reserved attribute, use another one.`;
    if(["string", "number", "boolean"].indexOf(type) < 0) throw `Unknown type ${type} for property ${name}`;
    if(type == "number" && def !== undefined) def = Number(def);
    if(type == "boolean" && def !== undefined) def = def == "true" ? true : def == "false" ? false : undefined;
    if(type == "string" && def === undefined) def = "";
    metadata.push({name: name, type: type, def: def});
    return metadata;
}

  function collectLanguage(value = "", language) {
    var standardized = _langs.get(value.trim().toLowerCase());
    if(!standardized) {
        console.warn(`Language ${value} was not found in the language list. Consider using standard language code.`)
        language.push(value)
    } else language.push(standardized);
    return language;
}

program.command("add")  
  .option('-r, --rows <count>', 'Number of records to be added (default 1)')
  .option('-c, --chars <length>', 'Length of a text key (default: an average lenght of existing keys)')
  .option('-m, --metadata <Array>', 'Metadata attribute(s) to add.', collectMetadata, [])
  .option('-l, --language <Array>', 'Language(s) to add', collectLanguage, [])
  .option('-s, --source <string>', 'Path to the file to be modified')  
  .description('Creates an evalocale file')
  .action(function() {
    try {
        var config = arguments[0];
        modifyFile(config.source, function(content){            
            var rows = Math.round(Number(config.rows || 0)) > 0 ? Math.round(Number(config.rows)) : 0;
            var chars = Math.round(Number(config.chars || 0)) > 0 ? Math.round(Number(config.chars)) : (function(){
                var l = Object.keys(content.library || {})[0];
                if(l) {
                var ls = Object.keys(content.library[l]).map(k => k.length);
                if(ls.length > 0) return ls.reduce((a,b) => a+b)/ls.length;
                else return 8;
                } else return 8
            })();            
            var metadata = config.metadata || [];              
            var keys = [...getCurrentKeys(content), ...[...Array(rows)].map(e => $$.random(chars))].distinct();            
            var langs = new Map();
            [...Object.keys(content.library), ...config.language].forEach(k => langs.set(k,1));
            [...langs.keys()].forEach(function(l){                
                if(!content.library[l]) content.library[l] = {};
                keys.forEach(k => !content.library[l][k] ? content.library[l][k] = "" : true);                
            })
            if(content.metadata) {
                var schema = {};
                getCurrentMetaAttrs(content).forEach((m) => schema[m] = "");
                keys.forEach(k => !content.metadata[k] ? content.metadata[k] = schema : true);                
            }
            if(config.metadata.length > 0 && rows > 0) {
                for(let m of config.metadata) {
                    Object.keys(content.metadata).forEach(function(mk){
                        content.metadata[mk][m.name] = m.default;
                    });
                }
            }
            console.msg(`- elements add to ${config.source}`);
            return content;
        });        
    } catch(e) {
        console.error("type npx evalocale create -h for a help", e)
        console.error(e);
    }
        
});

// INIT
program
  .command('init')
  .description('Initialize the CLI processes')
  .action(() => {
    init();
  });

// INSTALL
program
  .command('install <what>')
  .description('Install an Evalocale extension')
  .action((what) => {
    if(what?.toLowerCase() == "express") {
        try {
            var destination = path.join(process.cwd(), 'views');                        
            fs.exists(destination, (exists) => {
                if (!exists) {
                  fs.mkdir(destination, (err) => {
                    if (err) {
                      console.error('Error creating directory:', err);
                    } else {
                        copyFiles();
                    }
                  });
                } else {
                  copyFiles();
                }
            });
            function copyFiles(){
                const sourceFilePath = path.join(__dirname, "resources", "evalocale.pug");
                const targetFilePath = path.join(process.cwd(), 'views', 'evalocale.pug');
                fs.copyFileSync(sourceFilePath, targetFilePath);
                console.log("- Evalocale Express.js extension initialized, see https://github.com/muzikp/evalocale/blob/main/docs/express.md for further information.")
            }
        } catch (e) {

        }
        
    } 
    else console.log("- unknown service: " + what)
  });

function watchCSV(filePath) {
    console.msg(`- watching file ${filePath} for changes`);    
    fs.watchFile(filePath, (curr, prev) => {
        var _$$ = require("./index.js")();        
        if (curr.mtime > prev.mtime) {      
            try {      
                var csv = fs.readFileSync(filePath).toString();                
                var json = _$$.fromCSV(csv, {delimiter: ";"}).save();
                const directory = path.dirname(filePath);                
                const file = path.parse( path.basename(filePath)).name;   
                var _path = `${directory}/${file}..json`;                
                fs.writeFileSync(_path, JSON.stringify(json, null, "\t"));
                updateWatch(filePath);
            } catch(e) {
                console.warn(e);
            }
        }
    });
}
    
function init(){
    try {
        var cfPath = path.join(__dirname, 'evalocale.config.json');                        
        fs.exists(cfPath, (exists) => {
            var config = {
                watch: []
            };
            if (exists) config = JSON.parse(fs.readFileSync(cfPath).toString());
            for(let w of config.watch) {
                try {
                    watchCSV(w);
                } catch(e) {
                    config.watch = config.watch.filter(_w => _w !== w);
                }
            }
            fs.writeFileSync(cfPath, JSON.stringify(config))``
        });            
    } catch (e) {

    }
}

function updateWatch(filePath) {
    var cfPath = path.join(__dirname, 'evalocale.config.json');                        
    fs.exists(cfPath, (exists) => {
        var config = {
            watch: []
        };
        if (exists) config = JSON.parse(fs.readFileSync(cfPath).toString());
        config.watch.push(filePath);
        fs.writeFileSync(cfPath, JSON.stringify(config));
    });        
}

function modifyFile(filePath, action) {    
    if(!filePath) {        
        try {
            var _default = JSON.parse(fs.readFileSync(path.join(__dirname, 'evalocale.config.json')).toString()).default;
            if(_default) filePath = _default;
        } catch(e) {
            console.error(e);
        }
    }
    //if(!config.source) throw "Source argument cannot be emty.";
    var format = path.extname(filePath).replace(/\./g,"");
    var content;
    try {
        if(format == "csv")
        {
            content = $$.fromCSV(fs.readFileSync(filePath).toString()).save();
        }
        else if(format == "json")
        {
            content = JSON.parse(fs.readFileSync(filePath));
        }
        else throw ("Unsupported file format: " + format);
    } catch(e) {
        console.error(e);
    }
    if(typeof content == "object") {
        content = action(content);
        if(format == "csv") fs.writeFileSync(filePath, $$.load(content).toCSV());
        else fs.writeFileSync(filePath, JSON.stringify(content, null, "\t"));
    } else 
    {
        console.log("The content is not an object", content);
    }
}

function modifyConfig(action = function(config){return config}) {
    try {
        var config = JSON.parse(fs.readFileSync(path.join(__dirname, 'evalocale.config.json')).toString());
        config = action(config);
        fs.writeFileSync(path.join(__dirname, 'evalocale.config.json'), JSON.stringify(config, null, "\t"));
    } catch(e) {
        console.log("Failed to modify config: ", e);
    }
}

function getCurrentKeys(bundle) {
    var map = new Map();
    for(let l of Object.keys(bundle?.analysis || {}))
    {
        Object.keys(bundle.analysis[l]).forEach(k => map.set(k,1));
    }
    Object.keys(bundle?.metadata || {}).forEach(k => map.set(k,1));    
    return [...map.keys()];
}

function getCurrentMetaAttrs(bundle) {
    var map = new Map();
    Object.keys(bundle?.metadata || {}).forEach(function(key){
        Object.keys(bundle?.metadata?.[key]).forEach(k => map.set(k,1));
    })
    return [...map.keys()];
}

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
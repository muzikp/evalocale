#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const $$ = require("./index")({alertsOn: true});
const _langs = new Map();
require("i18n-locales").forEach(l => _langs.set(l.toLowerCase(),l));

program
  .version('1.0.0')
  .description('Evalocale CLI command');


  program
  .command("create")  
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
                bundle.library[l] = "";
            });
        }
        if(metadata.length > 0) {
            var md = {};
            for(let m of metadata) {
                md[m.name] = md[m.def];
            }
            keys.forEach(function(k){
                
                bundle.metadata[k] = md;
            });            
        }
        bundle.language = Object.keys(bundle.library)[0];
        var content = format == "csv" ? $$.load(bundle).toCSV() : JSON.stringify(bundle, null, "\t");        
        fs.writeFileSync(_path, content);
        console.log(`- evalocale file ${name} created`);
        if(!config.watch && format == "csv") {
            watchCSV(_path, name);
        }        
    } catch(e) {
        console.error("type npx evalocale create -h for a help")
        console.error(e);
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
    metadata.push({name: name, type: type, default: def});
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

// generate
program
  .command("generate")  
  .option('-t, --total <count>', 'Number of records to be generated (default 10)')
  .option('-c, --chars <length>', 'Length of a text key (default 8)')
  .option('-m, --metadata <data>', 'Metadata schema as an array of headers (default ["id","description"])')
  .option('-l, --language <data>', 'Language(s) to be created')
  .option('-f, --format <string>', 'Output format: either json (default) or csv')
  .option('-n, --name <string>', 'The name of the bundle')
  .option('-p, --path <string>', 'Directory to save the file to (default evalocale.json or evalocale.csv')
  .option('-w, --no-watch', 'Starts watching a CSV file for changes and automatically converts it to a JSON file')
  .description('Generates an Evalocale bundle file')
  .action(function() {
    try {
        var config = arguments[0];
        var total = Math.round(Number(config.total)) > 0 ? Math.round(Number(config.total)) : 10;
        var chars = Math.round(Number(config.chars)) > 0 ? Math.round(Number(config.chars)) : 8;
        var metadata = config.metadata;
        var _$$ = $$.generate({total: total, chars: chars, metadata: metadata, language: config.language});
        var format = ["json","csv"].indexOf(config.format?.toLowerCase().trim()) < 0 ? "json" : config.format;
        var name = config.name || "evalocale";
        var _path = config.path ? `${config.path}/${name}.${format}` : path.join(process.cwd(), `${name}.${format}`);
        var content = format == "csv" ? $$.toCSV() : JSON.stringify($$.save(), null, "\t");
        fs.writeFileSync(_path, content);
        console.log(`- evalocale file ${name} created`);
        if(!config.watch && format == "csv") {
            watchCSV(_path, name);
        }
        
    } catch(e) {
        console.error("type npx evalocale generate -h for a help")
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
    console.log(`- watching file ${filePath} for changes`);    
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

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
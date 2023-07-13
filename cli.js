#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const $$ = require("./index")({alertsOn: true});

program
  .version('1.0.0')
  .description('Evalocale CLI command');

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
  .description('Generates an Evalocale bundle and saves it to the specified destination (default ./)')
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

function watchCSV(filePath, fileName) {
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
                console.log("Saving to " + _path)
                fs.writeFileSync(_path, JSON.stringify(json, null, "\t"));
            } catch(e) {
                console.warn(e);
            }
        }
    });
}
    


program.parse(process.argv);

if (!process.argv.slice(2).length || process.argv[2] !== 'generate') {
    program.outputHelp();
}
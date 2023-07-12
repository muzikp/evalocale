#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const $$ = require("./index");

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
            watchCSV(_path);
        }
        
    } catch(e) {
        console.error("type npx evalocale generate -h for a help")
        console.error(e);
    }    
});

function watchCSV(filePath) {
    console.log(`- watching file ${filePath} for changes`);
    fs.watchFile(filePath, (curr, prev) => {
        var _$$ = new $$;
        console.log(_$$);
        if (curr.mtime > prev.mtime) {            
            var csv = fs.readFileSync(filePath);            
            var json = $$.fromCSV(csv).save();
            console.log(`File ${filePath} has been modified`);    
        }
    });
}

program.parse(process.argv);

if (!process.argv.slice(2).length || process.argv[2] !== 'generate') {
    program.outputHelp();
}
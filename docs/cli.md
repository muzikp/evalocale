# Evalocale CLI

A number of functions that can be called via the evalocale API can more meaningfully be called via the CLI - for example generating input bundles. At the same time, the CLI makes the generation of dictionary libraries more pleasant, as the generated CSV files can be automatically tracked and converted to JSON.

## Generating a libary

The **generate* command creates a new file prepopulated with languages, keys and (eventually metadata). The file can be either JSON or CSV, depends on what is easier to edit for you.

```npx
npx evalocale generate -t 500 -c 8 -m '["id", "description"]' -f csv -n myEvalocaleLibrary -w
```

For quick help just type

```npx
npx evalocale generate -h
```

### Arguments

| **argument** | **description** | **type** | **default**|
| --- | --- | --- | --- |
| **-t** | total of elements (records) to be generated | UInt | 10 |
| **-c** | number of hash (text code) characters | UInt | 8 |
| **-l** | language(s) to be generated | Array\<of String> | *system language* |
| **-m** | metadata schema (an array of headers) | Array\<of String> | - |
| **-f** | format of the file (csv or json) | String | json |
| **-n** | name of the file to be saved | String | evalocale |
| **-p** | path (directory) where the file is to be saved | String | *workspace* |
| **-w** | for CSV files only: watch any changes and parse it as a JSON file of the same name | boolean | false |
| **-h** | suprisingly...a help command | - | - |

## Watching changes

At the moment, tracking changes is mainly (more precisely, only) tracking changes in CSV files.

```npx
npx evalocale watch <filePath>
```

To unwatch a file:

```npx
npx evalocale unwatch <filePath>
```

And to unwatch all files just:

```npx
npx evalocale unwatch
```

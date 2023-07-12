# Evalocale CLI

## Basic usage

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

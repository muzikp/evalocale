# Evalocale CLI

A number of functions that can be called via the evalocale API can more meaningfully be called via the CLI - for example generating input bundles. At the same time, the CLI makes the generation of dictionary libraries more pleasant, as the generated CSV files can be automatically tracked and converted to JSON.

## Create a file

The **create* command creates a new file prepopulated with languages, keys and metadata. The file can be either JSON or CSV, depends on what is easier to edit for you.

```bash
 npx evalocale create -m description:string -l cs-cZ -l en-GB -n startup -f csv -t 100
```

### Arguments

| **argument** | **description** | **type** | **default**|
| --- | --- | --- | --- |
| **-t** | total of elements (records) to be generated | UInt | 10 |
| **-c** | number of hash (text code) characters | UInt | 8 |
| **-l** | language(s) to be generated | String | *system language* |
| **-m** | metadata schema (an array of headers) | String | - |
| **-f** | format of the file (csv or json) | String | json |
| **-n** | name of the file to be saved | String | evalocale |
| **-p** | path (directory) where the file is to be saved | String | *workspace* |
| **-w** | for CSV files only: watch any changes and parse it as a JSON file of the same name | boolean | false |
| **-h** | suprisingly...a help command | - | - |

#### Language arguments -l

It is recommended to use any of the standard language codifications (ISO 639-1 etc.) to avoid drawbacks.

You can use multiple language arguments. If none is defined, the language of your system is taken as the default.

```bash
-l cz-CZ -l en -l en-GB
```

#### Metadata arguments -m

For better orientation in dictionaries, it is useful to use metadata that is stored in a separate object. Metadata can be described by name, type and default value when creating or expanding a file. Accepted types are string, number and boolean (case insensitive).

You can use multiple metadata arguments. Avoid using reserved attributes (_id) for metadata name.

***Name only***

```bash
-m someName
```

***Name and type***

```bash
-m someName:string
```

***Name and default***

```bash
-m someName=some value
```

***Name, type and default***

```bash
-m someName:string=some value
```

## Watching changes

At the moment, tracking changes is mainly (more precisely, only) tracking changes in CSV files.

```bash
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

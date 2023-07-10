# Evalocale

A core library for Node.js and browsers to facilitate dynamic loading of texts in different languages.

## Key features

- easy to setup and use
- both Node.js and web application
- best-fit language lookup
- Intl module implementation through various formatters
- metadata support
- CSV import/export (consider user Edit csv extension for seamless production if you use VSCode)

## Install

Node.js package instalation:

```npm
npm install evalocale
```

Browser webpack compiled package installation:

```html
<script src="./src/evalocale.min.js">
```

Mind that the npmjs version might be obsolete so for Node.js rather use

```npm
npm instal https://github.com/muzikp/evalocale.git
```

## Basic usage

Evalocale is a plain function with three arguments:

- **code**: an id of a concrete text stored in a dictionary
- **data**: on object of key-value pairs storing dynamic content for the text
- **language**: optionally you may override the global language property of the function - overriding the language is appropriate if one instance is used by multiple clients, e.g. on an HTTP server

### Node.js

```js
var $$ = require("evalocale").set("en-Gb", {"a1b2c3d4": "This is {{quality}} library."});
console.log($$("a1b2c3d4", {quality: "an ugly"}));
```

### Browser

```js
var $$ = window.evalocale.set("en-Gb", {"a1b2c3d4": "This is {{quality}} library."});
console.log($$("a1b2c3d4", {quality: "an ugly"}));
```

The root function takes two arguments: text code and data object (optional). The data object serves as a container for replacing wildcards, express as {{wildcard}} in a dictionary record (see an example of *quality* above).

## Setting content

Most of the necessary service configuration is possible using the flexible *set* method. It consumes different types and amounts of arguments, while if only one argument is specified, then the language is set if it is a string type, or if it is an object, the configuration of the evalocale environment is performed. If two arguments (or an even number of arguments) are specified, then the odd argument is taken as a language abbreviation and the even argument as an object with dictionary data. In all cases, the root function evalocale is returned.

The *set* method always returns the root function.

***Setting a single dictionary***

```javascript
$$.set("en-Gb", {"a1b2c3d4": "This is {{quality}} library."});
```

***Setting multiple dictionaries***

An even number of arguments indicates that this is a series of name/date pairs. Note that dictionaries have different argument lengths; they can be synchronized later (see below).

```javascript
$$.set("cs-CZ", {
        "a1b2": "Jmenuji se {{name}}.",
        "c3d4": "Je mi {{age}} let."
    }, "en-GB", {
        "a1b2": "My name is {{name}}.",
        "c3d4": "I am {{age}}.",
        "e5f6": "I am a developer."
});
```

***Setting content by loading a bundle***

A bundle is a sort of serializied underlying data, including library, metadata etc. If the first (and one and only) argument is object and contains property *library*, it is considered to be a bundle.

```javascript
let bundle = {"library":{"cs-CZ":{"a1b2":"Jmenuji se {{name}}.","c3d4":"Je mi {{age}} let.","e5f6":""},"en-GB":{"a1b2":"My name is {{name}}.","c3d4":"I am {{age}}.","e5f6":"I am a developer."}},"metadata":{"a1b2":{"app":"retusa","version":1},"c3d4":{"app":"retusa","version":1},"e5f6":{"app":"retusa","version":1}},"language":"en-GB"};
$$.set(bundle);
```

You may also directly load the bundle by the *load* method:

```javascript
$$.load(bundle);
```

***Setting an active language***

Setting the active language can be done in several ways, all of which have the same effect:

```javascript
// by means of the set method
$$.set("en-GB");
// by language getter
$$.language = "en-GB";
// by switch method
$$.switch("en-GB");
```

## Configuration

Many configuration methods might be called by the *set* method as well as by means of direct methods. While using the *set* method for configuration, mind that the configuration cannot be mixed with dictionary data.

```javascript
$$.set({
    metadata: {version: 1, group: "A"},
    sync: true
});
```

Sequential calling of *set* methods:

```javascript
let bundle = {"library":{"cs-CZ":{"a1b2":"Jmenuji se {{name}}.","c3d4":"Je mi {{age}} let.","e5f6":""},"en-GB":{"a1b2":"My name is {{name}}.","c3d4":"I am {{age}}.","e5f6":"I am a developer."}},"metadata":{"a1b2":{"app":"retusa","version":1},"c3d4":{"app":"retusa","version":1},"e5f6":{"app":"retusa","version":1}},"language":"en-GB"};
var config = {
    metadata: {version: 1, group: "A"},
    sync: true}
$$.set(bundle).set(config).set("en-GB")("a1b2", {name: "John Doe"});
```

## Methods

| **method** | **description** | **argument** | **argument property** | **type** | **required** | **default** | **argument role** |
| ---------- | --------------- | ------------ | --------------------- | ------------ | ----------- | ----------------- | ---------|
| ***alias*** | Sets the alias(es) for a particular language and returns itself. | nameOrAlias | | String | true | | Specifies the key under which the entire dictionary is stored (typically, e.g. en-GB). |
| | | resolver | | String / Array / Function | | [] | The resolver is used to compare aliases with the dictionary's own key. It can be a string (eg "en"), an array (eg ["en", "en-GB", "en-US"]) or a function (eg (value) => value.substr(0, 2) == "en"). |
| ***clean*** | Deletes entries with an empty value from dictionaries. Deletion can be done in two ways. If the *separate* argument is true, it deletes all empty entries from each dictionary (regardless of whether the same entry in another dictionary is not empty). If false, deletes only those records that are empty across all dictionaries.| separate | | boolean | false | false | If true, removes blank entries in each dictionary regardless of value of the same key in other dictionaries. If false (default), removes only entries with keys of empty value across all dictionaries. |
| ***create*** | Appends N new records to each dictionary. Metadata ignored so far | length | | UInt | false | 1 | Number (N) of records to be generated. |
| | | chars | | UInt | false | - | The length of a key. If not specified, either average length of existing keys is calculated, or (if no records exists) is set to 8. |
| ***deriveMetadata*** | Generates (or updates) a metadata objec for existing dictionaries. | schema | | Object / Array | false | {} | Specifies the metadata structure. |
| ***fromArray*** | Populates the underlying data with an array of key/value pairs, including languages and metadata. | arr | Array | | true |  | An array containing the library/metadata values. |
| | | config | languages | Array | false | null | Defines languages present in the arr argument. If empty, the methods tries to identify the languages on its own. |
| ***fromCSV*** | Populates the underlying data with a CSV style text. It is suggested to use default CSV settings to avoid errors. | content | String | | true |  | A CSV file as a string. |
| | | config | languages | Array | false | null | Defines languages present in the arr argument. If empty, the methods tries to identify the languages on its own. |language i18n code (e.g. en-GB) |
| | | | delimiter | String | false | "\t" | Defines the cell delimiter. |
| ***generate*** | Generates an entires bundle, containg dictionaries | config | object | total | false | 1 | defines how many elements in each dictionary should be created |
| | | | chars | UInt | false | 8 | defines the lenght of a generated key |
| | | | language | String / Array | false | 8 | Defines the dictionaries to be generated. It can either be a string or an array of strings representing the language i18n code (e.g. en-GB) |
| | | | metadata | Object / Array | false | {} | If not undefined, specifies the schema of metadata; the metadata object is generated with every generated key and a value represented by the schema |
| ***load*** | Loads the entire bundle of data, including the library, metadata etc. A workaround for the *set* method with one object-type argument. | bundle | library | Object | false | {} | Specifies the library element. |
| | | | metadata | Object | false | {} | Specifies the metadata element. |
| | | | language | String | false | undefined | Specifies an active language |
| ***save*** | A counterpart of the *load* method that exports the underlying data. See *load* for output structure. | | | | | |
| ***set*** | see Setting content. | | | | | |
| ***sync*** | Extends the keys of all language libraries so that they all have the same keys. Ignores existing keys and adds only those that are missing from the given library. | writeValues | | boolean | false | false | If true, assign a non-empty found value for the key from another language where a value is non-empty. |
| ***toCSV*** | Converts the underlying library and metadata to a single CSV formatted string. | | | | | | |
| ***toArray*** | Converts the underlying library and metadata to a single Array of key/value pair objects. | | | | | | |

### Examples

***Setting language aliases***

It makes sense to use some dictionaries for multiple languages (or a combination of languages and regions, e.g. en-GB to be used for en-US, etc.). The alias method makes it possible to extend the validity of the dictionary for other regions or languages, using the so-called resolver.

```javascript
// define the library content
// then create an aliases
$$.alias("en-GB", ["en-US", "en-AU", "en-BZ"]);
$$("someCode", {}, "en-AU"); // => returns a resut for en-GB
$$("someCode", {}, "en-NZ"); // => returns an empty string as no alias is mathcing
//this might get too long, so better like this:
$$.alias("en-GB", (langCode) => langCode.substr(0,2) == "en");
$$("someCode", {}, "en-XXX"); // => returns a resut for en-GB
//even a single resolver as a alias string might be used:
$$.alias("en-GB", "en-US");
$$("someCode", {}, "en-US"); // => returns a resut for en-GB
```

## Properties

Properties can be get/set by means plain getter/setter, or eventualy by the *set* method (see bellow). Only method marked "both" can be configured via the *set* method.

| **property** | **description** | **type** | **read/write** |
| ------------ | --------------- | -------- |
| alertsOn | Turns on/off console.warn messages. It is recommend to use alertsOn in the development mode to watch possible drawbacks. | boolean | both |
| system | Gets the environment language. The value is extracted differently for Node.js and browser environment. | String | read |
| default | Gets or sets the active language. | String | both |
| length | Gets the number of entries in the dictionary with the most entries from all dictionaries. Overrides the length property of the base. | UInt | read |
| library | Gets or sets the underlying library package, containg all the dictionaries. | Object | both |
| metadata | Get or sets the underlying metadata package. | Object | both |

The two examples below have the same effects.

***Configuration by properties***

```javascript
$$.alertsOn = false;
$$.default = "en-GB";
```

***Configuration by set method***

```javascript
$$.set({
    alertsOn: false,
    default: "en-GB"
});
```

## Utils

### Generator

Instead of generating unique keys, it is easier to let the job up to the package. Calling the root method *generate* creates a required language(s) and items. See methods for further information.

```javascript
var $$ = require("evalocale").generate({total: 500, chars: 8, language: ["en-GB", "cs-CZ"], metadata: {app: "someApp"}});
```

You can call the *generate* function without arguments. Default values are

- total: 1
- chars: default hash length (8 as of July 2023)
- language: the *system* property value (local system language)

```javascript
var $$ = require("evalocale").generate();
```

### Formatters

The Intl module allows flexible formatting of numbers and data in many languages. Evalocale supports simplified calls for several common user requests. In addition, however, you can use the functions of the Intl module as you wish. The last argument, language, is optional, in case you want to override the global *language* property.

| **method** |

- **number**(value, decimals, language): converts a number to a locale string; if decimals are not specified, they are set to auto
- **currency**(value, currency, language): converts a number to a locale currency string; the currency code is checked against the list of acceplable currency codes (is not case sensitive)
- **time**(value, short=false, language): converts a date instance to time string; if short (default false) is set to true, returns only hours and minutes, otherwise hh:mm:ss
- **date**(value, short=false, language): converts a date instance to date string; if short (default false) is set to true, returns only hours and minutes, otherwise hh:mm:ss
- **diff**(thisTime, thatTime, language): return a humanized time span between the two dates; the unit is automatically guessed from the size of the difference

```javascript
$$.number(65423.12);
$$.number(65423.12, 3);
$$.currency(15000, "EUR");
$$.time(new Date());
$$.time(new Date(), true);
$$.date(new Date());
$$.date(new Date(), true);
$$.diff(new Date("2023-07-01"),new Date("2023-07-07"));
```

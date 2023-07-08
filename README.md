# Evalocale

A core library for Node.js and browsers to facilitate dynamic loading of texts in different languages.
See also evalocale-express for integration in Express.js based applications.

## Key features

- easy to setup and use
- both Node.js and web application
- Intl module implementation through various formatters
- automatic environment language recognition
- metadata support

## Install

Node.js package instalation:

```npm
npm install evalocale
```

Browser webpack compiled package installation:

```html
<script src="./src/evalocale.min.js">
```

## Basic usage

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

## Set-up and configuration

Most of the necessary service configuration is possible using the flexible *set* method. It consumes different types and amounts of arguments, while if only one argument is specified, then the language is set if it is a string type, or if it is an object, the configuration of the evalocale environment is performed. If two arguments (or an even number of arguments) are specified, then the odd argument is taken as a language abbreviation and the even argument as an object with dictionary data. In all cases, the root function evalocale is returned.

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

***Loading a bundle***

A bundle is a sort of serializied underlying data, including library, metadata etc. If the first (and one and only) argument is object and contains property *library*, it is considered to be a bundle.

```javascript
let bundle = {"library":{"cs-CZ":{"a1b2":"Jmenuji se {{name}}.","c3d4":"Je mi {{age}} let.","e5f6":""},"en-GB":{"a1b2":"My name is {{name}}.","c3d4":"I am {{age}}.","e5f6":"I am a developer."}},"metadata":{"a1b2":{"app":"retusa","version":1},"c3d4":{"app":"retusa","version":1},"e5f6":{"app":"retusa","version":1}},"language":"en-GB"};
$$.set(bundle);
```

***Setting the active language***

Setting the active language can be done in several ways, all of which have the same effect:

```javascript
// by means of the set method
$$.set("en-GB");
// by language getter
$$.language = "en-GB";
// by switch method
$$.switch("en-GB");
```

***Calling configuration methods***

Many configuration methods might be called by the *set* method. Mind that the configuration cannot be mixed with dictionary data.

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
$$.set(bundle).set(config);
```

### load(bundle)

Load method consumer the entire data bundle, including the library object, metadata object etc. The argument might be also parsable JSON string.

```javascript
$$.load({
    "library": {"en-Gb", {"a1b2c3d4": "This is {{quality}} library."}},
    "metadata": {"a1b2c3d4": {"id": "someID", "app": "someApp", "description": "whatever", "version": 1}},
    "language": "cs-CZ" //optional    
});
```

#### Example

```javascript
var $$ = require("evalocale");
$$.set("en-Gb", {"a1b2c3d4": "This is {{quality}} library."}).set("cs-CZ", {"a1b2c3d4": "Toto je {{quality}} knihovna."});
console.log($$("a1b2c3d4", {quality: "ošklivá"}));
```

## Properties

### default (readonly)

Returns the environment (Node.js or browser) user language, e.g. en-GB etc.

```javascript
console.log($$.default);
// e.g. cs-CZ
```

## Utils

### Generator

Instead of generating unique keys, it is easier to let the job up to the package. Calling the root method *generate* creates a required languages and items. The config argument is an object with following properties:

- total (UInt): total of items to be generated
- language (string | Array of strings): dictionary(s) to be created
- chars (Uint): number of characters of each key (default 8)

```javascript
var $$ = require("evalocale").generate({total: 500, chars: 8, language: ["en-GB", "cs-CZ"], metadata: {app: "someApp"}});
```

### Formatters

The Intl module allows flexible formatting of numbers and data in many languages. Evalocale supports simplified calls for several common user requests. In addition, however, you can use the functions of the Intl module as you wish.

- **number**(value, decimals): converts a number to a locale string; if decimals are not specified, they are set to auto
- **currency**(value, currency): converts a number to a locale currency string; the currency code is checked against the list of acceplable currency codes (is not case sensitive)
- **time**(value, short=false): converts a date instance to time string; if short (default false) is set to true, returns only hours and minutes, otherwise hh:mm:ss
- **date**(value, short=false): converts a date instance to date string; if short (default false) is set to true, returns only hours and minutes, otherwise hh:mm:ss
- **diff**(thisTime, thatTime): return a humanized time span between the two dates; the unit is automatically guessed from the size of the difference

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

# ELOCALE (core)

A core library for Node.js and browsers to facilitate dynamic loading of texts in different languages.
See also elocale-express for integration in Express.js based applications.

## Key features

- easy to setup and use
- automatic environment language recognition

## Install

Node.js package instalation:

```npm
npm install elocale
```

Browser webpack compiled package installation:

```html
<script src="./src/locale.min.js">
```

## Basic usage

### Node.js

```js
var $$ = require("elocale").set("en-Gb", {"a1b2c3d4": "This is {{quality}} library."});
console.log($$("a1b2c3d4", {quality: "an ugly"}));
```

### Browser

```js
var $$ = window.elocale.set("en-Gb", {"a1b2c3d4": "This is {{quality}} library."});
console.log($$("a1b2c3d4", {quality: "an ugly"}));
```

## Setting library content

There are several ways how to set the particular dictionaries which are stored in the library.

### set(langugage,data)

```javascript
$$.set("en-Gb", {"a1b2c3d4": "This is {{quality}} library."});
```

### load(bundle)

Load method consumer the entire elocale bundle, including the library object, metadata object etc. The argument might be also parsable JSON string.

```javascript
$$.load({
    "library": {"en-Gb", {"a1b2c3d4": "This is {{quality}} library."}},
    "metadata": {"a1b2c3d4": {"id": "someID", "app": "someApp", "description": "whatever", "version": 1}},
    "language": "cs-CZ" //optional    
});
```

#### Example

```javascript
var $$ = require("locale-core");
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

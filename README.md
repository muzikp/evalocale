# Locale

A library for Node.js and browsers to facilitate dynamic loading of texts in different languages.
See also locale-express for integration in Expressjs applications.

## Key features

- easy to setup and use
- automatic environment language recognition 

## Install

Node.js package instalation:

```npm
npm install locale-core
```

Browser webpack compiled package installation:

```html
<script src="./src/locale.min.js">
```

## Basic usage

### Node.js

```js
var $$ = require("locale-core").set("en-Gb", {"a1b2c3d4": "This is {{quality}} library."});
console.log($$("a1b2c3d4", {quality: "an ugly"}));
```

### Browser

```js
var $$ = window.locale.set("en-Gb", {"a1b2c3d4": "This is {{quality}} library."});
console.log($$("a1b2c3d4", {quality: "an ugly"}));
```

## Methods

### Set library content

#### Example

```js
var $$ = require("locale-core");
$$.set("en-Gb", {"a1b2c3d4": "This is {{quality}} library."}).set("cs-CZ", {"a1b2c3d4": "Toto je {{quality}} knihovna."});
console.log($$("a1b2c3d4", {quality: "ošklivá"}));
```

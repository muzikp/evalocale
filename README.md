# locale-core

## Basic usage

```js
var $$ = require("locale-core").set("en-Gb", {"a1b2c3d4": "This is {{quality}} library."});
console.log($$("a1b2c3d4", {quality: "ugly"}));

```

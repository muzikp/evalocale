# Evalocale API

## Methods

| **method** | **description** |
| ---------- | --------------- |
| [alias](#alias) | Assigns a custom language code to an existing dictionary. |
| [bind](#bind) | Creates a live connection between the evalocale instance and a source file. |
| [closest](#closest) | Finds the best match of an existing dictionary with the searched language code in the library. |

### alias

Assigns custom language(s) to an existing dictionary. Returns self.

| **param** | **description** | **type** | **required** | **default** |
| --------- | --------------- | -------- | ------------ | ----------- |
| nameOrAlias | The code of an existing dictionary to which the resolver will assign user-defined codes. | String | yes | |
| resolver | Resolver is a way to find the target dictionary. See examples bellow. | String \| Array\<*of String*\> \| Function | yes | |

```javascript
/*
- prerequisite: you have a $$ instance populated with en-GB dictionary as an example
*/
// assigning en-NZ to en-GB; if the user's language is en-NZ, $$ will respond in en-GB
$$.alias("en-GB", "en-NZ");
// assigning en-NZ, en-CA, en-US to en-GB; if the user's language is any of en-NZ/en-CA/en-US, $$ will respond in en-GB
$$.alias("en-GB", ["en-NZ", "en-CA", "en-US"]);
// assigning any language starting with en to en-GB
$$.alias("en-GB", (language) => language.substr(0,2) == "en");
```

### bind

It connects the source file (csv or json) to the evalocale instance and at the same time monitors the changes in the source file and takes them into account in its outputs in real time (or with minimal latency depending on the size of the file). This method therefore allows you to make changes to dictionaries in v without having to restart the application.

The method has *filePath* argument and is accessible from the Node.js environment only. Returns self.

```javascript
var $$ = require("evalocale").bind("./my-app-words.csv");
```

### closest

Returns the key of a dictionary that is closest to the specified value. If no similar language is found, returns either the default or the system language.

The method has a "what" argument, which is the code of the language you're looking for.

```javascript
/*
- prerequisite: you have a $$ instance populated with en-GB, cs-CZ, cs-SK and sk-SR dictionaries as an example
*/
$$.closest("GB") // => "en-GB"
$$.closest("en") // => "en-GB"
$$.closest("sk") // => "sk-SR"
$$.closest("fr-CA") // => default or system language (as neither fr nor CA found)

```

## Properties

Properties can be get/set by means plain getter/setter, or eventualy by the *set* method (see bellow). Only method marked "both" can be configured via the *set* method.

| **property** | **description** | **type** | **read/write** |
| ------------ | --------------- | -------- | -------------- |
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

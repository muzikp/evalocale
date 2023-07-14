# Evalocale API

## Methods

### alias(nameOrAlias, resolver)

Assigns a custom language code to an existing dictionary.

#### Arguments

**nameOrAlies** {String}

A custom language code want to assign to some dictionary (eg. en-DE).

**resolver** {String | Array<of String> | Function}

Resolver is a way to find the target dictionary. It can be either a string (eg. "en-NZ"), an array of strings (e.g. ["en-NZ", "en-CA"]) or a function (eg. (language) => language.substr(0,2) == "en").

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

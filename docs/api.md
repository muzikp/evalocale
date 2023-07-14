# Evalocale API

## Methods

| **method** | **description** |
| ---------- | --------------- |
| [alias](#alias) | Assigns a custom language code to an existing dictionary. |
| [clean](#clean) | Removes unused codes from the bundle. |

### alias

Assigns custom language(s) to an existing dictionary.

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

### clean

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

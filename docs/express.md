# Evalocale Express.js extension

Express.js is a popular back-end framework. Evalocale extension enables seamless language recognition and rendering with a two lines. It also provides with a pug template for client-side user selection.

1. Optional: install the language selelector (a pug template)

```npx
npx evalocale install express
```

2. Insert somewhere at the beginning of the app.js

```javascript
//with no config
const $$ = require("evalocale")();
//or with some configuration
const $$ = require("evalocale")({alertsOn: process.env.NODE_ENV == "development"})
//or even with setting content
const $$ = require("evalocale")({alertsOn: process.env.NODE_ENV == "development"}).fromCSVfile(\<csv file path>);
```

3. Set the evalocale express middleware to be used

```javascript
//using defaults
app.use($$.express());
//or setting your own preferences
app.use($$.express({
    forceChoice: true
}));
```

```pug

```

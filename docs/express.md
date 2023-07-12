# Evalocale Express.js extension

Express.js is a popular back-end framework. Evalocale extension enables seamless language recognition and rendering with a two lines.

1. Insert somewhere at the beginning of the app.js

```javascript
//with no config
const $$ = require("evalocale")();
//or with some configuration
const $$ = require("evalocale")({alertsOn: process.env.NODE_ENV == "development"})
//or even with setting content
const $$ = require("evalocale")({alertsOn: process.env.NODE_ENV == "development"}).fromCSVfile(\<csv file path>);
```

2. Set the evalocale express middleware to be used

```javascript
app.use($$.express)
```

If you want to use the language selection widget, you have to first install it to your "views" folder:

```npx
npx evalocale install pug 
```

If you use another directory for the pug views, specify the path:

```npx
npx evalocale install pug -p "./my-views/"
```

# Evalocale Express.js extension

Express.js is a popular back-end framework. Evalocale extension enables seamless language recognition and rendering with a two lines. It also provides with a pug template for client-side user selection.

1. Optional: install the language-selector (a pug template with a script and styling)

    ```npx
    npx evalocale install express
    ```

    This will copy evalocale.pug to the /views subfolder. The other thing (2.) has to be done manually.

2. Insert somewhere at the beginning of the app.js

    ```javascript
    //with no config
    const $$ = require("evalocale")();
    //or with some configuration
    const $$ = require("evalocale")({alertsOn: process.env.NODE_ENV == "development"})
    //or even with setting content
    const $$ = require("evalocale")({alertsOn: process.env.NODE_ENV == "development"}).bind(\<csv file path>);
    ```

3. Set the evalocale express middleware to be used

    ```javascript
    //using defaults
    app.use($$.express());
    //or setting your own preferences
    app.use($$.express());
    ```

4. Optional: add the language-selector widget (eg. to the navbar menu)

    ```pug
    nav.navbar.navbar-expand-lg.navbar-light.bg-light
			a.navbar-brand(href='#') Navbar
			button.navbar-toggler(type='button' data-toggle='collapse' data-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation')
					span.navbar-toggler-icon
			#navbarNav.collapse.navbar-collapse
					ul.navbar-nav
					li.nav-item.active
							a.nav-link(href='#')
							| Home 
							span.sr-only (current)
					li.nav-item
							.nav-link
								include evalocale.pug
					li.nav-item
							a.nav-link(href='#') Pricing
					li.nav-item
							a.nav-link.disabled(href='#') Disabled
    ```

    The language change-event has a default behaviour. You override it with your own callback (an example with jQuery, but you can use plain javascript):

    ```javascript
    $(document).on("evalocale.changed", function(event){
        event.preventDefault();
        var originalLanguage = event.detail.original;
        var selectedLanguage = event.detail.selected;        
        /*
            do anything here
        */
        // hide the dropdown menu as you wish
        event.detail.hide();
    });
    ```

## Introducing Plugins

Plugins are whatever you want them to be. They can be extensions to the code, or they can be complete modifications of the code. They allow you to build smaller (or bigger) projects that require Klasa, while still maintaining everything that Klasa offers.

An example of Klasa Plugins in work is [klasa-dashboard-hooks](https://github.com/dirigeants/klasa-dashboard-hooks).

# To Get Started Using Plugins

It's very easy to get started with using the new plugin system.

Say we have our main app like so:

```javascript
const { Client } = require('klasa');
const config = require('./config.json');

new Client(config).login(config.token);
```

If you wanted to use the klasa-dashboard-hooks plugin, you would insert the following code (assuming you installed klasa-dashboard-hooks):

```javascript
const { Client } = require('klasa');
const config = require('./config.json');

Client.use(require('klasa-dashboard-hooks'));

new Client(config).login(config.token);
```

The client will be created, and you will be able to use all of the features of the plugin inside your bot.

You can have as many plugins as you want, and they will loaded in the same order that you added them in your main app.

# To Get Started Making Plugins

The only requirement for making a plugin is to make sure you export an unbound function as the plugin. Here's a small example of what a plugin could look like:

```javascript
// index.js
const { Client: { plugin } } = require('klasa');
module.exports = {
	// [plugin] must be typed exactly like this.
	[plugin]() {
		this.klasaIsCool = true;
	}
};
```

Accessing `this.client.klasaIsCool` from within your bot would be true here, assuming you followed steps above to insert the plugin into your code with the `use` method.

Besides that, you can basically do anything with your code. Your plugin can extend Klasa code, modify it, or even remove it completely.

# SettingGateway

What is SettingGateway? It is an interface that connects your Discord bot with a database and ensures maximum performance by using a very refined cache system that is always up to date with the database. In a point of view, SettingGateway can be understood as an abstracted [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping) as it's able to run any kind database (with a compatible {@link Provider}) and manage the data efficiently.

By default, Klasa uses the [json](https://github.com/dirigeants/klasa/blob/master/src/providers/json.js) provider. Do not be fooled and insta-replace with SQLite, Klasa's JSON provider writes the data [atomically](https://en.wikipedia.org/wiki/Atomicity_%28database_systems%29). In other words, it is very rare for the data to corrupt.

Thanks to the abstraction of SettingGateway, the developer has many options, for example, if you want to change the database that manages the data, you just change one line of code, without needing to rewrite everything that relies on it, nor you need to rewrite the interface itself in order to be able to work with a different database.

## Database Engine

As mentioned before, SettingGateway is abstracted, it does not rely on a very specific database, but can use any of them. In a production bot, you may want to use a process-based database such as rethinkdb, mongodb or postgresql, you can check and download them from the [klasa-pieces](https://github.com/dirigeants/klasa-pieces/) repository so you don't need to make one from scratch.

Now... how do we update it? Go to your main file, where {@link KlasaClient} is initialized, and add a new option to your {@link KlasaClientOptions}. The following code snippet as an example:

```javascript
const client = new KlasaClient({ providers: { default: 'rethinkdb' } });
```

If you have other options, such as a prefix, then your main file would look like this:

```javascript
const { KlasaClient } = require('klasa');

new KlasaClient({
	prefix: 'k!',
	providers: { default: 'rethinkdb' }
}).login('A_BEAUTIFUL_TOKEN_AINT_IT?');
```

And now, you're using rethinkdb's provider to store the data from SettingGateway.

## Creating Gateways

Another advantage of using this interface is that it can handle multiple databases simultaneously, for example, Klasa handles 3 gateways at the same time: `clientStorage` for Client, `guilds` for Guild and `users` for User. Plus, there's the possibility to add a new {@link Gateway} by using {@link KlasaClient#gateways}:

Let's say I want to add a new Gateway instance called `channels` that stores data to complement our permissions, and I want the **postgresql** provider to handle it but **rethinkdb** as the default provider.

```javascript
const { KlasaClient } = require('klasa');

const client = new KlasaClient({
	prefix: 'k!',
	providers: { default: 'rethinkdb' }
});

// Now, we create it:
client.gateways.register('channels', {
	disabledCommands: {
		type: 'Command',
		default: [],
		array: true
	},
	commandThrottle: {
		type: 'Integer',
		default: 5,
		min: 0,
		max: 60
	},
	commandReset: {
		type: 'Integer',
		default: 2,
		min: 0,
		max: 30
	}
}, { provider: 'postgresql' });

client.login('A_BEAUTIFUL_TOKEN_AINT_IT?');
```

> **Note**: You can have any schema, check the links below to understand how to expand it later.

And then, you can access to it by:

```javascript
client.gateways.channels;
```

## Customizing the options for each built-in gateway

This is available in 0.5.0 since the PR [#152](https://github.com/dirigeants/klasa/pull/152), and you're able to configure the three built-in gateways: `guilds`, `users` and `clientStorage`. The option to configure them is {@link KlasaClientOptions.gateways}, where you would add the option `gateways` to your KlasaClientOptions:

```javascript
new Klasa.Client({
	prefix: 'k!',
	providers: { default: 'json' },
	gateways: {
		guilds: { provider: 'rethinkdb' },
		users: { provider: 'postgresql' }
	}
}).login('A_BEAUTIFUL_TOKEN_AINT_IT?');
```

Where the *clientStorage* gateway would take the default options (json provider), the *guilds* gateway would use the rethinkdb provider, and finally the *users* one would use the postgresql provider. These options are {@link GatewayDriver.GatewayDriverAddOptions}.

## Further Reading:

- {@tutorial UnderstandingSchemaPieces}
- {@tutorial UnderstandingSchemaFolders}
- {@tutorial SettingGatewayKeyTypes}
- {@tutorial SettingGatewayConfigurationUpdate}

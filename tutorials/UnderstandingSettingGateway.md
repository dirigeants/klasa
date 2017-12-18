# SettingGateway

The SettingGateway is designed to provide users a very useful interface for managing data. Each instance is able to handle a completely different schema and database.

By default, Klasa uses the [json](https://github.com/dirigeants/klasa/blob/master/src/providers/json.js) provider. Do not be fooled and insta-replace with SQLite, Klasa's JSON provider writes the data [atomically](https://en.wikipedia.org/wiki/Atomicity_(database_systems)), in other words, it is very rare for the data to corrupt.

However, as Klasa works on a [NoSQL](https://en.wikipedia.org/wiki/NoSQL) environment, however, SQL parsing has been improved to reduce the NoSQL middleware processing and be able to match it in performance's speed. SQL providers also need a special set of methods and properties to make the provider {@link SQL} compatible.

## Change the *provider's engine*.

For example, let's say I have downloaded the *levelup* provider and I want to work with it, then we go to your main script file (`app.js`, `bot.js`..., wherever you declare the new Klasa.Client), and write the following code:

```javascript
provider: { engine: 'levelup' }
```

Your Klasa's configuration will look something like this:

```javascript
const client = new Klasa.Client({
  ownerID: '',
  prefix: 'k!',
  clientOptions: {},
  provider: { engine: '' },
});

client.login('A_BEAUTIFUL_TOKEN_AINT_IT?');
```

And now, you're using levelup's provider to store the data from SettingGateway.

What happens when I use an engine that does not exist as a provider? Simply, SettingGateway will throw an error, it is enough user-friendly and readable, if that happens, make sure you wrote the provider's name correctly.

## Add new 'keys' to the guild configuration's schema.

You can easily add keys to the schema by doing this:

```javascript
this.client.gateways.guilds.schema.addKey(key, options, force?);
```

Where:

- `key` is the key's name to add, `String` type.
- `options` is an object containing the options for the key, such as `type`, `default`, `sql`, `array`...
- `force` (defaults to `true`) is whether SchemaManager should update all documents/rows to match the new schema, using the `options.default` value.

For example, let's say I want to add a new configuration key, called `modlogs`, which takes a channel.

```javascript
this.client.gateways.guilds.schema.addKey('modlogs', { type: 'TextChannel' });
```

This will create a new configuration key, called `modlogs`, and will take a `TextChannel` type.

> The force parameter defaults to `true` instead to `false`. It is also recommended to use it as it can avoid certain unwanted actions.

But now, I want to add another key, with name of `users`, *so I can set a list of blacklisted users who won't be able to use commands*, which will take an array of Users.

```javascript
this.client.gateways.guilds.schema.addKey('users', { type: 'User', array: true });
```

> `options.array` defaults to `false`, and when `options.default` is not specified, it defaults to `null`, however, when `options.array` is `true`, `options.default` defaults to `[]` (empty array).

What have we done? `client.gateways.guilds.schema` is a **SchemaFolder** instance (also called Folder type) which can manage itself, such as adding keys/folders to itself (it certainly follows the OOP paradigm).

## Editing keys from the guild configuration.

Now that I have a new key called `modlogs`, I want to configure it outside the `conf` command, how can we do this?

```javascript
msg.guild.configs.update('modlogs', '267727088465739778', msg.guild);
```

Check: {@link Configuration.updateOne}

> You can use a Channel instance, {@link SettingResolver} will make sure the input is valid and the database gets an **ID** and not an object.

Now, I want to **add** a new user user to the `users` key, which takes an array.

```javascript
msg.guild.configs.update('users', '146048938242211840', msg.guild, { action: 'add' });
```

That will add the user `'146048938242211840'` to the `users` array. To remove it:

```javascript
msg.guild.configs.update('users', '146048938242211840', msg.guild, { action: 'remove' });
```

Check: {@link Configuration.updateArray}

## Removing a key from the guild configuration.

I have a key which is useless for me, so I *want* to remove it from the schema.

```javascript
this.client.gateways.guilds.schema.removeKey('users');
```

## Create a new folder to the schema

It's very similar to how you create a new key into it, but it only accepts three arguments:

```javascript
this.client.gateways.guilds.schema.addFolder(name, object, force);
```

So, let's say I want a key called 'modlogs' into the 'channels' folder for organization. There are two ways to do it:

### Slower

```javascript
const { schema } = this.client.gateways.guilds;
async function() {
	await schema.addFolder('channels');
	await schema.channels.addKey('modlogs', { type: 'TextChannel' });
	console.log(schema.channels.modlogs.toJSON());
	// {
	//  	type: 'textchannel',
	//  	array: false,
	//  	default: null,
	//  	min: null,
	//  	max: null,
	//  	configurable: true
	// }
}
```

### Faster

```javascript
const { schema } = this.client.gateways.guilds;
async function() {
	await schema.addFolder('channels', { modlogs: { type: 'TextChannel' } });
	console.log(schema.channels.modlogs.toJSON());
	// {
	//  	type: 'textchannel',
	//  	array: false,
	//  	default: null,
	//  	min: null,
	//  	max: null,
	//  	configurable: true
	// }
}
```

Now, how we do configure it with the built-in conf command? Easy:

```sh
k!conf set channels.modlogs #modlogs
```

## Add a key to the guild configuration's schema if it doesn't exist.

In [Klasa-Pieces](https://github.com/dirigeants/klasa-pieces/), specially, some pieces require a key from the configuration to work, however, the creator of the pieces does not know if the user who downloads the piece has it, so this function becomes is useful in this case.

```javascript
const { schema } = this.client.gateways.guilds;
async function() {
	if (!schema.hasKey('modlog')) {
		await schema.addKey('modlog', { type: 'TextChannel' });
	}
}
```

## How can I create new Gateway instances?

By using {@link GatewayDriver}, (available from `client.gateways`).

Let's say I want to add a new Gateway instance, called `channels`, which input takes channels, and stores some data to complement our permissions.

```javascript
// Must use the function keyword or be a method of a class.
async function validate(channelResolvable) {
	// 'this' is referred to the GatewayDriver's instance, it has access
	// to client, resolver...
	const result = await this.resolver.channel(channelResolvable);
	if (result) return result;

	throw 'The parameter <Channel> expects either a Channel ID or a Channel Instance.';
}

// Define the schema for the new Gateway.
const schema = {
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
};

// Now, we create it:
this.client.gateways.add('channels', validate, schema);
```

> Since [[#43](https://github.com/dirigeants/klasa/pull/43)], validate only accepts a single argument, instead of being resolver the first one.

> The `validate` function must be a [**function**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function), not a [**Arrow Function**](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions), the difference between them is that an arrow function binds `this` to wherever the function has been created (for example, the `exports` from your eval command, if you are doing this with eval), while the normal functions does not do this.

> If the `validate` function does not resolve **Guild** type, you might want to use the fourth argument of `Gateway#updateOne` (third in Gateway#updateMany), which takes a Guild resolvable.

And then, you can access to it by:

```javascript
this.client.gateways.channels;
```

## Using different providers in different gateways

This is new from the SettingGateway v2 (check [#43](https://github.com/dirigeants/klasa/pull/43)), when creating a new Gateway (check above for how to do it), there's an extra parameter in `client.gateways.add` called `options`. It's optional, but it accepts an object with one key: `provider`, which is the Provider/SQLProvider (json, leveldb, rethinkdb...). For example:

```javascript
this.client.gateways.add('channels', validate, schema, { provider: 'rethinkdb' });
```

The code above will create a new Gateway instance called 'channels', which will use RethinkDB to store the persistent data.

# SettingsGateway

SettingsGateway is the name of Klasa's dedicated settings module, it offers a really fast and reliable database management with caching. It consists of the following elements:

- [Schemas](#Schemas), where the data structure for the database is defined.
- [Settings](#Settings), where entries from the database are cached at.
- [Gateways](#Gateways), where an entire table from the provider is managed.
- [Serializers](#Serializers), where the data is processed for storage.
- [Providers](#Providers), where the interactions with the database take place.

By default, Klasa uses an [atomic][atomic] [JSON][json] provider which has been made to not corrupt data, *at least, not easily*.

## Schemas

They consist of two elements:

- {@link SchemaPiece Pieces}: They hold the metadata necessary for providers, serializers, and settings, to work properly.
- {@link Schema Groups}: They are maps that contain other {@link SchemaFolder groups} or {@link SchemaPiece pieces}. A group inside another is often called a nested group or nested folder. The most basic actions is:

### Adding a Value

Using {@link Schema#add}, we give it a name, a type, and optionally, an options object:

```javascript
// Add a key called allowFun, which takes a boolean
schema.add('allowFun', 'Boolean');
```

> **Note**: The type is not case sensitive, they are lowercased.

And optionally, an options object as the third parameter, with the type definition of {@link SettingsFolderUpdateOptions}:

```javascript
// Add a key called disabledChannels, which takes text channels
schema.add('disabledChannels', 'TextChannel', { array: true });

// Or hide it from the configuration command
schema.add('disabledChannels', 'TextChannel', { array: true, configurable: false });
```

Additionally, changing the type to be a function instead of a string will create a folder. The third parameter is ignored in this case. The element passed to said function will be a {@link SchemaFolder folder} that we will use to add keys to:

```javascript
// Add a key called moderation inside the channels group
schema.add('channels', folder => folder
	.add('moderation', 'TextChannel'));
```

You can also chain folders inside other folders (just make sure to not name them the same!):

```javascript
schema.add('management', management => management
	.add('channels', channels => channels
		.add('moderation', 'TextChannel')
		.add('members', 'TextChannel'))
	.add('roles', roles => roles
		.add('administrator', 'Role')));
```

> **Note**: In practise, you will have {@link KlasaClient.defaultClientSchema}, {@link KlasaClient.defaultGuildSchema}, and {@link KlasaClient.defaultUserSchema}, to edit the client settings' schema, the guild settings' schema, and the user settings' schema, respectively.

## Settings

They are maps that mirror the schemas with the values, they are always filled with all the elements from it, using schema's default values if no value is available in the database, this allows safety as the keys will always exist if they are defined in the schemas. The two most basic actions are:

### Getting a Value

Using {@link Settings#get}, we give it a path:

```javascript
// Get the prefix from the guild
message.guild.settings.get('prefix');
```

When using nested groups, we separate the groups names by dot:

```javascript
// Get the value from the administrator key from the roles group
message.guild.settings.get('roles.administrator');
```

### Updating a Value

Using {@link Settings#update}, or {@link Settings#reset} to restore a value to its default:

```javascript
// Set the prefix to $
message.guild.settings.update('prefix', '$');

// Reset the prefix to its default value
message.guild.settings.reset('prefix');
```

We can also reset a group, or the entire settings instance, though for the latter, destroying it is more efficient:

```javascript
// Reset the roles group
message.guild.settings.reset('roles');

// Reset all the settings
message.guild.settings.reset();

// Or more efficiently (also deletes the entry from the database)
message.guild.settings.destroy();
```

> **Note**: When sharding, user and client settings are updated in all shards.

## Gateways



## Serializers



## Providers

They provide full control of the data from a database

[json]: https://github.com/dirigeants/klasa/blob/master/src/providers/json.js
[atomic]: https://en.wikipedia.org/wiki/Atomicity_%28database_systems%29



Thanks to the abstraction of SettingsGateway, the developer has many options, for example, if you want to change the database that manages the data, you just change one line of code, without needing to rewrite everything that relies on it, nor you need to rewrite the interface itself in order to be able to work with a different database.

## Database Engine

As mentioned before, SettingsGateway is abstracted, it does not rely on a very specific database, but can use any of them. In a production bot, you may want to use a process-based database such as rethinkdb, mongodb or postgresql, you can check and download them from the [klasa-pieces](https://github.com/dirigeants/klasa-pieces/) repository so you don't need to make one from scratch.

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

And now, you're using rethinkdb's provider to store the data from SettingsGateway.

## Creating Gateways

Another advantage of using this interface is that it can handle multiple databases simultaneously, for example, Klasa handles 3 gateways at the same time: `clientStorage` for Client, `guilds` for Guild and `users` for User. Plus, there's the possibility to add a new {@link Gateway} by using {@link KlasaClient#gateways}:

Let's say I want to add a new Gateway instance called `channels` that stores data to complement our permissions, and I want the **postgresql** provider to handle it but **rethinkdb** as the default provider.

```javascript
const { KlasaClient, Schema } = require('klasa');

const client = new KlasaClient({
	prefix: 'k!',
	providers: { default: 'rethinkdb' }
});

// Now, we create it:
client.gateways.register('channels', {
	provider: 'postgresql',
	schema: new Schema()
		.add('disabledCommands', 'Command', { array: true })
		.add('commandThrottle', 'Integer', { default: 5, min: 0, max: 60 })
		.add('commandReset', 'Integer', { default: 2, min: 0, max: 30 })
});

client.login('A_BEAUTIFUL_TOKEN_AINT_IT?');
```

> **Note**: You can have any schema, check the links below to understand how to expand it later.

And then, you can access to it by:

```javascript
client.gateways.get('channels');
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
- {@tutorial SettingsGatewayKeyTypes}
- {@tutorial SettingsGatewaySettingsUpdate}

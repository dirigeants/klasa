# Understanding Schema

A schema works like a diagram or a blueprint, in SettingGateway, the schema defines the keys present in the configuration for a specific gateway. This feature serves multiple purposes:

1. Define what keys the {@link Gateway} manages and their properties.
1. Define what type the keys must hold.
1. Define the SQL schema when using a SQL database.
1. Speed up performance when iterating over keys.

## Adding keys

Adding keys with the schema is like adding a piece into a box, but you can also have boxes inside other boxes. That being said, you get the box you want to modify and insert the new pieces or boxes into it. The methods to achieve that are {@link SchemaFolder#add} to add pieces (keys) and boxes (folders).

You would normally use these two methods using the following snippet:

```javascript
// Add a new key or folder
this.client.gateways.gatewayName.schema.add(name, options, force);
```

The parameters are:

- **name**: The name of the new key. If it conflicts with a pre-existent key, this will error.
- **options**: The options for the new key or folder. Check {@link SchemaFolderAddOptions}.
- **force**: Whether this change should affect all entries. It requires a lot of processing but ensures the changes are correctly applied in both the cache and database.

You can also extend any of the three built-in {@link Gateway}s from Klasa. For example, if you want to add a new key called **modlogs** that accepts only text channels, for your guild configs, you would use the following code:

```javascript
this.client.gateways.guilds.schema.add('modlogs', { type: 'TextChannel' });
```

Where you're doing the following steps:

1. Access to {@link KlasaClient#gateways}, type of {@link GatewayDriver}, which holds all gateways.
1. Access to the guilds' {@link Gateway}, which manages the per-guild configuration.
1. Access to the guilds' schema via {@link Gateway#schema}, which manages the gateway's schema.
1. Add a new key called **modlogs** in the root of the schema, with a type of **TextChannel**.

And you would have a perfectly configured modlogs key in your configs. However, you can also have an array of the same type. For example, you want to have a configurable array of users blacklisted in a guild, in a key named **userBlacklist**:

```javascript
this.client.gateways.guilds.schema.add('userBlacklist', { type: 'User', array: true });
```

And now you can have access to any of them in your guild configs like in the following snippet!

```javascript
msg.guild.configs.modlogs;
// null
msg.guild.configs.userBlacklist;
// []
```

## Removing keys

Removing keys with the schema is quite easy, as you would have access to the {@link SchemaFolder} that holds it and remove it by its name (remember that `force` is optional and defaults to `true`) using {@link SchemaFolder#remove} as in the following example:

```javascript
this.client.gateways.gatewayName.schema.remove(name, force);
```

In case you have a key you do not longer use and you want to get rid of it, for example, the recently created **userBlacklist** key for guild configs, you would run the following code:

```javascript
this.client.gateways.guilds.schema.remove('userBlacklist');
```

And the property `userBlacklist` for all guild configs will be deleted.

## Adding folders

Folder creation is very similar to key creation, but with one key difference: it has no options for itself, but instead, it can create its children keys (just like you can add a box with other boxes and pieces, into another). You can add a new key inside a new folder in two different ways:

### Slower

You can create a folder, then create the keys, however, this will iterate over all entries twice:

```javascript
async function init() {
	const { schema } = this.client.gateways.guilds;

	await schema.add('channels', {});
	await schema.channels.add('modlogs', { type: 'TextChannel' });
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

However, it's possible to create a folder with all the sub-keys (and even more nested folders) with the folder creation.

```javascript
async function init() {
	const { schema } = this.client.gateways.guilds;

	await schema.add('channels', { modlogs: { type: 'TextChannel' } });
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

> **Reminder**: To access a key inside a folder in your configuration command, you use the access operator (`.`). For example: *k!conf set channels.modlogs #modlogs*

## Removing folders

Removing folders is the same as removing keys, check {@link SchemaFolder#remove}, the difference is that, while removing a key will remove one value from the schema, removing a folder will remove it with all its nested keys and folders, even very nested ones.

## Ensuring the existence of a key.

In [klasa pieces](https://github.com/dirigeants/klasa-pieces/) specially, some pieces require a key from the configuration to work, however, the creator of the pieces does not know if the user who downloads the piece has it, so this function becomes useful in this case.

```javascript
async function init() {
	const { schema } = this.client.gateways.guilds;

	if (!schema.has('modlog')) {
		await schema.add('modlog', { type: 'TextChannel' });
	}
}
```

## Further Reading:

- {@tutorial UnderstandingSchemaPieces}
- {@tutorial SettingGatewayKeyTypes}
- {@tutorial SettingGatewayConfigurationUpdate}

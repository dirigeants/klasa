# Understanding Schema

A schema works like a diagram or a blueprint, in SettingsGateway, the schema defines the keys present in the configuration for a specific gateway. This feature serves multiple purposes:

1. Define what keys the {@link Gateway} manages and their properties.
1. Define what type the keys must hold.
1. Speed up performance when iterating over keys.

## Adding keys

Adding keys into the schema is similar to adding new levels with {@link PermissionLevels}, and it is like adding a piece into a box, but you can also have boxes inside other boxes. That being said, you get the box you want to modify and insert the new pieces or boxes into it. The methods to achieve that are {@link SchemaFolder#add} to add pieces (keys) and boxes (folders).

In built-in gateways (`guilds`, `users`, and `clientStorage`), you can access to the pre-set schemas, accessible via {@link KlasaClient.defaultGuildSchema}, {@link KlasaClient.defaultUserSchema}, and {@link KlasaClient.defaultClientSchema}, respectively. However, similarly to {@link PermissionLevels}, you can either modify the default schema, overwrite it with new {@link Schema}, or making a new {@link Schema} and pass it into {@link KlasaClientOptions}.{@link KlasaGatewaysOptions gateways}.{@link GatewayDriverRegisterOptions gatewayName}.{@link Schema schema}, for example, `new KlasaClient({ gateways: { guilds: { schema: new Schema() } } });`.

For simplicity in this guide, we will use the first option. For plugin developers, they may edit it via `this.client.gateways.gatewayName.schema`.

Adding a new key to the guilds' schema would be as simple as doing this:

```javascript
// Add a new key or folder to the guild's schema
KlasaClient.defaultGuildSchema.add(name, typeOrCallback, options);
```

The parameters are:

- **name**: The name of the new key. If it conflicts with a pre-existent key, this will error.
- **typeOrCallback**: If it is a string, it will be a key, otherwise in case of a callback, this will be a folder.
- **options**: The options for the new key. Check {@link SchemaFolderAddOptions}.

A common example for bots is to have a configurable chat log in Discord, for simplicity you may add it in the root folder, but the convention is to have folders holding the same type. For example:

```javascript
// Adding the key to the root folder
KlasaClient.defaultGuildSchema.add('channelLog', 'TextChannel');

// Adding the key to a channels folder
KlasaClient.defaultGuildSchema.add('channels', folder => folder
	.add('log', 'TextChannel'));
```

Where the first option would be accessible from `message.guild.settings.channelLog`, and the second from `message.guild.settings.channels.log`. Users would configure them with `[p]conf set channelLog #logs` or `[p]conf set channels.log #logs`, depending on how you structure it.

The schema is also able to store multiple values in a single key, this is used for per-guild's configurable disabled commands, and for the client's tasks. Making a key accept an array only requires the usage of {@link SchemaPieceOptions}. For example, adding a user blacklist for your bot in your client's schema (to prevent users from using or inviting your bot):

```javascript
KlasaClient.defaultClientSchema.add('userBlacklist', 'User', { array: true });
```

And now in your inhibitor or your guildCreate event, you can access to the array via `this.client.settings.userBlacklist`.

A full example of a correctly configured schema would be the following:

```javascript
KlasaClient.defaultGuildSchema
	.add('channels', folder => folder
		.add('log', 'TextChannel')
		.add('announcement', 'TextChannel'))
	.add('roles', folder =>
		.add('administrator', 'Role')
		.add('moderator', 'Role'))
	.add('disabledChannels', 'TextChannel', { array: true });
```

> **NOTE**: The type argument is not case sensitive, they are lowercased. For readability, you may want to use the case you find confortable with.

## Removing keys

The opposite of adding keys is removing them, this operation is pretty rare to do, and it does not modify the database (you might want to handle it using provider's methods), this operation only requires to change {@link Schema#add} to {@link Schema#remove}:

```javascript
// Remove a key or folder from the guild's schema
KlasaClient.defaultGuildSchema.remove(name);
```

Let's say you want to remove the key `disabledChannels` from the guild's schema, the code to do so is the following:

```javascript
KlasaClient.defaultGuildSchema.remove('disabledChannels');
```

## Ensuring the existence of a key.

In [klasa pieces](https://github.com/dirigeants/klasa-pieces/) specially, some pieces require a key in the schema to work, however, the creator of the pieces does not know if the user who downloads the piece has it, so this function becomes useful in this case.

```javascript
async function init() {
	const { schema } = this.client.gateways.guilds;

	if (!schema.has('modlog')) {
		await schema.add('modlog', 'TextChannel');
	}
}
```

## Further Reading:

- {@tutorial UnderstandingSchemaPieces}
- {@tutorial SettingsGatewayKeyTypes}
- {@tutorial SettingsGatewaySettingsUpdate}

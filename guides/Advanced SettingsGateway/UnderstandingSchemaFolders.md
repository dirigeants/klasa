# Understanding Schema

A schema works like a diagram or a blueprint, in SettingsGateway, the schema defines the keys present in the configuration for a specific gateway. This feature serves multiple purposes:

1. Define what keys the {@link Gateway} manages and their properties.
1. Define what type the keys must hold.
1. Speed up performance when iterating over keys.

## Adding keys

Adding keys into the schema is similar to adding new levels with {@link PermissionLevels}, and it is like adding a piece into a box, but you can also have boxes inside other boxes. That being said, you get the box you want to modify and insert the new pieces or boxes into it. The methods to achieve that are {@link SchemaFolder#add} to add pieces (keys) and boxes (folders).

The built-in gateways (`guilds`, `users`, and `clientStorage`), can access to the pre-set schemas, accessible via {@link KlasaClient.defaultGuildSchema}, {@link KlasaClient.defaultUserSchema}, and {@link KlasaClient.defaultClientSchema}, respectively. However, similarly to {@link PermissionLevels}, you can either modify the default schema, overwrite it with new {@link Schema}, or making a new {@link Schema} and pass it into {@link KlasaClientOptions}.{@link GatewaysOptions gateways}.{@link GatewayDriverRegisterOptions gatewayName}.{@link Schema schema}, for example, `new KlasaClient({ gateways: { guilds: { schema: new Schema() } } });`.

For simplicity, in this guide, we will use the first option. For plugin developers, they may edit it via `this.client.gateways.gatewayName.schema`.

Adding a new key to the guilds' schema would be as simple as doing this:

```javascript
// Add a new key or folder to the guild's schema
KlasaClient.defaultGuildSchema.add(name, typeOrCallback, options);
```

The parameters are:

- **name**: The name of the new key. If it conflicts with a pre-existing key, it will overwrite the previous.
- **typeOrCallback**: If it is a string, it will be a key, otherwise in case of a callback, this will be a folder.
- **options**: The options for the new key. Check {@link SchemaFolderAddOptions}.

A common example for bots is to have a configurable chat log in Discord, for simplicity, you may add it in the root folder, but the convention is to have folders holding the same type. For example:

```javascript
// Adding the key to the root folder
KlasaClient.defaultGuildSchema.add('channelLog', 'TextChannel');

// Adding the key to a channels folder
KlasaClient.defaultGuildSchema.add('channels', folder => folder
	.add('log', 'TextChannel'));
```

Where the first option would be accessible from `message.guild.settings.channelLog`, and the second from `message.guild.settings.channels.log`. Users would configure them with `[p]conf set channelLog #logs` or `[p]conf set channels.log #logs`, depending on how you structure it. (`[p]` being your bot's prefix).

The schema is also able to store multiple values in a single key, this is used for per-guild-configurable disabled commands, and for the client's {@link Task tasks}. Making a key accept an array only requires the usage of {@link SchemaPieceOptions}. For example, adding a user blacklist in the client schema for your bot (to prevent users from using or inviting your bot):

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
	.add('roles', folder => folder
		.add('administrator', 'Role')
		.add('moderator', 'Role'))
	.add('disabledChannels', 'TextChannel', { array: true });
```

> **NOTE**: The type argument is not case sensitive, they are lowercased. For readability, you may want to use the case you are comfortable with.

## Removing keys

The opposite of adding keys is removing them, this operation is pretty rare to do, and it does not modify the database (you might want to handle it using provider's methods), this operation only requires you to change {@link Schema#add} to {@link Schema#remove}:

```javascript
// Remove a key or folder from the guild's schema
KlasaClient.defaultGuildSchema.remove(name);
```

Let's say you want to remove the `disabledChannels` key from the guild's schema, the code to do so is the following:

```javascript
KlasaClient.defaultGuildSchema.remove('disabledChannels');
```

## Ensuring the existence of a key.

Ensuring that a key exists is as simple as checking if the Schema.has() the key name.

```javascript
const { Client } = require('klasa');

// Returns true or false, depending on if the Schema has the prefix key.
Client.defaultGuildSchema.has('prefix');
```

> **NOTE**: In the past it was possible to add keys using the init function from the Piece. This is no longer the case and the only way to add new keys to schema is to do it in your entry file(index.js, app.js, etc.). You can also use plugins to insert more keys into your schema.

## Key conflict

When adding keys, specially when developing plugins, you may enter in conflict while adding them. To solve the issue of having to check too much, Schema merges the pre-existent and the new pieces in one, given the following conditions:

- When adding a SchemaFolder over another SchemaFolder, the callback will be called with the pre-existent folder (pieces will be added to the old folder, "merging" them). If the previous was not a SchemaFolder, this operation will throw.
- When adding a SchemaPiece over another SchemaPiece, {@link SchemaPiece#edit} will be called instead, merging all the options with the previous. If the previous was not a SchemaPiece, or any of the options were wrong, this operation will throw.

## Further Reading:

- {@tutorial UnderstandingSchemaPieces}
- {@tutorial SettingsGatewayKeyTypes}
- {@tutorial SettingsGatewaySettingsUpdate}

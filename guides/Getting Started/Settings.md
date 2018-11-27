This guide will explain anything and everything that there is to know about settings in Klasa, and will try to explain it in the most simplest terms as possible. You can navigate the guide using the table of contents below.

# Table of Contents

- [Schema]({@scrollto Schema})
    - [Folders]({@scrollto Folders})
        - [Adding a Folder]({@scrollto Adding a Folder})
        - [Adding a Piece]({@scrollto Adding a Piece})
        - [Naming Conflicts]({@scrollto Naming Conflict})
    - [Pieces]({@scrollto Pieces})
        - [Types]({@scrollto Types})
        - [Custom Types]({@scrollto Custom Types})		 
    - [Options]({@scrollto Options})
        - [Default]({@scrollto Default option})
        - [Filter]({@scrollto Filter option})
        - [Resolve]({@scrollto Resolve option})
- [Settings]({@scrollto Settings})
    - [Updating Settings]({@scrollto Updating Settings})
    - [Resetting Settings]({@scrollto Resetting Settings})
- [Gateway]({@scrollto Gateway})
    - [Custom Gateway]({@scrollto Custom Gateway})
    - [Gateway Plugins]({@scrollto Gateway Plugins})

## Schema

Schemas are the blueprints of how you want your settings setup. They are yours and Klasa's guide for ensuring that any operation done on settings is done correctly.

## Folders

### Adding a Folder

When working with schemas, it's very easy for yours to become unorganized or hard to manage. This is where folders come in. You can use Folders to group similar keys together to make it much easier to manage and read. Below is an example of how to add a folder to a schema.

```javascript
const { Client } = require('klasa');

Client.defaultGuildSchema
	// Let's add a moderation folder
	.add('moderation', modFolder => {
		// Moderation Role
		modFolder.add('role', 'role');
		// Moderation channel
		modFolder.add('channel', 'textchannel');
	});
```

To use both of these newly created keys, you would update `moderation.role` and `moderation.channel` with a role and channel, respectively.

You can also add a folder inside of another folder, allowing you to finely tune your Schema exactly to your likings.

### Adding a Piece

The function for adding a piece takes three arguments.

- A name for the key
- A type for the key
- Options object for the key

Below is an example of adding a piece. You can find further explanation of Pieces in the next section.

```javascript
const { Client } = require('klasa');

Client.defaultGuildSchema
	// Most of the options are defaulted to what they are here,
	// but for example purposes we'll leave them.
	.add('musicChannel', 'textchannel',
		{ array: false, default: null });
```

<!-- Added extra line on options object to remove scrollbar -->

Alternatively, if you wanted multiple channels for music you could set the key as an array instead.

```javascript
const { Client } = require('klasa');

Client.defaultGuildSchema
	.add('musicChannel', 'textchannel', { array: true, default: [] });
```

Now this key would be an array, and you could add multiple channels to it.

### Naming Conflicts

Whenever adding keys that have the same name, the Schema will automatically edit the requested key with the new properties you want. This allows you to edit core keys to your liking. Possible issues can crop when using this though, such as editing a prefix key to be a channel instead of the string it should be. Caution should be used when editing core keys.

The add function will automatically edit for you when the key is found. You can also get the key directly from the SchemaFolder it is on  and call .edit() on it manually.

## Pieces

Pieces are the individual keys that you  will be setting when using Settings. Each key can have multiple different options, and core keys can be overwritten to your liking.

### Types

By default, there are several built-in types that the developer can use, and with the possibility to add custom types via {@link Serializer}s as explained below. The built-in types are:

| Name                | Type                                              | Description                                                                              |
| ------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **any**             | Anything, no type restriction                     | Resolves anything, even objects. The usage of this type will make a key unconfigurable   |
| **boolean**         | A {@link Boolean} resolvable                      | Resolves a boolean primitive value                                                       |
| **categorychannel** | A {@link external:CategoryChannel} instance or id | Resolves a CategoryChannel                                                               |
| **channel**         | A {@link external:Channel} instance or id         | Resolves a channel. Be careful with using this, as it accepts any type of channel        |
| **command**         | A {@link Command} instance or name                | Resolves a Command                                                                       |
| **float**           | A floating point number                           | Resolves a [float](https://en.wikipedia.org/wiki/Double-precision_floating-point_format) |
| **guild**           | A {@link KlasaGuild} instance or id               | Resolves a KlasaGuild (which extends Guild)                                              |
| **integer**         | An integer number                                 | Resolves an [integer](https://en.wikipedia.org/wiki/Integer) number                      |
| **language**        | A {@link Language} instance or name               | Resolves a language                                                                      |
| **number**          | A number                                          | Resolves a [float](https://en.wikipedia.org/wiki/Double-precision_floating-point_format) |
| **role**            | A {@link external:Role} instance or id            | Resolves a Role                                                                          |
| **string**          | A {@link external:StringResolvable}               | Resolves a string                                                                        |
| **textchannel**     | A {@link external:TextChannel} instance or id     | Resolves a TextChannel                                                                   |
| **url**             | A URL resolvable                                  | Resolves a URL with Node.js' URL parser                                                  |
| **user**            | A {@link KlasaUser} instance or id                | Resolves a KlasaUser (which extends User)                                                |
| **voicechannel**    | A {@link external:VoiceChannel} instance or id    | Resolves a VoiceChannel                                                                  |

### Custom Types

To add new types, you make a class, extending {@link Serializer}. The following serializer is a template for this:

```javascript
const { Serializer } = require('klasa');

// Extend Serializer to create your own. These are loaded from  the Serializers folder.
module.exports = class Date extends Serializer {

	constructor(...args) {
		// If you want aliases for this, you can set them here.
		super(...args, { aliases: [] });
	}

	// This function is used to tell Settings what this data is actually representing
	deserialize(data) {
		// Assuming data is stored in milliseconds
		// We can turn this date, given from your database, into a readable date.
		// new Date Object with our specified data
		return new Date(data);
	}

	// This function is used to tell Settings what this data should be stored as
	serialize(value) {
		// Convert Date Object back into milliseconds so it can be stored by the database.
		// Value here is our Date Object from deserialized.
		return value.getTime();
	}

	// This function is used to tell Settings what we should display the deserialized data as.
	stringify(value) {
		// Value here is our Date Object from deserialized
		return value.toDateString();
	}

};
```

**All serializers must resolve values into primitives or storable plain objects, otherwise, the provider may have issues with storing the value.**

## Options

Below is a list of all schema piece options that can be configured when adding or modifying pieces. You can find the full documentation at {@link SchemaPieceOptions}.

{@typedef SchemaPieceOptions}

### Default option

*The default option is optional, but, what is its default value?*

The default option is one of the last options to default, **array** defaults to `false`, **max** and **min** defaults to `null`, **configurable** defaults to either `true` or `false`, the latter if **type** is `any`; and **type** is always obligatory.

- If **array** is true, default will be an empty array: `[]`.
- If **type** is boolean, default will be `false`.
- In any other case, it will be `null`.

### Filter option

The filter option serves to blacklist certain values. It's output is not used, but any thrown error will be handled by SettingsGateway's internals and displayed to the caller (for example in the conf command, it would display the message to the user). It also must be synchronous.

Internally, we use this option to avoid users from disabling guarded commands (check {@link Command#guard}):

```javascript
const filter = (client, command, piece, guild) => {
	if (client.commands.get(command).guarded) {
		throw (guild ? guild.language : client.languages.default).get('COMMAND_CONF_GUARDED', command);
	}
};
```

In this case, `client` is the {@link KlasaClient} instance, `command` the resolved command (the output from the command's SchemaType), `piece` is a {@link SchemaPiece} instance, and guild is a {@link Guild} instance, which may be null.

### Resolve option

The resolve option allows you to change the behavior of keys that should be resolved when using the resolve method. It is true by default, and will automatically resolve every single object in an array where possible. If a key cannot be resolved, that key will be set to null to ensure that falsy checks still work as intended. Below is an example of how you would use the resolve option.

```javascript
const { Client } = require('klasa');

// Resolve is default by true, here for example purposes
Client.defaultGuildSchema.add('modRole', 'role', { resolve: true });

// Assuming you're running this command in a guild, can also be awaited and destructured
message.guild.settings.resolve('modRole').then(resolved => console.log(resolved));
```

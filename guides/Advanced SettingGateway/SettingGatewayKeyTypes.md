# SettingGateway's Types

By default, there are several built-in types that the developer can use, and with the possibility to add custom types via {@link Extendable}s as explained below. The built-in types are:

| Name                | Type                                              | Description                                                                              |
| ------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **any**             | Anything, no type restriction                     | Resolves anything, even objects. The usage of this type will make a key unconfigurable   |
| **boolean**         | A {@link Boolean} resolvable                      | Resolves a boolean primitive value                                                       |
| **categorychannel** | A {@link external:CategoryChannel} instance or id | Resolves a CategoryChannel                                                               |
| **channel**         | A {@link external:Channel} instance or id         | Resolves a channel. Be careful with using this, as it accepts any type of channel        |
| **command**         | A {@link Command} instance or name                | Resolves a Command                                                                       |
| **emoji**           | An {@link external:Emoji} instance or name        | Resolves a custom emoji                                                                  |
| **float**           | A floating point number                           | Resolves a [float](https://en.wikipedia.org/wiki/Double-precision_floating-point_format) |
| **guild**           | A {@link KlasaGuild} instance or id               | Resolves a KlasaGuild (which extends Guild)                                              |
| **integer**         | An integer number                                 | Resolves an [integer](https://en.wikipedia.org/wiki/Integer) number                      |
| **language**        | A {@link Language} instance or name               | Resolves a language                                                                      |
| **member**          | A {@link external:GuildMember} instance or id     | Resolves a GuildMember                                                                   |
| **msg**             | A {@link KlasaMessage} instance or id             | Resolves a KlasaMessage (which extends Message)                                          |
| **role**            | A {@link external:Role} instance or id            | Resolves a Role                                                                          |
| **string**          | A {@link external:StringResolvable}               | Resolves a string                                                                        |
| **textchannel**     | A {@link external:TextChannel} instance or id     | Resolves a TextChannel                                                                   |
| **url**             | An URL resolvable                                 | Resolves a URL with Node.js' URL parser                                                  |
| **user**            | A {@link KlasaUser} instance or id                | Resolves a KlasaUser (which extends User)                                                |
| **voicechannel**    | A {@link external:VoiceChannel} instance or id    | Resolves a VoiceChannel                                                                  |

## Adding new types

To add new types, you use an {@link Extendable} extending {@link SettingResolver}. If you don't know how to create an extendable, check the following tutorial: {@tutorial CreatingExtendables}. The following extendable is a template for this:

```javascript
const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['SettingResolver'], {
			name: 'typeName',
			klasa: true
		});
	}

	/**
	 * Resolves my custom type!
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @param {Object} [minMax={}] The minimum and maximum
	 * @param {?number} minMax.min The minimum value
	 * @param {?number} minMax.max The maximum value
	 * @returns {Promise<*>}
	 */
	async extend(data, guild, name, { min, max } = {}) {
		// The content
		return data;
	}

};
```

> **Note**: If a type does not load, you can add the type name to {@link GatewayDriver#types}, but it must be before the {@link SchemaPiece}s init as they check if the type is included in that Set.

## Further Reading:

- {@tutorial UnderstandingSchemaPieces}
- {@tutorial UnderstandingSchemaFolders}
- {@tutorial SettingGatewayConfigurationUpdate}

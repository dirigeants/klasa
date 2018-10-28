# SettingsGateway's Types

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

## Adding new types

To add new types, you make a class, extending {@link Serializer}. The following extendable is a template for this:

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

## Further Reading:

- {@tutorial UnderstandingSchemaPieces}
- {@tutorial UnderstandingSchemaFolders}
- {@tutorial SettingsGatewaySettingsUpdate}

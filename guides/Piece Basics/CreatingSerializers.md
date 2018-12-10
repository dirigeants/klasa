Serializers are pieces used for SettingsGateway's core to serialize and deserialize data. New serializers are created in the `./serializers/` folder.

```javascript
const { Serializer } = require('klasa');

module.exports = class extends Serializer {

	constructor(...args) {
		super(...args, { aliases: [] });
	}

	async deserialize(data, piece, language, guild) {
		// Code to resolve primitives into resolved data for the cache
	}

	serialize(value) {
		// Code to convert resolved data into primitives for database storage
	}

	stringify(value) {
		// Code to convert the value into a meaningful string.
	}

};
```

The deserialize method in {@link Serializer} takes 4 parameters:

| Name         | Type                | Description                                           |
| ------------ | ------------------- | ----------------------------------------------------- |
| **data**     | any                 | The data to deserialize                               |
| **piece**    | {@link SchemaPiece} | The piece from the schema that called this serializer |
| **language** | {@link Language}    | The language instance for usage in translated errors  |
| **guild**    | {@link Guild}       | The guild instance passed in {@link Settings#update}  |

The serialize method takes 1 parameter:

| Name      | Type      | Description                                 |
| --------- | --------- | ------------------------------------------- |
| **value** | Primitive | A primitive value (string, number, boolean) |

The stringify method takes 1 parameter:

| Name      | Type      | Description                                 |
| --------- | --------- | ------------------------------------------- |
| **value** | Primitive | A primitive value (string, number, boolean) |

## Examples

You can take a look at the [included core Serializers](https://github.com/dirigeants/klasa/tree/{@branch}/src/serializers), or see some [prebuilt Serializers on klasa-pieces](https://github.com/dirigeants/klasa-pieces/tree/master/serializers).

# Further reading

- {@tutorial CreatingCommands}
- {@tutorial CreatingEvents}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingProviders}
- {@tutorial CreatingSQLProviders}
- {@tutorial CreatingTasks}

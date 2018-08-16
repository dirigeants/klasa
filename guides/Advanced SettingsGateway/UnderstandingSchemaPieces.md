# Understanding Schema's Keys

As mentioned in the previous tutorial, {@tutorial UnderstandingSchema}, SettingsGateway's schema is divided in two parts: **folders** and **pieces**. Pieces are contained in folders, but they cannot have keys nor folders. Instead, this holds the key's metadata such as its type, if it's configurable by the configuration command... you can check more information in the documentation: {@link SchemaPiece}.

## Key options

There are multiple options that configure the piece, they are:

| Option       | Description                                                                |
| ------------ | -------------------------------------------------------------------------- |
| array        | Whether the values should be stored in an array                            |
| configurable | Whether this key can be configured with the built-in configuration command |
| default      | The default value for this key                                             |
| max          | The maximum value for this key, only applies for string and numbers        |
| min          | The minimum value for this key, only applies for string and numbers        |
| filter       | The filter function for this key                                           |

> Check {@tutorial SettingsGatewayKeyTypes} for the supported types and how to extend them.

## Default option

*The default option is optional, but, what is its default value?*

The default option is one of the last options to default, **array** defaults to `false`, **max** and **min** defaults to `null`, **configurable** defaults to either `true` or `false`, the latter if **type** is `any`; and **type** is always obligatory.

- If **array** is true, default will be an empty array: `[]`.
- If **type** is boolean, default will be `false`.
- In any other case, it will be `null`.

## Filter option

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

## Further Reading:

- {@tutorial UnderstandingSchemaFolders}
- {@tutorial SettingsGatewayKeyTypes}
- {@tutorial SettingsGatewaySettingsUpdate}

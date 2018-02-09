# Understanding Schema's Keys

As mentioned in the previous tutorial, {@tutorial UnderstandingSchema}, SettingGateway's schema is divided in two parts: **folders** and **pieces**. Pieces are contained in folders, but they cannot have keys nor folders. Instead, this holds the key's metadata such as its type, if it's configurable by the configuration command... you can check more information in the documentation: {@link SchemaPiece}.

## Key options

There are multiple options that configure the piece, they are:

| Option       | Description                                                                |
| ------------ | -------------------------------------------------------------------------- |
| array        | Whether the values should be stored in an array                            |
| configurable | Whether this key can be configured with the built-in configuration command |
| default      | The default value for this key                                             |
| max          | The maximum value for this key, only applies for string and numbers        |
| min          | The minimum value for this key, only applies for string and numbers        |
| sql          | The SQL datatype for this key                                              |
| type         | The type for this key                                                      |

> Check {@tutorial SettingGatewayKeyTypes} for the supported types and how to extend them.

## Default option

*The default option is optional, but, what is its default value?*

The default option is one of the last options to default, **array** defaults to `false`, **max** and **min** defaults to `null`, **configurable** defaults to either `true` or `false`, the latter if **type** is `any`; and **type** is always obligatory.

- If **array** is true, default will be an empty array: `[]`.
- If **type** is boolean, default will be `false`.
- In any other case, it will be `null`.

After default, the sql type is calculated with a valid datatype. Keep in mind that it uses standard SQL types, but may work better for PostgreSQL. In any case, if you want to use a type that is very specific to your database, consider including this option.

## Editing key options

Once created, it's possible since 0.5.0 to edit a {@link SchemaPiece}'s options, it's as simple as running {@link SchemaPiece#edit} which takes the same options for adding a key with {@link SchemaFolder#addKey} but with one exception: `array` and `type` can't change. The syntax is the following:

```javascript
this.client.gateways.gatewayName.schema.keyName.edit(options);
```

For example, let's say we dislike the current prefix and we want to change it to `s!` for the next entries, then you can simply do:

```javascript
this.client.gateways.guilds.schema.prefix.edit({ default: 's!' });
```

Where you're doing the following steps:

1. Access to {@link KlasaClient#gateways}, type of {@link GatewayDriver}, which holds all gateways.
1. Access to the guilds' {@link Gateway}, which manages the per-guild configuration.
1. Access to the guilds' schema via {@link Gateway#schema}, which manages the gateway's schema.
1. Access to the key we want to edit, in this case, the **prefix** key, which is type of {@link SchemaPiece}.
1. Call {@link SchemaPiece#edit} with the option `default` and the new value: `'s!'`.

### The Type Issue

The main reason for why we don't support editing the options `array` and `type` is:

> Changing the type is very complex. For example, in SQL, if we changed the type from `TEXT`, `VARCHAR`, or any other string type to a numeric one such as `INTEGER`, we could risk the database potentially throwing an error or setting them to null, which would result in data loss. We would then need to download all of the data first, and insert them back with the new type. The same thing happens in NoSQL.

Changing the value of `array` from a non-string datatype can result on the issue above, and it's a very slow process. Therefore, it's much better to just remove the key and add it back.

## Further Reading:

- {@tutorial UnderstandingSchemaFolders}
- {@tutorial SettingGatewayKeyTypes}
- {@tutorial SettingGatewayConfigurationUpdate}

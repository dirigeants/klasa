# Updating your configuration

Once we have our schema completed with all the keys, folders and types needed, we may want to update our configuration via SettingsGateway, all of this is done via {@link Settings#update}. However, how can I update it? Use any of the following code snippets:

```javascript
// Updating the value of a key
// This key is contained in the roles folder, and the second value is a role id, we also need
// to pass a GuildResolvable.
message.guild.settings.update('roles.administrator', '339943234405007361', message.guild);

// For retrocompatibility, the object overload is still available, however, this is much slower.
// If you store objects literals in keys that do not take an array, this may break, prefer the
// other overload or use nested SchemaPieces for full consistency.
message.guild.settings.update({ roles: { administrator: '339943234405007361' } }, message.guild);

// Updating an array
// userBlacklist, as mentioned in another tutorial, it's a piece with an array of users. Using
// the following code will add or remove it, depending on the existence of the key in the configuration.
message.guild.settings.update('userBlacklist', '272689325521502208');

// Ensuring the function call adds (error if it exists)
message.guild.settings.update('userBlacklist', '272689325521502208', { action: 'add' });

// Ensuring the function call removes (error if it doesn't exist)
message.guild.settings.update('userBlacklist', '272689325521502208', { action: 'remove' });

// Updating multiple keys
message.guild.settings.update([['prefix', 'k!'], ['language', 'es-ES']]);
```

> **Note**: Some types require a Guild instance to work, for example, *channels*, *roles* and *members*.

> Additionally, if no 'action' option is passed to {@link SettingsUpdateOptions}, it'll assume the `auto` mode, which will add or remove depending on the existence of the key.

## Further Reading:

- {@tutorial UnderstandingSchemaPieces}
- {@tutorial UnderstandingSchemaFolders}
- {@tutorial SettingsGatewayKeyTypes}

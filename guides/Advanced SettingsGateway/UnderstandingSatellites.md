# Understanding Gateway Satellites

SettingsGateway serves a [reverse-proxy](https://en.wikipedia.org/wiki/Reverse_proxy)-like caching, which accesses discord.js' [DataStore][DataStore]s such as [`Client#users`](https://discord.js.org/#/docs/main/master/class/Client?scrollTo=users) or [`Client#guilds`](https://discord.js.org/#/docs/main/master/class/Client?scrollTo=guilds). A Gateway's cache can be either a {@link SettingsStore}, of which the get method will attempt to do `DataStore#get(id).settings`, or a {@link SatelliteStore}, which get method will attempt to access to the property `satellite` of the entry instead.

This works because in two of the built-in gateways, `this.client.users.get(id).settings` was identical to `this.client.gateways.users.cache.get(id)`, and so is for guilds. For this, a {@link SettingsStore} is used to remove the double caching layer, as we can access to any of users' or guilds' settings via their [DataStore][DataStore]s.

What are {@link SatelliteStore}s for? A satellite "sits" in an entry of the [DataStore][DataStore], and once {@link Gateway#cache} is used to get an entry, it will access the desired satellite and this will try to proxy the next [DataStore][DataStore] until it reaches the {@link Settings} instance.

One of the most common use cases of {@link SatelliteStore gateway satellites} are to make per-member settings.

Unlike users, members are not stored on the [client][Client] instance, they are stored on a [guilds][Guild] instance, the satellite allows the re-route from [`Client#guilds`](https://discord.js.org/#/docs/main/master/class/Client?scrollTo=guilds) to [`Guild#members`](https://discord.js.org/#/docs/main/master/class/Guild?scrollTo=members). Check the example in {@tutorial CreatingACustomMemberGateway}.

In the example, you can use `Guild#satellite` to access to all Settings instances directly, for instance, `message.guild.satellite.get(message.author.id)` will access the `message.guild.members.get(message.author.id).settings`, being exactly the same as `message.member.settings`. As well as doing `this.client.gateways.members.cache.get([message.guild.id, message.author.id])` will be equivalent to doing `this.client.guilds.get(message.guild.id).members.get(message.author.id).settings`.

> **Note**: Alternatively, you can access to the member settings by joining the array with a dot (`'.'`): ``this.client.gateways.members.cache.get(`${message.guild.id}.${message.author.id}`)``. In the database and in {@link Settings#id `Settings#id`} will be the result of joining the "path" by a dot.

[Client]: https://discord.js.org/#/docs/main/master/class/Client
[Guild]: https://discord.js.org/#/docs/main/master/class/Guild
[DataStore]: https://discord.js.org/#/docs/main/master/class/DataStore

## Further Reading:

- {@tutorial UnderstandingSchemaPieces}
- {@tutorial UnderstandingSchemaFolders}
- {@tutorial SettingsGatewayKeyTypes}
- {@tutorial SettingsGatewaySettingsUpdate}

# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Dev] - 0.5.0
### Added
- [[#43](https://github.com/dirigeants/klasa/pull/43)] A changelog...
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added `KlasaMessage`, `KlasaGuild`, and `KlasaUser`, extending `DiscordJS.Message`, `DiscordJS.Guild` and `DiscordJS.User`, respectively. Many of the getters have turned properties for performance.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added `User#configs`, which has an empty schema by default. The developer can take advantage of this, expand the schema, and feature a full featured user configs.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added `configUpdateEntry`, `configDeleteEntry` and `configCreateEntry` events.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] `Configuration` class, which all the new update methods from SettingGateway, featuring full OOP and much easier to use and remember.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] `Schema` and `SchemaPiece` classes, with helper methods that allow the gateway parse and retrieve data much faster, as well as following the OOP paradigm when it comes to modifying the schema and much friendlier to use.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] More options to `GatewayDriver#add`, allowing you to set different providers in different gateway instances.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added **Folder** type (nested objects, yay!).
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added `SchemaPiece.configurable` to avoid certain keys to be processed by the default conf command.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added **any** type to SettingsResolver. Assigning this type to a SchemaPiece will make it set the property configureable to false, it accepts anything you pass to it, even objects. So you must use dedicated commands to configure these keys instead. (For example, you can store an array of objects with a certain number of properties, something not possible in the previous versions as the conf command cannot parse objects correctly).
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[PERF]** Much better, accurate and faster SchemaPiece validation and parsing.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[PERF]** Added `Schema.toJSON();`, which converts the classes into a plain JSON object. This method is 27^level times faster than iterating over it with `Object.keys`.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added a **Collection** provider.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added `Provider.cache`.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added GatewaySQL (extends Gateway, overriding the methods for better SQL parsing).
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added `Gateway#insertEntry`, which inserts a new `Configuration` entry to the cache and sync if possible.

### Changed
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[BREAKING]** Renamed `Guild#settings` and `Message#guildSettings` to `Guild#configs` and `Message#guildConfigs`, respectively.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[BREAKING]** Renamed `client.settings` to `client.gateways`.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Renamed the inhibitor `requiredSettings` to `requiredConfigs`.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Renamed the key `Command#requiredSettings` to `Command#requiredConfigs`.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added a new option for the `guildDelete` event: `KlasaClientOptions.preserveConfigs`, which, if true, it will not delete the guild configs when the bot leaves a guild.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Renamed SettingGateway to Gateway.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Renamed SettingsCache to GatewayDriver.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[BREAKING]** `GatewayDriver#validate` does not longer have an instance of `SettingResolver` as first parameter, but a bound `this` referring to the GatewayDriver instance. (With access to KlasaClient and SettingResolver).
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[BREAKING]** `Gateway#get` -> `Gateway#getEntry`.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[BREAKING]** `Gateway#update` has been completely removed. Use `Configuration#updateOne`, `Configuration#updateArray` or `Configuration#updateMany` instead.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[FEATURE]** `Configuration#updateOne`, `Configuration#updateMany`, `Configuration#reset` and `Configuration#updateArray` can now filter unconfigureable keys if the parameter `avoidUnconfigurable` is passed and set to `true`.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] `Gateway#schema` is not longer a plain object, but a `Schema` instance.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[PERF]** Removed tuplifier in favor of cached tuples.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[PERF]** Improved updateArray remove method. (~1.85 times faster).
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[PERF]** The cache now updates from the cache instead of re-syncing with the DB. (When using JSON and Collection, Samsung SSD at 600 MB/s read, performance is improved by 97k ops/sec to 53M ops/sec, 454 times faster).
- [[#43](https://github.com/dirigeants/klasa/pull/43)] `Configuration#updateOne` now accepts array type. It'll call the private method that does the parsing for updateArray.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[PERF]** SQL parsing is now shared with NoSQL, however, SettingGateway's parsing procedures do not return JSON objects, instead, it returns data compatible for both environments.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[PERF]** When using `SettingResolver`, SettingGateway will not longer do `type.toLowerCase()`, but they're lowercase'd at startup.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[BREAKING]** Gateway do not longer extend SchemaManager and CacheManager, but it's a class by itself.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Made the types that SettingGateway accepts for the key types dynamic (based on SettingResolver's prototype) and public throught `client.gateways.types;`.

### Removed
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Removed a bunch of extendables.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[PERF]** Removed `CommandMessage` proxy in favor of the brand new `KlasaMessage`. As in *Node.js 9.2.0*, Proxy creation performs 37M ops/sec, and property access 1.7M ops/sec (all pieces after Inhibitors use that proxy). As it's now removed, property access should perform around 520M ops/sec (~305 times faster).
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Removed the `messageDelete` event.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Removed the `messageDeleteBulk` event.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Removed the `guildCreate` event.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Removed the `SQL` class. Replaced by GatewaySQL and Schema/Piece.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Removed the `CacheManager` class. Replaced by CacheProviders.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Removed `Gateway#add`. Replaced to `Schema#addKey`.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Removed `Gateway#remove`. Replaced to `Schema#removeKey`.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Removed `SQLProvider#serialize`, `SQLProvider#sanitize`, `SQLProvider#CONSTANTS`.

### Fixed
- [[#43](https://github.com/dirigeants/klasa/pull/43)] A lot of things in Typings and marked a lot of private methods properly.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Typos in languages.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Fixed `GatewayDriver#validate` not working properly.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] The eval command being unable to catch certain errors.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Fixed the JSON provider throwing errors.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Fixed multiple minor issues.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Store loader not showing error stack.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] JSON provider loading files that are not JSON.

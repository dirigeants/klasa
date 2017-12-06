# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

<!--
NOTE: For the contributors, you add new entries to this document following this format:
- [[#PRNUMBER](https://github.com/dirigeants/klasa/pull/PRNUMBER)] The change that has been made. (Author's Github name)
-->

## [Dev] - 0.5.0

### Added

- [[#109](https://github.com/dirigeants/klasa/pull/109)] Added the keys `COMMAND_EVAL_DESCRIPTION`, `COMMAND_UNLOAD_DESCRIPTION`, `COMMAND_TRANSFER_DESCRIPTION`, `COMMAND_RELOAD_DESCRIPTION`, `COMMAND_REBOOT_DESCRIPTION`, `COMMAND_PING_DESCRIPTION`, `COMMAND_INVITE_DESCRIPTION`, `COMMAND_INFO_DESCRIPTION`, `COMMAND_ENABLE_DESCRIPTION`, `COMMAND_DISABLE_DESCRIPTION`, `COMMAND_CONF_SERVER_DESCRIPTION`, `COMMAND_CONF_SERVER`, `COMMAND_CONF_USER_DESCRIPTION`, `COMMAND_CONF_USER`, `COMMAND_STATS` and `COMMAND_STATS_DESCRIPTION` to the en-US language. (Pandraghon)
- [[#104](https://github.com/dirigeants/klasa/pull/104)] Added `regexPrefix` as an option for `KlasaClientOptions`. (MrJacz)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) A changelog... (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Added `KlasaMessage`, `KlasaGuild`, and `KlasaUser`, extending `DiscordJS.Message`, `DiscordJS.Guild` and `DiscordJS.User`, respectively. Many of the getters have turned properties for performance. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Added `User#configs`, which has an empty schema by default. The developer can take advantage of this, expand the schema, and feature a full featured user configs. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Added `configUpdateEntry`, `configDeleteEntry` and `configCreateEntry` events. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) `Configuration` class, which all the new update methods from SettingGateway, featuring full OOP and much easier to use and remember. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) `Schema` and `SchemaPiece` classes, with helper methods that allow the gateway parse and retrieve data much faster, as well as following the OOP paradigm when it comes to modifying the schema and much friendlier to use. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) More options to `GatewayDriver#add`, allowing you to set different providers in different gateway instances. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Added **Folder** type (nested objects, yay!). (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Added `SchemaPiece.configurable` to avoid certain keys to be processed by the default conf command. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Added **any** type to SettingsResolver. Assigning this type to a SchemaPiece will make it set the property configureable to false, it accepts anything you pass to it, even objects. So you must use dedicated commands to configure these keys instead. (For example, you can store an array of objects with a certain number of properties, something not possible in the previous versions as the conf command cannot parse objects correctly). (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) **[PERF]** Much better, accurate and faster SchemaPiece validation and parsing. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) **[PERF]** Added `Schema.toJSON();`, which converts the classes into a plain JSON object. This method is 27^level times faster than iterating over it with `Object.keys`. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Added a **Collection** provider. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Added `Provider.cache`. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Added GatewaySQL (extends Gateway, overriding the methods for better SQL parsing). (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Added `Gateway#insertEntry`, which inserts a new `Configuration` entry to the cache and sync if possible. (kyranet)

### Changed

- [[`550ac275c8`](https://github.com/dirigeants/klasa/commit/550ac275c849c285692ffff5c4e99cb53753a85b)] ([#109](https://github.com/dirigeants/klasa/pull/109)) Translated the description for all commands. (Pandraghon)
- [[`550ac275c8`](https://github.com/dirigeants/klasa/commit/550ac275c849c285692ffff5c4e99cb53753a85b)] ([#109](https://github.com/dirigeants/klasa/pull/109)) Nested folders in the configuration will show with a format of `Folder1/Folder2/Folder3/...` instead of `Folder1.folder2.folder3...`. (bdistin and Pandraghon)
- [[`63af836277`](https://github.com/dirigeants/klasa/commit/63af836277541695d1d3489397f901b51e7dc23a)] ([#80](https://github.com/dirigeants/klasa/pull/80)) If the command's name contains uppercase characters, they will get lowercased. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) **[BREAKING]** Renamed `Guild#settings` and `Message#guildSettings` to `Guild#configs` and `Message#guildConfigs`, respectively. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) **[BREAKING]** Renamed `client.settings` to `client.gateways`. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Renamed the inhibitor `requiredSettings` to `requiredConfigs`. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Renamed the key `Command#requiredSettings` to `Command#requiredConfigs`. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Added a new option for the `guildDelete` event: `KlasaClientOptions.preserveConfigs`, which, if true, it will not delete the guild configs when the bot leaves a guild. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Renamed SettingGateway to Gateway. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Renamed SettingsCache to GatewayDriver. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) **[BREAKING]** `GatewayDriver#validate` does not longer have an instance of `SettingResolver` as first parameter, but a bound `this` referring to the GatewayDriver instance. (With access to KlasaClient and SettingResolver). (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) **[BREAKING]** `Gateway#get` -> `Gateway#getEntry`. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) **[BREAKING]** `Gateway#update` has been completely removed. Use `Configuration#updateOne`, `Configuration#updateArray` or `Configuration#updateMany` instead. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) **[FEATURE]** `Configuration#updateOne`, `Configuration#updateMany`, `Configuration#reset` and `Configuration#updateArray` can now filter unconfigureable keys if the parameter `avoidUnconfigurable` is passed and set to `true`. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) `Gateway#schema` is not longer a plain object, but a `Schema` instance. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) **[PERF]** Removed tuplifier in favor of cached tuples. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) **[PERF]** Improved updateArray remove method. (~1.85 times faster). (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) **[PERF]** The cache now updates from the cache instead of re-syncing with the DB. (When using JSON and Collection, Samsung SSD at 600 MB/s read, performance is improved by 97k ops/sec to 53M ops/sec, 454 times faster). (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) `Configuration#updateOne` now accepts array type. It'll call the private method that does the parsing for updateArray. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) **[PERF]** SQL parsing is now shared with NoSQL, however, SettingGateway's parsing procedures do not return JSON objects, instead, it returns data compatible for both environments. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) **[PERF]** When using `SettingResolver`, SettingGateway will not longer do `type.toLowerCase()`, but they're lowercase'd at startup. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) **[BREAKING]** Gateway do not longer extend SchemaManager and CacheManager, but it's a class by itself. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Made the types that SettingGateway accepts for the key types dynamic (based on SettingResolver's prototype) and public throught `client.gateways.types;`. (kyranet)

### Removed

- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Removed a bunch of extendables. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) **[PERF]** Removed `CommandMessage` proxy in favor of the brand new `KlasaMessage`. As in *Node.js 9.2.0*, Proxy creation performs 37M ops/sec, and property access 1.7M ops/sec (all pieces after Inhibitors use that proxy). As it's now removed, property access should perform around 520M ops/sec (~305 times faster). (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Removed the `messageDelete` event. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Removed the `messageDeleteBulk` event. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Removed the `guildCreate` event. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Removed the `SQL` class. Replaced by GatewaySQL and Schema/Piece. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Removed the `CacheManager` class. Replaced by CacheProviders. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Removed `Gateway#add`. Replaced to `Schema#addKey`. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Removed `Gateway#remove`. Replaced to `Schema#removeKey`. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Removed `SQLProvider#serialize`, `SQLProvider#sanitize`, `SQLProvider#CONSTANTS`. (kyranet)

### Fixed

- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) A lot of things in Typings and marked a lot of private methods properly. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Typos in languages. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Fixed `GatewayDriver#validate` not working properly. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) The eval command being unable to catch certain errors. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Fixed the JSON provider throwing errors. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Fixed multiple minor issues. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) Store loader not showing error stack. (kyranet)
- [[`2915d31b92`](https://github.com/dirigeants/klasa/commit/2915d31b92c8ea4b9202edfdb146a2d8b36ad8d6)] ([#43](https://github.com/dirigeants/klasa/pull/43)) JSON provider loading files that are not JSON. (kyranet)

## 0.4.0

### Added

- [[`f7d0ebee52`](https://github.com/dirigeants/klasa/commit/f7d0ebee52015ef80a7e4c2e95552ad7c55fac62)] Added a `monitorError` event. (bdistin)
- [[`b2bb9b1d75`](https://github.com/dirigeants/klasa/commit/b2bb9b1d756dabb786547d845b49872423f91ad4)] ([#98](https://github.com/dirigeants/klasa/pull/98)) Added the events `commandUnknown`, `pieceLoaded`, `pieceUnloaded`, `pieceReloaded`, `pieceEnabled`, `pieceDisabled`. (bdistin)
- [[`d5cf8c7ac5`](https://github.com/dirigeants/klasa/commit/d5cf8c7ac53c6621782a75104524e804651c65c7)] ([#95](https://github.com/dirigeants/klasa/pull/95)) Added `promptTime` as an option for `KlasaClientOptions`. (kyranet)
- [[`12616ee190`](https://github.com/dirigeants/klasa/commit/12616ee190fb74284ae28840603153e708549c7b)] ([#86](https://github.com/dirigeants/klasa/pull/86)) **[BREAKING]** Added `ignoreOthers` as an option for monitors. Defaults to true. (bdistin)
- [[`f3e6ba68d7`](https://github.com/dirigeants/klasa/commit/f3e6ba68d7a93349ec4d8e77944fef11c4bc178a)],
[[`b4052c9db8`](https://github.com/dirigeants/klasa/commit/b4052c9db84302943e0fb13dd260bc51e4aec89c)],
[[`67dd509dff`](https://github.com/dirigeants/klasa/commit/67dd509dff5c03d3753a8d48c904277ac24a011a)] and
[[`a7a3b82ec7`](https://github.com/dirigeants/klasa/commit/a7a3b82ec7ab6febdecc3d9d86b9d1e2550c1c22)] Added the `@since` to all the JSDocs. (bdistin)
- [[`95e4d4fdd4`](https://github.com/dirigeants/klasa/commit/95e4d4fdd42548c78336b8ba9b733c05f0901466)] ([#57](https://github.com/dirigeants/klasa/pull/57)) Added a configureable menu time for RichDisplay. (pedall)
- [[`b93cfb57fb`](https://github.com/dirigeants/klasa/commit/b93cfb57fb7f3e4eaaa2bdde88b892cd76e36e35)] ([#65](https://github.com/dirigeants/klasa/pull/65)) Added the Stopwatch class. (bdistin)
- [[`adb5afa450`](https://github.com/dirigeants/klasa/commit/adb5afa45027771b07730c07e6d442f4a54c1ae0)] ([#52](https://github.com/dirigeants/klasa/pull/52)) Added the RichDisplay tutorial. (HellPie)
- [[`0c066e0694`](https://github.com/dirigeants/klasa/commit/0c066e06943aaf564fdfe099b1c56a6d1f38955b)] and
[[`4c095dc7fd`](https://github.com/dirigeants/klasa/commit/4c095dc7fdab7d470c8c6d0c31266d57c2195857)] Added `toString()` method to the Store class. (bdistin)

### Changed

- [[`3b03c49933`](https://github.com/dirigeants/klasa/commit/3b03c499339cfadb54f4e7b5e3d207e0c047b984)] ([#93](https://github.com/dirigeants/klasa/pull/93)) Overhauled tutorials. (MrJacz)
- [[`b11938d636`](https://github.com/dirigeants/klasa/commit/b11938d636105d2ed24909eef31bc3b76905581f)] ([#94](https://github.com/dirigeants/klasa/pull/94)) Better stopwatch. (bdistin)
- [[`c096d8fac0`](https://github.com/dirigeants/klasa/commit/c096d8fac0dfdb27d4fdca7100e5c2253910b358)] ([#81](https://github.com/dirigeants/klasa/pull/81)) Command handler improvements. (bdistin)
- [[`a0663a2dd9`](https://github.com/dirigeants/klasa/commit/a0663a2dd9136abe44954bb45f4c979f9b50e337)] Updated readme. (bdistin)
- [[`7c12364888`](https://github.com/dirigeants/klasa/commit/7c123648882def14fd08efc2beb4884c01f4b8db)] ([#73](https://github.com/dirigeants/klasa/pull/73)) **[DEPS]** Updated ESLint from `4.9.0` to `4.10.0`. (bdistin)
- [[`4f82726429`](https://github.com/dirigeants/klasa/commit/4f82726429b70645611828cfd5e430be87a0bdf9)] ([#68](https://github.com/dirigeants/klasa/pull/68)) Updated the `CreatingCommands.md` tutorial to improve the option for `quotedStringSupport`. (Pandraghon)
- [[`eab6123d59`](https://github.com/dirigeants/klasa/commit/eab6123d593371547af753bc30279cd6148ed0af)] **[DEPS]** Updated moment from `2.18.1` to `2.19.1`, eslint from `4.6.1` to `4.9.0`, `tslint` from `5.7.0` to `5.8.0` and typescript from `2.5.2` to `2.5.3`. (bdistin)
- [[`c188ad98ab`](https://github.com/dirigeants/klasa/commit/c188ad98ab8af264df7ec68479bed50f23c7ab9a)] **[DEPS]** Updated fs-nextra from `0.3.0` to `0.3.2`. (bdistin)
- [[`92ef3cba08`](https://github.com/dirigeants/klasa/commit/92ef3cba08d8f75bb1dc91a29159399bf1e80650)] Better usage for the transfer command. (bdistin)
- [[`c24e3f7b7a`](https://github.com/dirigeants/klasa/commit/c24e3f7b7aa5b1b522ddbbf5bc1553571cd68d67)] ([#59](https://github.com/dirigeants/klasa/pull/59)) Renamed `messageBulkDelete` to `messageDeleteBulk`. (ghost)
- [[`2603688f84`](https://github.com/dirigeants/klasa/commit/2603688f8405e3871f0f45e3eb5185eced468222)] Updated the `sendMessage` extendable. (bdistin)

### Removed

- [[`c096d8fac0`](https://github.com/dirigeants/klasa/commit/c096d8fac0dfdb27d4fdca7100e5c2253910b358)] ([#81](https://github.com/dirigeants/klasa/pull/81)) Removed `prefixMention` from `ClientOptions`. (bdistin)
- [[`b93cfb57fb`](https://github.com/dirigeants/klasa/commit/b93cfb57fb7f3e4eaaa2bdde88b892cd76e36e35)] ([#65](https://github.com/dirigeants/klasa/pull/65)) **[DEPS]** Removed `performance-now` as a dependency (replaced with `perf_hooks`). Bumped Node.js' minimum version to `8.5.0`. (bdistin)

### Fixed

- [[`889c8e53dd`](https://github.com/dirigeants/klasa/commit/889c8e53dd5c9bc98f5935d540b6959b00b0eed4)] Fixed [#97](https://github.com/dirigeants/klasa/issues/97). (bdistin)
- [[`dbc477d846`](https://github.com/dirigeants/klasa/commit/dbc477d8468b221f06328c002447d05c890dcc58)] Fixed [#96](https://github.com/dirigeants/klasa/issues/96). (bdistin)
- [[`e0ff381d13`](https://github.com/dirigeants/klasa/commit/e0ff381d13cc14141501da91518561e27e60cd45)] ([#90](https://github.com/dirigeants/klasa/pull/90)) Fix incorrect KlasaClientConfig typing. (KenanY)
- [[`390c1035e1`](https://github.com/dirigeants/klasa/commit/390c1035e15af3d07bf5fc86ebfb6d0a00893852)] ([#91](https://github.com/dirigeants/klasa/pull/91)) Fix `RichMenu#run()` return value type. (KenanY)
- [[`78b96b90bb`](https://github.com/dirigeants/klasa/commit/78b96b90bba8344303d008bb37f18cd2d7266702)] ([#77](https://github.com/dirigeants/klasa/pull/77)) Fixed `IncludedEvents.md`. (Pandraghon)
- [[`2b40342a12`](https://github.com/dirigeants/klasa/commit/2b40342a12d02c1b7d41e19d9fef2bac40423012)] Fixed the initial edit for RichDisplay. (bdistin)
- [[`1443d3b9f2`](https://github.com/dirigeants/klasa/commit/1443d3b9f2d422e9b032586fc53ca130dd034ba9)] Fixed the loading bug. (bdistin)
- [[`b6df5b5816`](https://github.com/dirigeants/klasa/commit/b6df5b58161d9335412801559ec3c3af1594a159)] ([#76](https://github.com/dirigeants/klasa/pull/76)) Fix for commands that return a virtual "never". (kyranet)
- [[`c429420cb2`](https://github.com/dirigeants/klasa/commit/c429420cb2856ff65fce688a845ae1fc4bf0b199)] Fixed the event emit to `commandError`  from the `commandHandler` monitor firing up even when there's not an error. (bdistin)
- [[`53eacfb9f8`](https://github.com/dirigeants/klasa/commit/53eacfb9f89114ce446638b5dc02ce4467dd7348)] Removed a double check. (bdistin)
- [[`3a1e4e9280`](https://github.com/dirigeants/klasa/commit/3a1e4e9280ecf873c3a31fa90195e36c06f03e17)] Fixed [#75](https://github.com/dirigeants/klasa/issues/75). (bdistin)
- [[`df6e6e90e3`](https://github.com/dirigeants/klasa/commit/df6e6e90e33d45e7ecc384a03da847c3f3ae7147)] Fixed some JSDocs (`@since`s are on constructors for classes instead of on the classes). (bdistin)
- [[`9cea94b0c1`](https://github.com/dirigeants/klasa/commit/9cea94b0c19ae2541ed732eb39603e09905d4742)] Fixed [#74](https://github.com/dirigeants/klasa/issues/74). (bdistin)
- [[`f67605d2a4`](https://github.com/dirigeants/klasa/commit/f67605d2a4adcb6c6efd80898b499d1aa1f23d47)] ([#56](https://github.com/dirigeants/klasa/pull/56)) Fixed RichMenu empty page and typings. (HellPie)
- [[`62760a52d1`](https://github.com/dirigeants/klasa/commit/62760a52d19b6d87f7b11364c82fb72f852dcbf7)] ([#71](https://github.com/dirigeants/klasa/pull/71)) Fixed a typo in `UnderstandingPermissionLevels.md`. (Pandraghon)
- [[`f140927c4b`](https://github.com/dirigeants/klasa/commit/f140927c4b44af2f211ce5a3b589235b451c13fa)] ([#69](https://github.com/dirigeants/klasa/pull/69)) Fixed `hasAtLeastPermissionLevel` spelling error ([#63](https://github.com/dirigeants/klasa/issues/63)). (Kashalls)
- [[`52af6be2c9`](https://github.com/dirigeants/klasa/commit/52af6be2c9f515f96e831d36bf3cf6139c8b326f)] ([#66](https://github.com/dirigeants/klasa/pull/66)) Fixed many bugs from the `Console` class. (kyranet)
- [[`868bfab4b3`](https://github.com/dirigeants/klasa/commit/868bfab4b315f91b179c213cf0fcd615b3742cd9)] ([#64](https://github.com/dirigeants/klasa/pull/64)) Fixed a misspelling in structures/Provider. (Pandraghon)
- [[`d7d591bbfe`](https://github.com/dirigeants/klasa/commit/d7d591bbfe9d71778b01726b8b68542da17979ba)] Fixed a little bug in the template for RichDisplay. (bdistin)
- [[`de92f50a8d`](https://github.com/dirigeants/klasa/commit/de92f50a8dba9321ba46be51a8f56b9f35bc3b69)] Fixed a code error in the RichDisplay tutorial. (bdistin)
- [[`584409046f`](https://github.com/dirigeants/klasa/commit/584409046f40924d06b8b9e64512b18e5c6fe072)] Fixed some docs in util/util. (bdistin)
- [[`858552c019`](https://github.com/dirigeants/klasa/commit/858552c0196146d7849c6a47b8caaa576137fcbe)] Added a missing `@readonly` tag to a JSDoc. (bdistin)

<!--
Needs to update the 0.5.0 changelog with the format of 0.4.0's, and include links to the tutorials as well as the user who contributed for each change.
-->

<!--
Current progress:
https://github.com/dirigeants/klasa/commits/master?after=550ac275c849c285692ffff5c4e99cb53753a85b+69
-->

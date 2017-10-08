# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Dev] - 0.4.0
### Added
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added deprecatable extendables.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] `Message/Guild#fetchLanguage(string?);` and `Message/Guild#fetchLanguageCode(...string);` for usage when the CacheProvider that manages the cache for the Guild settings returns Promises.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] `Message#fetchGuildSettings();` and `Guild#fetchSettings();`, similar to `Message#guildSettings;` and `Guild#settings;` respectively, but supporting asynchronous operations.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] `Schema` and `SchemaPiece` classes, with helper methods that allow the gateway parse and retrieve data much faster, as well as following the OOP paradigm when it comes to modifying the schema and much friendlier to use.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] More options to `SettingsCache#add`, allowing you to set different providers in different gateway instances.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added **Folder** type (nested objects, yay!).
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added `SchemaPiece.configurable` to avoid certain keys to be processed by the default conf command.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added **any** type to SettingsResolver. Assigning this type to a SchemaPiece will make it set the property configureable to false, it accepts anything you pass to it, even objects. So you must use dedicated commands to configure these keys instead. (For example, you can store an array of objects with a certain number of properties, something not possible in the previous versions as the conf command cannot parse objects correctly).
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[PERF]** Much better, accurate and faster SchemaPiece validation and parsing.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[PERF]** Added `Schema.toJSON();`, which converts the classes into a plain JSON object. This method is 27^level times faster than iterating over it with `Object.keys`. (No, it's not recursive, it uses "branch query" and a pre-processed Set to iterate over keys).
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added a new util: `parseDottedObject`. Used for `GatewaySQL` (to parse dotted objects). Performance is 797k ops/sec when parsing objects with 6 keys. And it's not recursive. (Recursive resulted to be buggy and 4.18 times slower).
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added a **Collection** provider.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added `Provider.cache`.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added full support for asynchronous CacheProviders.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Added GatewaySQL (extends Gateway, overriding the methods for better SQL parsing).

### Changed
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[BREAKING]** `Gateway#get` -> `Gateway#getEntry` (sync) and `Gateway#fetchEntry` (async).
- [[#43](https://github.com/dirigeants/klasa/pull/43)] QoL fix in the help command. Tell you when a command is not found and prevent users from checking it when they don't have permissions.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] All pieces to support asynchronous CacheProviders.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[BREAKING]** `Gateway#update` -> `Gateway#updateOne`, which does not accept an object (use `Gateway#updateMany` instead).
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[BREAKING]** `Gateway#updateOne`, `Gateway#updateMany`, `Gateway#reset` and `Gateway#updateArray` can now filter unconfigureable keys if the parameter `avoidUnconfigurable` is passed and set to `true`.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] `Gateway#schema` is not longer a plain object, but a `Schema` instance.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[PERF]** Iterating over the keys from `Schema` is now ~27.75 times faster.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[PERF]** Better tuplifier parser for SQL. (~13.87 times faster).
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[PERF]** Improved updateArray remove method. (~1.85 times faster).
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[PERF]** The cache now updates from the cache instead of re-syncing with the DB. (When using JSON and Collection, Samsung SSD at 600 MB/s read, performance is improved by 97k ops/sec to 53M ops/sec, 454 times faster).
- [[#43](https://github.com/dirigeants/klasa/pull/43)] `Gateway#updateOne` now accepts array type. It'll call the private method that does the parsing for updateArray.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[BREAKING]** SQL parsing is now done in basic types, not in a NoSQL environment (avoiding object parsing, object to multiquery, to array, to string, but directly parsed and to string). (Parsing speed increased up to 27k times, should be almost at NoSQL's performance).
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[PERF]** SQL query creation should be at least twice faster now.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[PERF]** When using `SettingResolver`, SettingGateway will not longer do `type.toLowerCase()`, but they're lowercase'd at startup.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Improved SettingGateway startup speed.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Renamed the main class from SettingGateway to Gateway.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[BREAKING]** Gateway do not longer extend SchemaManager and CacheManager, but it's a class by itself.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Made the types that SettingGateway accepts for the key types dynamic (based on SettingResolver's prototype) and public throught `Client.settings.types;`.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **Pending** Changed some methods from SQLProviders to remove the NoSQL -> SQL middleware.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] **[BREAKING]** `Command.fullUsage(msg);` to accept a string with the prefix instead of a message and fetch the settings.

### Removed
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Removed the `SQL` class. Replaced by GatewaySQL and Schema/Piece.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Removed the `CacheManager` class. Replaced by CacheProviders.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Removed `Gateway#add`. Replaced to `Schema#addKey`.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Removed `Gateway#remove`. Replaced to `Schema#removeKey`.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Removed `SQLProvider#serialize`, `SQLProvider#sanitize`, `SQLProvider#CONSTANTS`.

### Fixed
- [[#43](https://github.com/dirigeants/klasa/pull/43)] The eval command being unable to catch certain errors.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Fixed the JSON provider throwing errors.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Fixed multiple minor issues.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] Store loader not showing error stack.
- [[#43](https://github.com/dirigeants/klasa/pull/43)] JSON provider loading files that are not JSON.

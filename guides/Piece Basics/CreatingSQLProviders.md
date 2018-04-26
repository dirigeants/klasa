This guide extends {@tutorial CreatingProviders} and aims for SQL providers. As mentioned previously, {@link Provider providers} are special pieces designed for database interaction.

## Compatibility

This piece existed during SettingGateway v1 (from 0.0.1 to 0.4.0) but got unified with normal providers after SettingGateway v2, although getting a very different behaviour and inconsistency. {@link SQLProvider SQLProviders} came back after [SettingGateway v2.2.0](https://github.com/dirigeants/klasa/pull/284) aiming to make a more consistent library interface as well as separating the needs from a NoSQL database with SQL databases.

> **NOTE**: This is an **advanced** tutorial, please consider downloading a provider from [klasa-pieces](https://github.com/dirigeants/klasa-pieces/tree/master/providers).

## Base Code

```javascript
const { SQLProvider } = require('klasa');

module.exports = class extends SQLProvider {

	// All other Provider methods

	async addColumn() {
		// The addColumn method which inserts/creates a new table to the database.
	}

	async removeColumn() {
		// The removeColumn method which inserts/creates a new table to the database.
	}

};
```

The example above is a boilerplate code for a Klasa SQL Provider, complementing with all the methods from {@tutorial CreatingProviders}, interfacing with the {@link UnderstandingSettingGateway SettingGateway}.

## Helpers

The {@link SQLProvider} class provides several resources to help the developer reduce the code duplication:

- {@link SQLProvider#parseValue `SQLProvider#parseValue()`}: Converts a value into standard JavaScript objects, useful for SQL databases that do not cover all JavaScript primitives.
- {@link SQLProvider#parseEntry `SQLProvider#parseEntry()`}: Converts plain dotted objects into parsed objects with nested object support. Uses the helper above to parse entries, and is powered by {@link SettingGateway UnderstandingSettingGateway} to improve security and parsing speed.

## Configuration

The configuration is inherited by {@link Provider Providers}, SQL Providers only provide extra tools to convert SQL output to compatible JS objects.

## Further Reading:

- {@tutorial CreatingCommands}
- {@tutorial CreatingEvents}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingProviders}
- {@tutorial CreatingTasks}

Data Providers are special classes designed to make your life easier when you're using a **database**, there are several rules to make them compatible with {@tutorial UnderstandingSettingGateway SettingGateway}. Fortunately, this kind of piece are already made and available in [klasa-pieces](https://github.com/dirigeants/klasa-pieces/tree/master/providers). By default, Klasa uses JSON to store per-guild configuration.

## Compatibility

Since [SettingGateway v2.2](https://github.com/dirigeants/klasa/pull/228), support for cache providers dropped and SettingGateway's middleware reduced: the data conversion has to be made in the providers in the way they feel more confortable with. If you work with a SQL provider, please follow this guide and {@link CreatingSQLProviders} later. Also consider to use one of the already made providers from klasa-pieces.

> **NOTE**: Providers may change over time. As a result, old providers may not be fully compatible with the latest versions of Klasa and SettingGateway. However, newer providers may be fully retrocompatible.

## Base Code

```javascript
const { Provider } = require('klasa');

module.exports = class extends Provider {

	constructor(...args) {
		super(...args, {
			name: 'providerName',
			description: 'Allows you to use DB functionality throughout Klasa'
		});
	}

	async init() {
		// The init method, usually checking file existence in file based
		// databases or connect to them.
	}

	/* Table methods */

	async hasTable(table) {
		// The code to check if a table exists
	}

	async createTable(table) {
		// The code to create a table, in SQL databases, they take two
		// arguments.
	}

	async deleteTable(table) {
		// The code to delete/drop a table.
	}

	/* Document methods */

	async getAll(table) {
		// Get all values from a table
	}

	async getKeys(table) {
		// Get all keys (ids) from a table
	}

	async get(table, entryID) {
		// Get an entry from a table
	}

	async has(table, entryID) {
		// Check if the entry exists in a table
	}

	async create(table, entryID, data) {
		// Create a new entry to a table
	}

	async update(table, entryID, data) {
		// Update an entry from a table
	}

	async updateValue(table, path, newValue) {
		// Update the value of an object/column in all entries from a table
	}

	async removeValue(table, path) {
		// Remove the value of an object/column in all entries from a table
	}

	async replace(table, entryID, data) {
		// Perform a destructive write, where the previous data gets overwritten by the new one
	}

	async delete(table, entryID) {
		// Delete an entry from a table
	}

};
```

The example above is a boilerplate code for a Klasa Provider, interfacing with the {@link UnderstandingSettingGateway SettingGateway}.

## Helpers

The {@link Provider} class provides several resources to help the developer reduce the code duplication:

- {@link Provider#parseInput `Provider#parseInput()`}: Abstracts all three overloads and returns a JSON object.

## Configuration

| Name            | Default       | Type    | Description                                  |
| --------------- | ------------- | ------- | -------------------------------------------- |
| **name**        | `theFileName` | string  | The name of the provider                     |
| **enabled**     | `true`        | boolean | Whether the provider is enabled or not       |
| **description** | `''`          | string  | The provider description                     |

## Accessibility

All data providers are available via {@link KlasaClient#providers}, which is a {@link ProviderStore collection} of {@link Provider providers}, so if your provider is called `rethink`, you would access to it with the following code:

```javascript
const provider = this.client.providers('rethink');
```

## SQL Providers

One of [PR#228 (SettingGateway v2.2)](https://github.com/dirigeants/klasa/pull/228) additions was the {@link SQLProvider}. This class extends {@link Provider} and provides a dedicated interface for SQL providers as well as its own helpers, check it {@tutorial CreatingSQLProviders here}.

## Further Reading:

- {@tutorial CreatingSQLProviders}
- {@tutorial CreatingCommands}
- {@tutorial CreatingEvents}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingTasks}

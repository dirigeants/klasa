Data Providers are special classes designed to make your life easier when you're
using a **database**, there's **no** rule to make them. By default, Klasa uses
JSON to store per-guild configuration.

When you create a data provider, you can access to them by: `client.providers.get(ProviderName)`.

```javascript
const { Provider } = require('klasa');

module.exports = class extends Provider {

	constructor(...args) {
		super(...args, {
			name: 'providerName',
			description: 'Allows you to use DB functionality throughout Klasa'
		});
	}

	init() {
		// The init method, usually checking file existence in file based
		// databases or connect to them.
	}

	/* Table methods */

	hasTable(table) {
		// The code to check if a table exists
	}

	createTable(table) {
		// The code to create a table, in SQL databases, they take two
		// arguments.
	}

	deleteTable(table) {
		// The code to delete/drop a table.
	}

	/* Document methods */

	getAll(table) {
		// Get all values from a table
	}

	getKeys(table) {
		// Get all keys (ids) from a table
	}

	get(table, entryID) {
		// Get an entry from a table
	}

	has(table, entryID) {
		// Check if the entry exists in a table
	}

	getRandom(table) {
		// Get a random key from the a table
	}

	create(table, entryID, data) {
		// Create a new entry to a table
	}

	set(...args) {
		// Reserved for retro-compatibility
		return this.create(...args);
	}

	insert(...args) {
		// Reserved for retro-compatibility
		return this.create(...args);
	}

	update(table, entryID, data) {
		// Update an entry from a table
	}

	updateValue(table, path, newValue) {
		// Update the value of an object/column in all entries from a table
	}

	removeValue(table, path) {
		// Remove the value of an object/column in all entries from a table
	}

	replace(table, entryID, data) {
		// Perform a destructive write, where the previous data gets overwritten by the new one
	}

	delete(table, entryID) {
		// Delete an entry from a table
	}

};

```

The example above is the JSON provider used in klasa, and interfacing with the {@link SettingsGateway}.

## Configuration

| Name            | Default       | Type    | Description                                  |
| --------------- | ------------- | ------- | -------------------------------------------- |
| **name**        | `theFileName` | string  | The name of the provider                     |
| **enabled**     | `true`        | boolean | Whether the provider is enabled or not       |
| **description** | `''`          | string  | The provider description                     |
| **sql**         | `false`       | boolean | If the provider provides to a sql datasource |
| **cache**       | `false`       | boolean | Whether the provider is meant for caching    |

## Accessing Providers

The {@link ProviderStore providers} are stored in the main {@link KlasaClient} object, in the {@link KlasaClient#providers providers} property. This has an entry
for each provider added, based on its `name`. So for example if you have it set as
`postgresql` , you can access it through `client.providers.get('postgresql');`.

## Further Reading:

- {@tutorial CreatingCommands}
- {@tutorial CreatingEvents}
- {@tutorial CreatingExtendables}
- {@tutorial CreatingFinalizers}
- {@tutorial CreatingInhibitors}
- {@tutorial CreatingLanguages}
- {@tutorial CreatingMonitors}
- {@tutorial CreatingTasks}
